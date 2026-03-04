/**
 * home.js - Logic trang chủ
 */

// ===== DATA SẢN PHẨM =====
const PRODUCTS = [
    { id: 'sp-001', name: 'Áo thun cotton basic',      price: 199000,  category: 'Áo thun',  sizes: ['S','M','L','XL'],
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      badge: '<span class="badge badge-new">Mới</span><span class="badge badge-sale">-33%</span>',
      rating: 4.5, originalPrice: 299000 },
    { id: 'sp-002', name: 'Áo khoác denim phong cách', price: 449000,  category: 'Áo khoác', sizes: ['M','L','XL','XXL'],
      img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
      badge: '<span class="badge badge-sale">-25%</span>',
      rating: 4.7, originalPrice: 599000 },
    { id: 'sp-003', name: 'Quần jean skinny xanh',     price: 359000,  category: 'Quần jean', sizes: ['S','M','L'],
      img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
      badge: '', rating: 4.3, originalPrice: 0 },
    { id: 'sp-004', name: 'Áo sơ mi trắng công sở',   price: 299000,  category: 'Áo thun',  sizes: ['S','M','L','XL','XXL'],
      img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
      badge: '<span class="badge badge-new">Mới</span>',
      rating: 4.3, originalPrice: 0 },
    { id: 'sp-005', name: 'Quần short kaki',           price: 259000,  category: 'Quần jean', sizes: ['M','L','XL'],
      img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
      badge: '', rating: 4.2, originalPrice: 0 },
    { id: 'sp-006', name: 'Váy hoa mùa hè',            price: 319000,  category: 'Váy',       sizes: ['S','M','L'],
      img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
      badge: '<span class="badge badge-sale">-20%</span>',
      rating: 4.6, originalPrice: 399000 },
    { id: 'sp-007', name: 'Giày sneaker trắng',        price: 699000,  category: 'Giày',      sizes: ['S','M','L','XL'],
      img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      badge: '', rating: 4.8, originalPrice: 0 },
    { id: 'sp-008', name: 'Đồng hồ thời trang',        price: 1299000, category: 'Phụ kiện',  sizes: ['M'],
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      badge: '<span class="badge badge-new">Mới</span>',
      rating: 4.9, originalPrice: 0 },
];

// Mapping navbar ?cat= -> danh mục sản phẩm
const NAV_CAT_MAP = {
    'nam':      ['Áo thun', 'Áo khoác', 'Quần jean'],
    'nu':       ['Váy', 'Áo thun'],
    'tre-em':   [],
    'phu-kien': ['Giày', 'Phụ kiện'],
};

document.addEventListener('DOMContentLoaded', () => {
    Auth.updateUI();

    // Đọc ?cat= từ URL (navbar category)
    const urlCat = new URLSearchParams(window.location.search).get('cat');

    // Bind filter events
    document.getElementById('priceRange')?.addEventListener('input', function () {
        document.getElementById('priceVal').textContent =
            Number(this.value).toLocaleString('vi-VN') + 'đ';
        applyFilters(urlCat);
    });

    document.querySelectorAll('.filter-category input, .filter-size input').forEach(cb => {
        cb.addEventListener('change', () => applyFilters(urlCat));
    });

    // Search bar (dùng event delegation vì navbar inject sau)
    document.addEventListener('input', (e) => {
        if (e.target.id === 'navSearchInput') applyFilters(urlCat);
    });
    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'navSearchInput' && e.key === 'Escape') {
            e.target.value = '';
            applyFilters(urlCat);
        }
    });

    // Render lần đầu
    applyFilters(urlCat);
});

// ===== LỌC & RENDER =====
function applyFilters(urlCat) {
    const maxPrice     = Number(document.getElementById('priceRange')?.value || 2000000);
    const checkedCats  = [...document.querySelectorAll('.filter-category input:checked')].map(el => el.dataset.category);
    const checkedSizes = [...document.querySelectorAll('.filter-size input:checked')].map(el => el.dataset.size);
    const navCats      = urlCat ? (NAV_CAT_MAP[urlCat] || []) : [];

    const searchQuery = (document.getElementById('navSearchInput')?.value || '').trim().toLowerCase();

    const filtered = PRODUCTS.filter(p => {
        if (navCats.length      && !navCats.includes(p.category))                       return false;
        if (checkedCats.length  && !checkedCats.includes(p.category))                   return false;
        if (p.price > maxPrice)                                                          return false;
        if (checkedSizes.length && !checkedSizes.some(s => p.sizes.includes(s)))        return false;
        if (searchQuery         && !p.name.toLowerCase().includes(searchQuery) &&
                                   !p.category.toLowerCase().includes(searchQuery))     return false;
        return true;
    });

    renderProducts(filtered);
}

function renderProducts(list) {
    const grid  = document.getElementById('productGrid');
    const count = document.getElementById('productCount');
    if (!grid) return;

    if (count) count.textContent = `Tất cả sản phẩm (${list.length})`;

    if (!list.length) {
        grid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#999">
                <p style="margin-bottom:12px;font-size:1rem">Không có sản phẩm phù hợp</p>
                <button onclick="resetFilters()"
                    style="padding:8px 20px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer">
                    Xóa bộ lọc
                </button>
            </div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="product-card" data-product-id="${p.id}">
            <div class="product-img-wrap">
                <img src="${p.img}" alt="${p.name}">
                ${p.badge ? `<div class="product-badges">${p.badge}</div>` : ''}
                <button class="btn-wishlist">
                    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${p.category}</div>
                <div class="product-name">${p.name}</div>
                <div class="product-rating"><span class="star">★</span> ${p.rating}</div>
                <div class="product-price">
                    ${p.price.toLocaleString('vi-VN')}đ
                    ${p.originalPrice ? `<span class="original">${p.originalPrice.toLocaleString('vi-VN')}đ</span>` : ''}
                </div>
                <button class="btn-add-cart">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Thêm vào giỏ
                </button>
            </div>
        </div>`).join('');

    // Bind events cho cards vừa render
    grid.querySelectorAll('.product-card').forEach(card => {
        const p = PRODUCTS.find(x => x.id === card.dataset.productId);
        if (!p) return;

        // Mở modal
        card.querySelector('img')?.addEventListener('click', () => ProductModal.open(p.id));
        card.querySelector('.product-name')?.addEventListener('click', () => ProductModal.open(p.id));

        // Thêm vào giỏ
        const btn = card.querySelector('.btn-add-cart');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!Auth.isLoggedIn()) { window.location.href = 'login.html'; return; }
            Cart.addItem(p);
            const orig = btn.innerHTML;
            btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Đã thêm`;
            btn.style.background = '#16a34a';
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1500);
        });
    });
}

function resetFilters() {
    document.querySelectorAll('.filter-category input, .filter-size input').forEach(cb => cb.checked = false);
    const range = document.getElementById('priceRange');
    if (range) { range.value = 2000000; document.getElementById('priceVal').textContent = '2.000.000đ'; }
    history.replaceState(null, '', location.pathname);
    applyFilters(null);
}