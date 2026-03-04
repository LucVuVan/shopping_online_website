/**
 * register.js - Xử lý đăng ký tài khoản
 * Yêu cầu: auth.js phải được load trước trong HTML
 */

document.addEventListener('DOMContentLoaded', () => {
    const form      = document.querySelector('.login-form');
    const nameIn    = document.getElementById('regName');
    const emailIn   = document.getElementById('regEmail');
    const phoneIn   = document.getElementById('regPhone');
    const passIn    = document.getElementById('regPass');
    const confirmIn = document.getElementById('regConfirm');

    // ===== VALIDATION RULES =====
    const validators = {
        name: {
            el: nameIn,
            check: v => v.trim().length >= 2,
            msg: 'Họ tên phải có ít nhất 2 ký tự'
        },
        email: {
            el: emailIn,
            check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
            msg: 'Email không hợp lệ'
        },
        phone: {
            el: phoneIn,
            check: v => /^(0|\+84)[0-9]{9}$/.test(v.trim()),
            msg: 'Số điện thoại không hợp lệ (VD: 0901234567)'
        },
        password: {
            el: passIn,
            check: v => v.length >= 6,
            msg: 'Mật khẩu phải có ít nhất 6 ký tự'
        },
        confirm: {
            el: confirmIn,
            check: v => v === passIn.value,
            msg: 'Mật khẩu xác nhận không khớp'
        },
    };

    // ===== HELPERS =====
    function showError(el, msg) {
        clearError(el);
        el.classList.add('input-error');
        const err = document.createElement('span');
        err.className   = 'error-msg';
        err.textContent = msg;
        el.parentElement.appendChild(err);
    }

    function clearError(el) {
        el.classList.remove('input-error', 'input-ok');
        el.parentElement.querySelector('.error-msg')?.remove();
    }

    function markOk(el) {
        clearError(el);
        el.classList.add('input-ok');
    }

    // ===== INLINE VALIDATION ON BLUR =====
    Object.values(validators).forEach(({ el, check, msg }) => {
        el.addEventListener('blur', () => {
            if (!el.value) return clearError(el);
            check(el.value) ? markOk(el) : showError(el, msg);
        });
        el.addEventListener('input', () => {
            if (el.classList.contains('input-error') && check(el.value)) markOk(el);
        });
    });

    // Recheck confirm khi đổi password
    passIn.addEventListener('input', () => {
        if (!confirmIn.value) return;
        confirmIn.value === passIn.value
            ? markOk(confirmIn)
            : showError(confirmIn, validators.confirm.msg);
    });

    // ===== SUBMIT =====
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let valid = true;
        Object.values(validators).forEach(({ el, check, msg }) => {
            if (!el.value.trim()) {
                showError(el, 'Vui lòng điền thông tin này');
                valid = false;
            } else if (!check(el.value)) {
                showError(el, msg);
                valid = false;
            } else {
                markOk(el);
            }
        });
        if (!valid) return;

        // Kiểm tra email đã tồn tại
        const users  = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = users.find(u => u.email === emailIn.value.trim().toLowerCase());
        if (exists) {
            showError(emailIn, 'Email này đã được đăng ký');
            return;
        }

        // Tạo user mới — role phải là 'user' để khớp với auth.js
        const newUser = {
            id:       Date.now(),
            name:     nameIn.value.trim(),
            email:    emailIn.value.trim().toLowerCase(),
            phone:    phoneIn.value.trim(),
            password: passIn.value,
            role:     'user',
            joined:   new Date().toLocaleDateString('vi-VN'),
            address:  '',
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // Dùng Auth.login() thay vì set localStorage thủ công
        // → đảm bảo isLoggedIn + userRole được set đúng
        Auth.login('user', newUser.name, newUser.email);
        localStorage.setItem('userPhone', newUser.phone);

        showSuccess();
        setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    });

    function showSuccess() {
        const btn        = form.querySelector('.btn-login');
        btn.textContent      = '✓ Đăng ký thành công!';
        btn.style.background = '#16a34a';
        btn.disabled         = true;
    }
});