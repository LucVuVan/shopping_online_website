/**
 * product-modal.js - Popup xem chi tiết sản phẩm
 * Load sau cart.js
 */

// Mở rộng data sản phẩm với mô tả và sizes
const PRODUCT_DATA = {
    'sp-001': {
        id: 'sp-001',
        name: 'Áo thun cotton basic',
        category: 'Áo thun',
        price: 199000,
        originalPrice: 299000,
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        rating: 4.5,
        reviews: 128,
        badges: ['new', 'sale'],
        salePercent: 33,
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Sản phẩm chất lượng cao, được làm từ vải cotton cao cấp, mang lại cảm giác thoải mái khi mặc. Thiết kế hiện đại, phù hợp với nhiều phong cách khác nhau.',
    },
    'sp-002': {
        id: 'sp-002',
        name: 'Áo khoác denim phong cách',
        category: 'Áo khoác',
        price: 599000,
        originalPrice: 799000,
        img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=600&fit=crop',
        rating: 4.8,
        reviews: 96,
        badges: ['sale'],
        salePercent: 25,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        desc: 'Áo khoác denim phong cách với chất liệu bền đẹp. Thiết kế versatile, dễ mix-match với nhiều trang phục. Phù hợp cho mùa thu đông.',
    },
    'sp-003': {
        id: 'sp-003',
        name: 'Quần jean skinny xanh đậm',
        category: 'Quần jean',
        price: 359000,
        originalPrice: null,
        img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop',
        rating: 4.6,
        reviews: 74,
        badges: [],
        sizes: ['28', '29', '30', '31', '32'],
        desc: 'Quần jean skinny form ôm vừa phải, tôn dáng. Chất liệu denim co giãn nhẹ, thoải mái khi vận động.',
    },
    'sp-004': {
        id: 'sp-004',
        name: 'Áo sơ mi trắng công sở',
        category: 'Áo thun',
        price: 299000,
        originalPrice: null,
        img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=600&fit=crop',
        rating: 4.3,
        reviews: 52,
        badges: ['new'],
        sizes: ['S', 'M', 'L', 'XL'],
        desc: 'Áo sơ mi trắng basic không bao giờ lỗi mốt. Chất liệu cotton thoáng mát, phù hợp đi làm hay đi chơi.',
    },
    'sp-005': {
        id: 'sp-005',
        name: 'Quần short kaki',
        category: 'Quần jean',
        price: 259000,
        originalPrice: null,
        img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=600&fit=crop',
        rating: 4.2,
        reviews: 38,
        badges: [],
        sizes: ['28', '30', '32', '34'],
        desc: 'Quần short kaki thoải mái cho mùa hè. Chất liệu bền, nhiều túi tiện lợi, màu sắc trung tính dễ phối đồ.',
    },
    'sp-006': {
        id: 'sp-006',
        name: 'Váy hoa mùa hè',
        category: 'Váy',
        price: 319000,
        originalPrice: 399000,
        img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop',
        rating: 4.6,
        reviews: 115,
        badges: ['sale'],
        salePercent: 20,
        sizes: ['XS', 'S', 'M', 'L'],
        desc: 'Váy hoa họa tiết nữ tính, phù hợp cho mùa hè. Chất liệu voan nhẹ, thoáng mát.',
    },
    'sp-007': {
        id: 'sp-007',
        name: 'Giày sneaker trắng',
        category: 'Giày',
        price: 699000,
        originalPrice: null,
        img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop',
        rating: 4.8,
        reviews: 203,
        badges: [],
        sizes: ['38', '39', '40', '41', '42', '43'],
        desc: 'Giày sneaker trắng classic không bao giờ lỗi mốt. Đế cao su chống trượt, thoải mái khi đi cả ngày.',
    },
    'sp-008': {
        id: 'sp-008',
        name: 'Đồng hồ thời trang',
        category: 'Phụ kiện',
        price: 1299000,
        originalPrice: null,
        img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
        rating: 4.9,
        reviews: 67,
        badges: ['new'],
        sizes: ['One size'],
        desc: 'Đồng hồ thời trang mặt kính sapphire chống xước, dây da thật cao cấp. Thiết kế sang trọng, phù hợp nhiều hoàn cảnh.',
    },
};

