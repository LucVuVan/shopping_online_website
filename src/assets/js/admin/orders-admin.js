/**
 * orders-admin.js - Quản lý đơn hàng admin
 */

const STATUS_MAP = {
    pending:    { label: 'Chờ xử lý',  cls: 'pending'    },
    processing: { label: 'Đang xử lý', cls: 'processing' },
    shipping:   { label: 'Đang giao',  cls: 'shipping'   },
    completed:  { label: 'Hoàn thành', cls: 'completed'  },
    cancelled:  { label: 'Đã hủy',     cls: 'cancelled'  },
};

const TRACK_STEPS = [
    { key: ['pending','processing','shipping','completed'], label: 'Đặt hàng', icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>` },
    { key: ['processing','shipping','completed'],           label: 'Xử lý',    icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
    { key: ['shipping','completed'],                        label: 'Đang giao',icon: `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>` },
    { key: ['completed'],                                   label: 'Hoàn thành',icon:`<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>` },
];

let orders = [
    {
        id: '#DH-2026-001', customer: 'Nguyễn Văn A', phone: '0901234567',
        date: '29 ngày trước', total: 1028000, status: 'pending',
        address: '123 Nguyễn Huệ, Quận 1, TP. HCM', payMethod: 'COD', payStatus: 'unpaid',
        products: [
            { name: 'Áo thun cotton basic (M)', qty: 2, price: 199000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop' },
            { name: 'Quần short kaki (L)',      qty: 1, price: 259000, img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=120&h=120&fit=crop' },
            { name: 'Áo sơ mi trắng (M)',       qty: 1, price: 299000, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&h=120&fit=crop' },
        ],
        shipping: 30000,
    },
    {
        id: '#DH-2026-002', customer: 'Trần Thị B', phone: '0912345678',
        date: '29 ngày trước', total: 1288000, status: 'processing',
        address: '45 Lê Lợi, Quận 3, TP. HCM', payMethod: 'Chuyển khoản', payStatus: 'paid',
        products: [
            { name: 'Váy hoa mùa hè (S)',      qty: 2, price: 319000, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&h=120&fit=crop' },
            { name: 'Đồng hồ thời trang',       qty: 1, price: 350000, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop' },
        ],
        shipping: 0,
    },
    {
        id: '#DH-2026-003', customer: 'Lê Văn C', phone: '0923456789',
        date: '29 ngày trước', total: 419000, status: 'shipping',
        address: '78 Trần Phú, Hà Đông, Hà Nội', payMethod: 'COD', payStatus: 'unpaid',
        products: [
            { name: 'Áo khoác denim (M)',       qty: 1, price: 389000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&h=120&fit=crop' },
        ],
        shipping: 30000,
    },
    {
        id: '#DH-2026-004', customer: 'Phạm Thị D', phone: '0934567890',
        date: 'khoảng 1 tháng trước', total: 799000, status: 'completed',
        address: '12 Hoàng Diệu, Đà Nẵng', payMethod: 'Chuyển khoản', payStatus: 'paid',
        products: [
            { name: 'Giày sneaker trắng (39)',  qty: 1, price: 699000, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&h=120&fit=crop' },
        ],
        shipping: 30000,
    },
    {
        id: '#DH-2026-005', customer: 'Hoàng Văn E', phone: '0945678901',
        date: 'khoảng 1 tháng trước', total: 629000, status: 'cancelled',
        address: '56 Ngô Quyền, Hà Nội', payMethod: 'COD', payStatus: 'unpaid',
        products: [
            { name: 'Quần jean skinny (30)',    qty: 1, price: 359000, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=120&h=120&fit=crop' },
            { name: 'Áo thun cotton basic (L)', qty: 1, price: 199000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop' },
        ],
        shipping: 30000,
    },
    {
        id: '#DH-2026-006', customer: 'Đỗ Thị F', phone: '0956789012',
        date: '29 ngày trước', total: 1459000, status: 'pending',
        address: '89 Lý Thường Kiệt, TP. HCM', payMethod: 'COD', payStatus: 'unpaid',
        products: [
            { name: 'Đồng hồ thời trang',       qty: 1, price: 1299000, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop' },
            { name: 'Áo thun cotton basic (S)', qty: 1, price: 199000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=120&h=120&fit=crop' },
        ],
        shipping: 0,
    },
];

let viewingOrderId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTable();
    bindEvents();
});

// ===== STATS =====
function updateStats() {
    document.getElementById('osCountPending').textContent  = orders.filter(o => o.status === 'pending').length;
    document.getElementById('osCountShipping').textContent = orders.filter(o => o.status === 'shipping').length;
    document.getElementById('osCountDone').textContent     = orders.filter(o => o.status === 'completed').length;
    const rev = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
    const revM = (rev / 1000000).toFixed(1);
    document.getElementById('osRevenue').textContent = revM + 'M';
}

// ===== RENDER TABLE =====
function renderTable(search = '', dateFilter = '', statusFilter = '') {
    const tbody = document.getElementById('ordTableBody');
    let list = [...orders];

    if (search)       list = list.filter(o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search));
    if (statusFilter) list = list.filter(o => o.status === statusFilter);

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--gray-text)">Không tìm thấy đơn hàng</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(o => {
        const s = STATUS_MAP[o.status] || {};
        const isPending = o.status === 'pending';
        return `
        <tr>
            <td><span class="ord-id-link" onclick="openOrderDetail('${o.id}')">${o.id}</span></td>
            <td>
                <div class="ord-customer-name">${o.customer}</div>
                <div class="ord-customer-phone">${o.phone}</div>
            </td>
            <td>${o.date}</td>
            <td class="ord-amount">${o.total.toLocaleString('vi-VN')}đ</td>
            <td><span class="ord-badge ${s.cls}">${s.label}</span></td>
            <td>
                <div class="ord-action-btns">
                    ${isPending ? `
                    <button class="ord-btn-approve" onclick="changeStatus('${o.id}','processing')" title="Duyệt đơn">
                        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                    <button class="ord-btn-reject" onclick="changeStatus('${o.id}','cancelled')" title="Từ chối">
                        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>` : ''}
                    <button class="ord-btn-view" onclick="openOrderDetail('${o.id}')" title="Xem chi tiết">
                        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// ===== CHANGE STATUS =====
function changeStatus(id, newStatus) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    o.status = newStatus;
    updateStats();
    renderTable(
        document.getElementById('orderSearch').value,
        document.getElementById('orderDate').value,
        document.getElementById('orderStatusFilter').value
    );
    if (viewingOrderId === id) openOrderDetail(id);
}

// ===== OPEN ORDER DETAIL =====
function openOrderDetail(id) {
    const o = orders.find(x => x.id === id);
    if (!o) return;
    viewingOrderId = id;

    const s = STATUS_MAP[o.status] || {};
    document.getElementById('odmOrderId').textContent    = o.id;
    document.getElementById('odmOrderDate').textContent  = 'Ngày đặt: ' + o.date;
    document.getElementById('odmStatusBadge').className  = 'ord-badge ' + s.cls;
    document.getElementById('odmStatusBadge').textContent = s.label;

    // Tracking timeline
    const trackHTML = `<div class="odm-tracking-line"></div>` +
        TRACK_STEPS.map(step => {
            const active = o.status !== 'cancelled' && step.key.includes(o.status);
            return `
            <div class="odm-track-step ${active ? '' : 'inactive'}">
                <div class="odm-track-icon">${step.icon}</div>
                <span>${step.label}</span>
            </div>`;
        }).join('');
    document.getElementById('odmTracking').innerHTML = trackHTML;

    // Address & payment
    document.getElementById('odmAddrName').textContent    = o.customer;
    document.getElementById('odmAddrPhone').textContent   = o.phone;
    document.getElementById('odmAddrText').textContent    = o.address;
    document.getElementById('odmPayMethod').textContent   = o.payMethod;
    const payEl = document.getElementById('odmPayStatus');
    payEl.textContent = o.payStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán';
    payEl.className   = 'pay-status ' + (o.payStatus === 'paid' ? 'paid' : 'unpaid');

    // Products
    const subtotal = o.products.reduce((s, p) => s + p.price * p.qty, 0);
    document.getElementById('odmProducts').innerHTML = o.products.map(p => `
        <div class="odm-product-row">
            <img class="odm-product-img" src="${p.img}" alt="${p.name}">
            <div>
                <div class="odm-product-name">${p.name}</div>
                <div class="odm-product-meta">x${p.qty} &nbsp;·&nbsp; ${p.price.toLocaleString('vi-VN')}đ/cái</div>
            </div>
            <div class="odm-product-price">${(p.price * p.qty).toLocaleString('vi-VN')}đ</div>
        </div>`).join('');

    document.getElementById('odmSubtotal').textContent = subtotal.toLocaleString('vi-VN') + 'đ';
    document.getElementById('odmShipping').textContent  = o.shipping === 0 ? 'Miễn phí' : o.shipping.toLocaleString('vi-VN') + 'đ';
    document.getElementById('odmGrand').textContent     = o.total.toLocaleString('vi-VN') + 'đ';

    // Footer actions
    const footer = document.getElementById('odmFooter');
    footer.innerHTML = '';
    if (o.status === 'pending') {
        footer.innerHTML = `
            <button class="odm-btn-approve" onclick="changeStatus('${o.id}','processing')">✓ Duyệt đơn</button>
            <button class="odm-btn-reject"  onclick="changeStatus('${o.id}','cancelled')">✕ Từ chối</button>`;
    } else if (o.status === 'processing') {
        footer.innerHTML = `<button class="odm-btn-approve" onclick="changeStatus('${o.id}','shipping')">→ Chuyển sang Đang giao</button>`;
    } else if (o.status === 'shipping') {
        footer.innerHTML = `<button class="odm-btn-approve" onclick="changeStatus('${o.id}','completed')">✓ Xác nhận hoàn thành</button>`;
    }
    footer.innerHTML += `<button class="odm-btn-close-modal" onclick="closeOrderDetail()">Đóng</button>`;

    const overlay = document.getElementById('ordDetailOverlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

function closeOrderDetail() {
    const overlay = document.getElementById('ordDetailOverlay');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 220);
    document.body.style.overflow = '';
    viewingOrderId = null;
}

// ===== BIND EVENTS =====
function bindEvents() {
    const searchEl = document.getElementById('orderSearch');
    const dateEl   = document.getElementById('orderDate');
    const statusEl = document.getElementById('orderStatusFilter');

    const rerender = () => renderTable(searchEl.value, dateEl.value, statusEl.value);
    searchEl?.addEventListener('input', rerender);
    dateEl?.addEventListener('change', rerender);
    statusEl?.addEventListener('change', rerender);

    document.getElementById('odmClose')?.addEventListener('click', closeOrderDetail);
    document.getElementById('ordDetailOverlay')?.addEventListener('click', e => {
        if (e.target === document.getElementById('ordDetailOverlay')) closeOrderDetail();
    });
}