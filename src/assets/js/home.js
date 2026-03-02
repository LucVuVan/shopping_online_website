/**
 * home.js - Logic trang chủ
 */

// Data sản phẩm (đồng bộ với HTML)
const PRODUCTS = [
    { id: 'sp-001', name: 'Áo thun cotton basic',    price: 199000, img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' },
    { id: 'sp-002', name: 'Áo khoác denim phong cách', price: 599000, img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop' },
    { id: 'sp-003', name: 'Quần jean skinny xanh',   price: 359000, img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop' },
    { id: 'sp-004', name: 'Áo sơ mi trắng công sở',  price: 299000, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop' },
    { id: 'sp-005', name: 'Quần short kaki',          price: 259000, img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop' },
    { id: 'sp-006', name: 'Váy hoa mùa hè',           price: 319000, img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop' },
    { id: 'sp-007', name: 'Giày sneaker trắng',       price: 699000, img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
    { id: 'sp-008', name: 'Đồng hồ thời trang',       price: 1299000, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop' },
];

document.addEventListener('DOMContentLoaded', () => {
    Auth.updateUI();

    // ===== PRICE RANGE =====
    const range = document.getElementById('priceRange');
    const priceVal = document.getElementById('priceVal');
    if (range && priceVal) {
        range.addEventListener('input', () => {
            priceVal.textContent = Number(range.value).toLocaleString('vi-VN') + 'đ';
        });
    }

    // ===== THÊM VÀO GIỎ =====
    document.querySelectorAll('.btn-add-cart').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = PRODUCTS[index];
            if (!product) return;

            // Yêu cầu đăng nhập
            if (!Auth.isLoggedIn()) {
                window.location.href = 'login.html';
                return;
            }

            Cart.addItem(product);

            // Feedback ngắn trên nút
            const original = btn.innerHTML;
            btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Đã thêm`;
            btn.style.background = '#16a34a';
            setTimeout(() => {
                btn.innerHTML = original;
                btn.style.background = '';
            }, 1500);
        });
    });
});