const ProductModal = {
    selectedSize: null,

    open(productId) {
        const product = PRODUCT_DATA[productId];
        if (!product) return;

        this.selectedSize = product.sizes[0];
        this.currentProduct = product;
        this.render(product);

        document.getElementById('productModalOverlay')?.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('productModalOverlay')?.classList.remove('open');
        document.body.style.overflow = '';
    },

    render(p) {
        // Image
        document.getElementById('modalImg').src   = p.img;
        document.getElementById('modalImg').alt   = p.name;

        // Badges
        const badgesEl = document.getElementById('modalBadges');
        badgesEl.innerHTML = '';
        if (p.badges.includes('new'))  badgesEl.innerHTML += `<span class="badge badge-new">Mới</span>`;
        if (p.badges.includes('sale')) badgesEl.innerHTML += `<span class="badge badge-sale">-${p.salePercent}%</span>`;

        // Info
        document.getElementById('modalCategory').textContent = p.category;
        document.getElementById('modalName').textContent     = p.name;
        document.getElementById('modalRatingVal').textContent = p.rating;
        document.getElementById('modalReviews').textContent  = p.reviews + ' đánh giá';
        document.getElementById('modalPrice').textContent    = p.price.toLocaleString('vi-VN') + 'đ';

        const origEl = document.getElementById('modalOriginalPrice');
        if (p.originalPrice) {
            origEl.textContent = p.originalPrice.toLocaleString('vi-VN') + 'đ';
            origEl.style.display = '';
        } else {
            origEl.style.display = 'none';
        }

        // Sizes
        const sizesEl = document.getElementById('modalSizes');
        sizesEl.innerHTML = p.sizes.map(s => `
            <button class="size-btn ${s === this.selectedSize ? 'active' : ''}"
                    onclick="ProductModal.selectSize('${s}', this)">
                ${s}
            </button>
        `).join('');

        // Description
        document.getElementById('modalDesc').textContent = p.desc;
    },

    selectSize(size, btn) {
        this.selectedSize = size;
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    },

    addToCart() {
        const p = this.currentProduct;
        if (!p) return;

        if (!Auth.isLoggedIn()) {
            this.close();
            window.location.href = 'login.html';
            return;
        }

        Cart.addItem({
            id:    p.id + '-' + this.selectedSize,
            name:  p.name + ' (' + this.selectedSize + ')',
            price: p.price,
            img:   p.img,
        });

        this.close();
    },

    init() {
        if (document.getElementById('productModalOverlay')) return;

        document.body.insertAdjacentHTML('beforeend', `
            <div class="product-modal-overlay" id="productModalOverlay">
                <div class="product-modal">
                    <button class="modal-close-btn" id="modalCloseBtn">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>

                    <div class="modal-img-wrap">
                        <img id="modalImg" src="" alt="">
                        <div class="modal-badges" id="modalBadges"></div>
                    </div>

                    <div class="modal-content">
                        <div class="modal-category" id="modalCategory"></div>
                        <div class="modal-name" id="modalName"></div>

                        <div class="modal-rating">
                            <span class="star">★</span>
                            <strong id="modalRatingVal">4.5</strong>
                            <span>•</span>
                            <span id="modalReviews">0 đánh giá</span>
                        </div>

                        <div class="modal-price-wrap">
                            <span class="modal-price" id="modalPrice"></span>
                            <span class="modal-original" id="modalOriginalPrice"></span>
                        </div>

                        <div class="modal-divider"></div>

                        <div class="modal-size-label">Chọn kích thước:</div>
                        <div class="modal-sizes" id="modalSizes"></div>

                        <div class="modal-divider"></div>

                        <div class="modal-desc-label">Mô tả sản phẩm:</div>
                        <div class="modal-desc" id="modalDesc"></div>

                        <div class="modal-perks">
                            <div class="modal-perk">
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                                Miễn phí vận chuyển cho đơn hàng trên 500.000đ
                            </div>
                            <div class="modal-perk">
                                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                                Đổi trả trong vòng 30 ngày
                            </div>
                        </div>

                        <div class="modal-actions">
                            <button class="modal-btn-cart" id="modalBtnCart">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                                    <line x1="3" y1="6" x2="21" y2="6"/>
                                    <path d="M16 10a4 4 0 0 1-8 0"/>
                                </svg>
                                Thêm vào giỏ
                            </button>
                            <button class="modal-btn-wishlist" id="modalBtnWishlist">
                                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        document.getElementById('modalCloseBtn').addEventListener('click', () => this.close());
        document.getElementById('productModalOverlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('productModalOverlay')) this.close();
        });
        document.getElementById('modalBtnCart').addEventListener('click', () => this.addToCart());
    }
};

document.addEventListener('DOMContentLoaded', () => ProductModal.init());