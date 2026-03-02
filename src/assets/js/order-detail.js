/**
 * order-detail.js - Trang chi tiết đơn hàng
 * Lấy orderId từ URL: order-detail.html?id=DH-2026-001
 */

// ===== DATA GIẢ (đồng bộ với order-history.js) =====
const ORDER_DETAILS = {
    'DH-2026-001': {
        id: 'DH-2026-001',
        date: 'lúc 10:30 28 tháng 1, 2026',
        status: 'completed',
        statusLabel: 'Giao thành công',
        trackingStep: 4, // 1=đặt hàng, 2=xử lý, 3=đang giao, 4=hoàn thành
        address: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            text: '123 Đường ABC, Phường XYZ<br>Quận Cầu Giấy, Hà Nội'
        },
        payment: {
            method: 'Chuyển khoản ngân hàng',
            status: 'paid',
            statusLabel: 'Đã thanh toán'
        },
        products: [
            {
                name: 'Áo thun cotton basic',
                img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
                variant: 'Size: M',
                qty: 2,
                price: 398000
            },
            {
                name: 'Áo khoác denim phong cách',
                img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop',
                variant: 'Size: M',
                qty: 1,
                price: 599000
            }
        ],
        shipping: 30000
    },
    'DH-2026-002': {
        id: 'DH-2026-002',
        date: 'lúc 14:15 30 tháng 1, 2026',
        status: 'shipping',
        statusLabel: 'Đang giao',
        trackingStep: 3,
        address: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            text: '123 Đường ABC, Phường XYZ<br>Quận Cầu Giấy, Hà Nội'
        },
        payment: {
            method: 'COD (Tiền mặt)',
            status: 'unpaid',
            statusLabel: 'Chưa thanh toán'
        },
        products: [
            {
                name: 'Quần jean skinny xanh',
                img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
                variant: 'Size: L',
                qty: 1,
                price: 359000
            },
            {
                name: 'Giày sneaker trắng',
                img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
                variant: 'Size: 42',
                qty: 1,
                price: 699000
            }
        ],
        shipping: 30000
    },
    'DH-2026-003': {
        id: 'DH-2026-003',
        date: 'lúc 09:00 1 tháng 2, 2026',
        status: 'pending',
        statusLabel: 'Chờ xác nhận',
        trackingStep: 1,
        address: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            text: '123 Đường ABC, Phường XYZ<br>Quận Cầu Giấy, Hà Nội'
        },
        payment: {
            method: 'Chuyển khoản ngân hàng',
            status: 'paid',
            statusLabel: 'Đã thanh toán'
        },
        products: [
            {
                name: 'Giày sneaker trắng',
                img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop',
                variant: 'Size: 41',
                qty: 1,
                price: 699000
            }
        ],
        shipping: 0
    },
    'DH-2026-004': {
        id: 'DH-2026-004',
        date: 'lúc 16:45 5 tháng 2, 2026',
        status: 'cancelled',
        statusLabel: 'Đã hủy',
        trackingStep: 0,
        address: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            text: '123 Đường ABC, Phường XYZ<br>Quận Cầu Giấy, Hà Nội'
        },
        payment: {
            method: 'COD (Tiền mặt)',
            status: 'unpaid',
            statusLabel: 'Chưa thanh toán'
        },
        products: [
            {
                name: 'Váy hoa mùa hè',
                img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop',
                variant: 'Size: S',
                qty: 1,
                price: 319000
            }
        ],
        shipping: 30000
    }
};

// ===== HELPERS =====
function formatPrice(n) {
    return n.toLocaleString('vi-VN') + 'đ';
}

// ===== RENDER =====
function renderOrder(order) {
    // Header
    document.getElementById('orderId').textContent   = '#' + order.id;
    document.getElementById('orderDate').textContent = 'Ngày đặt hàng: ' + order.date;
    document.title = `Chi tiết ${order.id} - FashionStore`;

    const statusEl = document.getElementById('orderStatus');
    statusEl.textContent = order.statusLabel;
    statusEl.className   = `order-status status-${order.status}`;

    // Timeline
    const steps = document.querySelectorAll('.timeline-step');
    steps.forEach((step, i) => {
        if (order.status === 'cancelled') {
            step.classList.remove('active');
        } else {
            step.classList.toggle('active', i < order.trackingStep);
        }
    });

    // Address
    document.getElementById('addrName').textContent  = order.address.name;
    document.getElementById('addrPhone').textContent = order.address.phone;
    document.getElementById('addrText').innerHTML    = order.address.text;

    // Payment
    document.getElementById('payMethod').textContent = order.payment.method;
    const payStatusEl = document.getElementById('payStatus');
    payStatusEl.textContent = order.payment.statusLabel;
    payStatusEl.className   = `pay-status ${order.payment.status}`;

    // Products
    const subtotal = order.products.reduce((sum, p) => sum + p.price, 0);
    const grand    = subtotal + order.shipping;

    document.getElementById('productRows').innerHTML = order.products.map(p => `
        <div class="table-row">
            <div class="col-product-cell">
                <img src="${p.img}" alt="${p.name}">
                <span class="product-cell-name">${p.name}</span>
            </div>
            <div class="col-variant">${p.variant}</div>
            <div class="col-qty">${p.qty}</div>
            <div class="col-price">${formatPrice(p.price)}</div>
        </div>
    `).join('');

    document.getElementById('subtotal').textContent  = formatPrice(subtotal);
    document.getElementById('shipping').textContent  = order.shipping === 0 ? 'Miễn phí' : formatPrice(order.shipping);
    document.getElementById('grandTotal').textContent = formatPrice(grand);

    // Ẩn nút Đánh giá nếu chưa hoàn thành
    const btnReview = document.getElementById('btnReview');
    if (order.status !== 'completed') {
        btnReview.style.display = 'none';
    }

    // Ẩn nút Mua lại nếu đang pending/shipping
    const btnRebuy = document.getElementById('btnRebuy');
    if (order.status === 'pending' || order.status === 'shipping') {
        btnRebuy.style.display = 'none';
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    Auth.requireAuth();
    Auth.updateUI();

    // Lấy id từ URL: ?id=DH-2026-001
    const params  = new URLSearchParams(window.location.search);
    const orderId = params.get('id');

    const order = ORDER_DETAILS[orderId];

    if (!order) {
        document.querySelector('.order-detail-wrap').innerHTML = `
            <div style="text-align:center; padding: 60px 20px; color: var(--gray-text);">
                <p style="font-size:1.1rem; font-weight:700;">Không tìm thấy đơn hàng</p>
                <a href="order-history.html" style="color:var(--black); text-decoration:underline; margin-top:12px; display:inline-block;">
                    Quay lại danh sách đơn hàng
                </a>
            </div>`;
        return;
    }

    renderOrder(order);

    // Nút Mua lại → về trang chủ
    document.getElementById('btnRebuy')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Nút Đánh giá → placeholder
    document.getElementById('btnReview')?.addEventListener('click', () => {
        alert('Tính năng đánh giá sẽ được thêm sau!');
    });
});