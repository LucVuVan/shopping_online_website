/**
 * cart.js - Giỏ hàng sidebar (dùng chung mọi trang)
 * Load file này sau components.js và auth.js
 */

const Cart = {
    SHIPPING: 30000,

    // ===== STORAGE =====
    getItems() {
        try {
            return JSON.parse(localStorage.getItem('cartItems') || '[]');
        } catch { return []; }
    },

    saveItems(items) {
        localStorage.setItem('cartItems', JSON.stringify(items));
        this.updateBadge();
    },

    // ===== OPERATIONS =====
    addItem(product) {
        const items = this.getItems();
        const existing = items.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            items.push({ ...product, qty: 1 });
        }
        this.saveItems(items);
        this.render();
        this.open();
    },

    removeItem(id) {
        const items = this.getItems().filter(i => i.id !== id);
        this.saveItems(items);
        this.render();
    },

    updateQty(id, delta) {
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            this.saveItems(items.filter(i => i.id !== id));
        } else {
            this.saveItems(items);
        }
        this.render();
    },

    getCount() {
        return this.getItems().reduce((sum, i) => sum + i.qty, 0);
    },

    // ===== UI =====
    open() {
        document.getElementById('cartSidebar')?.classList.add('open');
        document.getElementById('cartOverlay')?.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    close() {
        document.getElementById('cartSidebar')?.classList.remove('open');
        document.getElementById('cartOverlay')?.classList.remove('open');
        document.body.style.overflow = '';
    },

    updateBadge() {
        const count = this.getCount();
        document.querySelectorAll('.cart-badge').forEach(el => {
            el.textContent = count;
            el.style.display = count === 0 ? 'none' : 'flex';
        });
    },

    render() {
        const items = this.getItems();
        const listEl = document.getElementById('cartItemsList');
        const footerEl = document.getElementById('cartFooter');
        const titleEl = document.getElementById('cartTitle');

        if (!listEl) return;

        const count = this.getCount();
        if (titleEl) titleEl.textContent = `Giỏ hàng (${count})`;

        if (items.length === 0) {
            listEl.innerHTML = `
                <div class="cart-empty">
                    <svg width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <p>Giỏ hàng trống</p>
                </div>`;
            if (footerEl) footerEl.style.display = 'none';
            return;
        }

        if (footerEl) footerEl.style.display = '';

        listEl.innerHTML = items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img class="cart-item-img" src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toLocaleString('vi-VN')}đ</div>
                    <div class="cart-qty">
                        <button class="qty-btn" onclick="Cart.updateQty('${item.id}', -1)">−</button>
                        <span class="qty-value">${item.qty}</span>
                        <button class="qty-btn" onclick="Cart.updateQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-delete" onclick="Cart.removeItem('${item.id}')" title="Xóa">
                    <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                </button>
            </div>
        `).join('');

        // Totals
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const grand = subtotal + this.SHIPPING;
        document.getElementById('cartSubtotal').textContent = subtotal.toLocaleString('vi-VN') + 'đ';
        document.getElementById('cartShipping').textContent = this.SHIPPING.toLocaleString('vi-VN') + 'đ';
        document.getElementById('cartGrandTotal').textContent = grand.toLocaleString('vi-VN') + 'đ';
    },

    // ===== INJECT HTML + INIT =====
    init() {
        // Inject sidebar HTML vào body nếu chưa có
        if (!document.getElementById('cartSidebar')) {
            document.body.insertAdjacentHTML('beforeend', `
                <div class="cart-overlay" id="cartOverlay"></div>
                <div class="cart-sidebar" id="cartSidebar">
                    <div class="cart-header">
                        <span class="cart-title" id="cartTitle">Giỏ hàng (0)</span>
                        <button class="cart-close-btn" id="cartCloseBtn">
                            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="cart-items" id="cartItemsList"></div>
                    <div class="cart-footer" id="cartFooter">
                        <div class="cart-totals">
                            <div class="cart-total-row">
                                <span>Tạm tính:</span>
                                <span id="cartSubtotal">0đ</span>
                            </div>
                            <div class="cart-total-row">
                                <span>Phí vận chuyển:</span>
                                <span id="cartShipping">30.000đ</span>
                            </div>
                            <div class="cart-total-row grand">
                                <span>Tổng cộng:</span>
                                <span id="cartGrandTotal">0đ</span>
                            </div>
                        </div>
                        <button class="btn-checkout" onclick="window.location.href='checkout.html'">Thanh toán</button>
                    </div>
                </div>
            `);
        }

        // Events
        document.getElementById('cartCloseBtn')?.addEventListener('click', () => this.close());
        document.getElementById('cartOverlay')?.addEventListener('click', () => this.close());

        // Mở cart khi bấm icon giỏ hàng trên navbar
        document.addEventListener('click', (e) => {
            const cartBtn = e.target.closest('a[href="cart.html"]');
            if (cartBtn) {
                e.preventDefault();
                this.open();
            }
        });

        this.render();
        this.updateBadge();
    }
};

document.addEventListener('DOMContentLoaded', () => Cart.init());