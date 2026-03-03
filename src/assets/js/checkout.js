/**
 * checkout.js - Logic trang thanh toán
 */

const SHIPPING_FEE = 30000;
const COUPONS = {
    'SALE10': { type: 'percent', value: 10, label: 'Giảm 10%' },
    'FREESHIP': { type: 'shipping', label: 'Miễn phí vận chuyển' },
    'SAVE50K': { type: 'fixed', value: 50000, label: 'Giảm 50.000đ' },
};

let appliedCoupon = null;

function formatPrice(n) {
    return n.toLocaleString('vi-VN') + 'đ';
}

// ===== RENDER SUMMARY =====
function renderSummary() {
    const items = Cart.getItems();
    const summaryItems = document.getElementById('summaryItems');

    if (items.length === 0) {
        summaryItems.innerHTML = `<p style="color:var(--gray-text);font-size:.875rem;">Giỏ hàng trống</p>`;
    } else {
        summaryItems.innerHTML = items.map(item => `
            <div class="summary-item">
                <img class="summary-item-img" src="${item.img}" alt="${item.name}">
                <div>
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-meta">Số lượng: ${item.qty}</div>
                </div>
                <div class="summary-item-price">${formatPrice(item.price * item.qty)}</div>
            </div>
        `).join('');
    }

    updateTotals();
}

// ===== UPDATE TOTALS =====
function updateTotals() {
    const items = Cart.getItems();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    let discount = 0;
    let shipping = SHIPPING_FEE;

    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.round(subtotal * appliedCoupon.value / 100);
        } else if (appliedCoupon.type === 'fixed') {
            discount = appliedCoupon.value;
        } else if (appliedCoupon.type === 'shipping') {
            shipping = 0;
        }
    }

    const grand = subtotal - discount + shipping;

    document.getElementById('sumSubtotal').textContent  = formatPrice(subtotal);
    document.getElementById('sumShipping').textContent  = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
    document.getElementById('sumTotal').textContent     = formatPrice(grand);

    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = '';
        document.getElementById('sumDiscount').textContent = '-' + formatPrice(discount);
    } else {
        discountRow.style.display = 'none';
    }
}

// ===== COUPON =====
function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    const msg  = document.getElementById('couponMsg');

    if (!code) return;

    const coupon = COUPONS[code];
    msg.style.display = '';

    if (coupon) {
        appliedCoupon = coupon;
        msg.textContent = `✓ Áp dụng thành công: ${coupon.label}`;
        msg.className = 'coupon-msg success';
        updateTotals();
    } else {
        appliedCoupon = null;
        msg.textContent = 'Mã giảm giá không hợp lệ';
        msg.className = 'coupon-msg error';
        updateTotals();
    }
}

// ===== PAYMENT OPTION TOGGLE =====
function initPaymentOptions() {
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            opt.querySelector('input[type="radio"]').checked = true;
        });
    });
}

// ===== VALIDATE =====
function validate() {
    const name    = document.getElementById('fullName').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name) {
        alert('Vui lòng nhập họ và tên!');
        document.getElementById('fullName').focus();
        return false;
    }
    if (!phone) {
        alert('Vui lòng nhập số điện thoại!');
        document.getElementById('phone').focus();
        return false;
    }
    if (!address) {
        alert('Vui lòng nhập địa chỉ!');
        document.getElementById('address').focus();
        return false;
    }
    return true;
}

// ===== PLACE ORDER =====
function placeOrder() {
    if (!validate()) return;
    if (Cart.getItems().length === 0) {
        alert('Giỏ hàng của bạn đang trống!');
        return;
    }

    const btn = document.getElementById('btnPlaceOrder');
    btn.textContent = 'Đang xử lý...';
    btn.disabled = true;

    // Giả lập gọi API (1.5s)
    setTimeout(() => {
        // Tạo mã đơn hàng giả
        const orderId = 'DH-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-3);
        document.getElementById('successOrderId').textContent = 'Mã đơn hàng: #' + orderId;

        // Xóa giỏ hàng
        localStorage.removeItem('cartItems');
        Cart.updateBadge();

        // Hiện modal thành công
        document.getElementById('successOverlay').style.display = 'flex';

        btn.textContent = 'Đặt hàng';
        btn.disabled = false;
    }, 1500);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    Auth.requireAuth();
    Auth.updateUI();

    // Prefill thông tin từ localStorage
    const name  = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const phone = localStorage.getItem('userPhone');
    if (name)  document.getElementById('fullName').value = name;
    if (email) document.getElementById('email').value    = email;
    if (phone) document.getElementById('phone').value    = phone;

    renderSummary();
    initPaymentOptions();

    document.getElementById('btnApplyCoupon').addEventListener('click', applyCoupon);
    document.getElementById('couponInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyCoupon();
    });

    document.getElementById('btnPlaceOrder').addEventListener('click', placeOrder);
});