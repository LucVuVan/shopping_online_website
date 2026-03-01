/**
 * auth.js - Quản lý trạng thái đăng nhập toàn project
 * Dùng chung cho tất cả các trang
 */

const Auth = {
    /**
     * Lấy trạng thái đăng nhập
     */
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },

    /**
     * Lấy role của user ('admin' | 'user' | null)
     */
    getRole() {
        return localStorage.getItem('userRole');
    },

    isAdmin() {
        return this.isLoggedIn() && this.getRole() === 'admin';
    },

    /**
     * Lưu thông tin đăng nhập
     */
    login(role = 'user') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
    },

    /**
     * Đăng xuất
     */
    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        window.location.href = '/index.html';
    },

    /**
     * Cập nhật UI theo trạng thái đăng nhập
     * Dùng class: .auth-only | .guest-only | .admin-only
     */
    updateUI() {
        const loggedIn = this.isLoggedIn();
        const admin = this.isAdmin();

        document.querySelectorAll('.auth-only').forEach(el => {
            el.style.display = loggedIn ? '' : 'none';
        });

        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = loggedIn ? 'none' : '';
        });

        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = admin ? '' : 'none';
        });
    },

    /**
     * Redirect về login nếu chưa đăng nhập
     * Dùng cho các trang yêu cầu auth (checkout, order-history...)
     */
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = '/login.html';
        }
    },

    /**
     * Redirect về login nếu không phải admin
     * Dùng cho các trang admin
     */
    requireAdmin() {
        if (!this.isAdmin()) {
            window.location.href = '/login.html';
        }
    }
};