/**
 * admin-components.js
 * Inject sidebar chung cho tất cả trang admin
 * Tự động highlight nav item theo trang hiện tại
 */

(function () {
    const NAV_ITEMS = [
        {
            href: 'dashboard.html',
            label: 'Dashboard',
            icon: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                   <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>`
        },
        {
            href: 'products.html',
            label: 'Sản phẩm',
            icon: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>`
        },
        {
            href: 'orders.html',
            label: 'Đơn hàng',
            icon: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                   <line x1="3" y1="6" x2="21" y2="6"/>
                   <path d="M16 10a4 4 0 0 1-8 0"/>`
        },
        {
            href: 'customers.html',
            label: 'Khách hàng',
            icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                   <circle cx="9" cy="7" r="4"/>
                   <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`
        },
        {
            href: 'categories.html',
            label: 'Danh mục',
            icon: `<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>`
        }
    ];

    function svg(paths) {
        return `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">${paths}</svg>`;
    }

    function renderSidebar() {
        const currentPage = location.pathname.split('/').pop() || 'dashboard.html';

        const navHTML = NAV_ITEMS.map(item => {
            const active = currentPage === item.href ? ' active' : '';
            return `<a href="${item.href}" class="admin-nav-item${active}">${svg(item.icon)}${item.label}</a>`;
        }).join('\n');

        const sidebarHTML = `
        <aside class="admin-sidebar">
            <div class="admin-brand">
                <div class="admin-brand-name">FashionStore Admin</div>
                <div class="admin-brand-role">Quản trị viên</div>
            </div>
            <nav class="admin-nav">${navHTML}</nav>
            <a href="../index.html" class="admin-logout">
                ${svg(`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                       <polyline points="16 17 21 12 16 7"/>
                       <line x1="21" y1="12" x2="9" y2="12"/>`)}
                Quay lại trang chủ
            </a>
        </aside>`;

        const target = document.getElementById('adminSidebar');
        if (target) target.outerHTML = sidebarHTML;
    }

    // Chạy ngay khi script được load (trước DOMContentLoaded cũng được)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderSidebar);
    } else {
        renderSidebar();
    }
})();