/**
 * login.js - Xử lý form đăng nhập
 */

document.addEventListener('DOMContentLoaded', () => {
    // Nếu đã đăng nhập rồi thì redirect luôn
    if (Auth.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (email === 'admin@gmail.com' && password === '123456') {
            Auth.login('admin', 'Admin', email);
            window.location.href = 'admin/dashboard.html'; // admin → dashboard
        } else if (email && password.length >= 6) {
            Auth.login('user', email.split('@')[0], email);
            window.location.href = 'index.html'; // user → trang chủ
        } else {
            alert('Email hoặc mật khẩu không đúng!');
        }
    });

    // Toggle show/hide password
    const toggleBtn     = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
        });
    }
});