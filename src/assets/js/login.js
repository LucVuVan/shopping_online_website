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

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // --- Tạm thời hardcode để test ---
        // Sau này thay bằng API call
        if (email === 'admin@gmail.com' && password === '123456') {
            Auth.login('admin');
            window.location.href = 'index.html';
        } else if (email && password.length >= 6) {
            Auth.login('user');
            window.location.href = 'index.html';
        } else {
            alert('Email hoặc mật khẩu không đúng!');
        }
    });

    // Toggle show/hide password
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
        });
    }
});