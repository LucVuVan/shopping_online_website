/**
 * products.js - Quản lý sản phẩm admin
 */

// ===== DATA MẪU =====
let products = [
    { id: 1, name: 'Áo Thun Basic Trắng',   category: 'Áo',   price: 299000, stock: 45, sold: 128, status: 'active',   img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop', sizes: ['S','M','L'], colors: ['Trắng','Đen'], desc: '', coupon: '', couponType: 'percent', couponValue: '' },
    { id: 2, name: 'Quần Jean Slim Fit',     category: 'Quần', price: 599000, stock: 32, sold: 95,  status: 'active',   img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop', sizes: ['M','L','XL'], colors: ['Xanh'], desc: '', coupon: '', couponType: 'percent', couponValue: '' },
    { id: 3, name: 'Áo Sơ Mi Trắng',        category: 'Áo',   price: 450000, stock: 28, sold: 67,  status: 'active',   img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop', sizes: ['S','M'], colors: ['Trắng'], desc: '', coupon: 'SALE10', couponType: 'percent', couponValue: 10 },
    { id: 4, name: 'Váy Hoa Vintage',        category: 'Váy',  price: 380000, stock: 8,  sold: 54,  status: 'inactive', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop', sizes: ['XS','S','M'], colors: ['Đỏ','Vàng'], desc: '', coupon: '', couponType: 'percent', couponValue: '' },
    { id: 5, name: 'Giày Sneaker Trắng',     category: 'Giày', price: 699000, stock: 0,  sold: 203, status: 'out',      img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop', sizes: [], colors: ['Trắng'], desc: '', coupon: 'FREESHIP', couponType: 'shipping', couponValue: '' },
    { id: 6, name: 'Đồng Hồ Thời Trang',    category: 'Phụ kiện', price: 1299000, stock: 15, sold: 41, status: 'active', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop', sizes: [], colors: ['Đen'], desc: '', coupon: '', couponType: 'percent', couponValue: '' },
];

let editingId   = null;
let deleteId    = null;
let slotImages  = [null, null, null, null];
let activeSlot  = 0;

// ===== LOAD CATEGORIES FROM STORAGE =====
function loadCategoryOptions() {
    const sel = document.getElementById('pfmCategory');
    if (!sel) return;

    let cats = [];
    try {
        const saved = localStorage.getItem('adminCategories');
        cats = saved ? JSON.parse(saved) : [];
    } catch { cats = []; }

    // Fallback nếu chưa có data
    if (!cats.length) {
        cats = [
            { id: 1, name: 'Đồ Nam', parentId: null },
            { id: 2, name: 'Áo', parentId: 1 },
            { id: 3, name: 'Quần', parentId: 1 },
            { id: 5, name: 'Đồ Nữ', parentId: null },
            { id: 6, name: 'Váy', parentId: 5 },
            { id: 9, name: 'Đồ Trẻ em', parentId: null },
            { id: 10, name: 'Giày dép', parentId: null },
        ];
    }

    const roots    = cats.filter(c => !c.parentId);
    const children = cats.filter(c => c.parentId);

    sel.innerHTML = `<option value="">Chọn danh mục</option>`;

    roots.forEach(root => {
        const kids = children.filter(c => c.parentId === root.id);
        if (kids.length > 0) {
            sel.innerHTML += `<optgroup label="${root.name}">` +
                kids.map(k => `<option value="${k.name}">${k.name}</option>`).join('') +
                `</optgroup>`;
        } else {
            sel.innerHTML += `<option value="${root.name}">${root.name}</option>`;
        }
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadCategoryOptions();
    renderTable();
    updateStats();
    bindEvents();
});

// ===== STATS =====
function updateStats() {
    document.getElementById('statTotal').textContent  = products.length;
    document.getElementById('statActive').textContent = products.filter(p => p.status === 'active').length;
    document.getElementById('statLow').textContent    = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    document.getElementById('statOut').textContent    = products.filter(p => p.stock === 0).length;
}

// ===== RENDER TABLE =====
function renderTable(filter = '') {
    const tbody = document.getElementById('productTableBody');
    const list  = filter
        ? products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.category.toLowerCase().includes(filter.toLowerCase()))
        : products;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-text);">Không tìm thấy sản phẩm nào</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(p => `
        <tr>
            <td>
                <div class="prod-cell">
                    <img src="${p.img}" alt="${p.name}">
                    <div>
                        <div class="prod-cell-name">${p.name}</div>
                        <div class="prod-cell-id">ID: ${p.id}</div>
                    </div>
                </div>
            </td>
            <td><span class="cat-badge">${p.category}</span></td>
            <td class="prod-price">${p.price.toLocaleString('vi-VN')}đ</td>
            <td class="${p.stock === 0 ? 'stock-out' : p.stock <= 10 ? 'stock-low' : 'stock-ok'}">${p.stock}</td>
            <td>${p.sold}</td>
            <td>${statusBadge(p.status)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn-edit" onclick="openEdit(${p.id})" title="Chỉnh sửa">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-delete" onclick="openDelete(${p.id})" title="Xóa">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6"/>
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function statusBadge(s) {
    const map = { active: ['Đang bán', 'active'], inactive: ['Ngừng bán', 'inactive'], out: ['Hết hàng', 'out'] };
    const [label, cls] = map[s] || ['—', ''];
    return `<span class="status-badge ${cls}">${label}</span>`;
}

// ===== MODAL HELPERS =====
function openModal() {
    document.getElementById('productModalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('productModalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    editingId = null;
    resetForm();
}

function resetForm() {
    document.getElementById('pfmName').value        = '';
    document.getElementById('pfmCategory').value    = '';
    document.getElementById('pfmPrice').value       = '';
    document.getElementById('pfmStock').value       = '';
    document.getElementById('pfmDesc').value        = '';
    document.getElementById('pfmCoupon').value      = '';
    document.getElementById('pfmCouponType').value  = 'percent';
    document.getElementById('pfmCouponValue').value = '';
    document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
    slotImages = [null, null, null, null];
    renderImgSlots();
}

// ===== ADD =====
function openAdd() {
    editingId = null;
    resetForm();
    loadCategoryOptions();
    document.getElementById('modalTitle').textContent   = 'Thêm sản phẩm mới';
    document.getElementById('btnSaveModal').textContent = 'Thêm sản phẩm';
    openModal();
}

// ===== EDIT =====
function openEdit(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    editingId = id;
    loadCategoryOptions();

    document.getElementById('modalTitle').textContent   = 'Chỉnh sửa sản phẩm';
    document.getElementById('btnSaveModal').textContent = 'Lưu thay đổi';

    document.getElementById('pfmName').value     = p.name;
    document.getElementById('pfmCategory').value = p.category;
    document.getElementById('pfmPrice').value    = p.price;
    document.getElementById('pfmStock').value    = p.stock;
    document.getElementById('pfmDesc').value     = p.desc || '';

    // Coupon
    document.getElementById('pfmCoupon').value      = p.coupon || '';
    document.getElementById('pfmCouponType').value  = p.couponType || 'percent';
    document.getElementById('pfmCouponValue').value = p.couponValue || '';
    toggleCouponValue();

    // Sizes
    document.querySelectorAll('#sizeSelector .tag-btn').forEach(b => {
        b.classList.toggle('active', p.sizes?.includes(b.dataset.val));
    });

    // Colors
    document.querySelectorAll('#colorSelector .tag-btn').forEach(b => {
        b.classList.toggle('active', p.colors?.includes(b.dataset.val));
    });

    // Image
    slotImages = [p.img, null, null, null];
    renderImgSlots();

    openModal();
}

// ===== DELETE =====
function openDelete(id) {
    const p = products.find(x => x.id === id);
    deleteId = id;
    document.getElementById('deleteMsg').textContent = `Bạn có chắc muốn xóa "${p?.name}"? Hành động này không thể hoàn tác.`;
    document.getElementById('deleteOverlay').style.display = 'flex';
    setTimeout(() => document.getElementById('deleteOverlay').classList.add('open'), 10);
    document.body.style.overflow = 'hidden';
}

function closeDelete() {
    document.getElementById('deleteOverlay').classList.remove('open');
    setTimeout(() => { document.getElementById('deleteOverlay').style.display = 'none'; }, 200);
    document.body.style.overflow = '';
    deleteId = null;
}

// ===== SAVE =====
function saveProduct() {
    const name     = document.getElementById('pfmName').value.trim();
    const category = document.getElementById('pfmCategory').value;
    const price    = parseInt(document.getElementById('pfmPrice').value);
    const stock    = parseInt(document.getElementById('pfmStock').value) || 0;
    const desc     = document.getElementById('pfmDesc').value.trim();
    const coupon   = document.getElementById('pfmCoupon').value.trim().toUpperCase();
    const couponType  = document.getElementById('pfmCouponType').value;
    const couponValue = document.getElementById('pfmCouponValue').value;

    if (!name)     { alert('Vui lòng nhập tên sản phẩm!');  return; }
    if (!category) { alert('Vui lòng chọn danh mục!');      return; }
    if (!price)    { alert('Vui lòng nhập giá bán!');        return; }

    const sizes  = [...document.querySelectorAll('#sizeSelector .tag-btn.active')].map(b => b.dataset.val);
    const colors = [...document.querySelectorAll('#colorSelector .tag-btn.active')].map(b => b.dataset.val);
    const img    = slotImages[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop';

    const status = stock === 0 ? 'out' : 'active';

    if (editingId) {
        const idx = products.findIndex(p => p.id === editingId);
        if (idx !== -1) {
            products[idx] = { ...products[idx], name, category, price, stock, desc, sizes, colors, img, status, coupon, couponType, couponValue: couponValue ? Number(couponValue) : '' };
        }
    } else {
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, name, category, price, stock, sold: 0, desc, sizes, colors, img, status, coupon, couponType, couponValue: couponValue ? Number(couponValue) : '' });
    }

    renderTable();
    updateStats();
    closeModal();
}

// ===== IMAGE SLOTS =====
function renderImgSlots() {
    document.querySelectorAll('.img-slot').forEach((slot, i) => {
        const src = slotImages[i];
        if (src) {
            slot.innerHTML = `
                <img src="${src}" alt="">
                <button class="img-slot-remove" onclick="clearSlot(${i}, event)">×</button>`;
        } else {
            slot.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="#bbb" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Tải ảnh lên</span>`;
        }
    });
}

function clearSlot(i, e) {
    e.stopPropagation();
    slotImages[i] = null;
    renderImgSlots();
}

// ===== COUPON VALUE TOGGLE =====
function toggleCouponValue() {
    const type = document.getElementById('pfmCouponType').value;
    const wrap = document.getElementById('couponValueWrap');
    wrap.style.display = type === 'shipping' ? 'none' : '';
}

// ===== BIND EVENTS =====
function bindEvents() {
    // Search
    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        renderTable(e.target.value);
    });

    // Open add
    document.getElementById('btnOpenAdd')?.addEventListener('click', openAdd);

    // Close modal
    document.getElementById('btnCloseModal')?.addEventListener('click', closeModal);
    document.getElementById('btnCancelModal')?.addEventListener('click', closeModal);
    document.getElementById('productModalOverlay')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('productModalOverlay')) closeModal();
    });

    // Save
    document.getElementById('btnSaveModal')?.addEventListener('click', saveProduct);

    // Delete confirm
    document.getElementById('btnCancelDelete')?.addEventListener('click', closeDelete);
    document.getElementById('btnConfirmDelete')?.addEventListener('click', () => {
        products = products.filter(p => p.id !== deleteId);
        renderTable();
        updateStats();
        closeDelete();
    });

    // Tag selectors
    document.querySelectorAll('.tag-selector .tag-btn').forEach(btn => {
        btn.addEventListener('click', () => btn.classList.toggle('active'));
    });

    // Image slots
    document.querySelectorAll('.img-slot').forEach((slot, i) => {
        slot.addEventListener('click', () => {
            activeSlot = i;
            document.getElementById('imgFileInput').click();
        });
    });

    document.getElementById('imgFileInput')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            slotImages[activeSlot] = ev.target.result;
            renderImgSlots();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    // Coupon type toggle
    document.getElementById('pfmCouponType')?.addEventListener('change', toggleCouponValue);

    // Coupon uppercase
    document.getElementById('pfmCoupon')?.addEventListener('input', (e) => {
        const pos = e.target.selectionStart;
        e.target.value = e.target.value.toUpperCase();
        e.target.setSelectionRange(pos, pos);
    });
}