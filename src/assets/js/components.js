/**
 * components.js - Navbar & Footer dùng chung cho toàn project
 */

const NAV_CATEGORIES = [
    { label: 'Nam',       cat: 'nam',       cats: ['ao-nam', 'quan-nam'] },
    { label: 'Nữ',        cat: 'nu',        cats: ['nu'] },
    { label: 'Trẻ em',    cat: 'tre-em',    cats: ['tre-em'] },
    { label: 'Phụ kiện',  cat: 'phu-kien',  cats: ['phu-kien'] },
];

// Map cat param -> nhóm filter trong home.js
// Nam bấm -> hiện dropdown hoặc đi thẳng đến index?cat=nam
// Ở đây ta dùng index.html?cat=<value> đơn giản nhất

function loadNavbar() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const urlCat      = new URLSearchParams(window.location.search).get('cat');

    // Build category links - mỗi nút link đến index.html?cat=...
    const catLinks = [
        { label: 'Nam',      cat: 'nam'      },
        { label: 'Nữ',       cat: 'nu'       },
        { label: 'Trẻ em',   cat: 'tre-em'   },
        { label: 'Phụ kiện', cat: 'phu-kien' },
    ].map(item => {
        const isActive = currentPage === 'index.html' && urlCat === item.cat;
        // Nếu đang ở index.html và click cùng cat → bỏ filter (về index.html)
        const href = `index.html?cat=${item.cat}`;
        return `<li>
            <a href="${href}" class="nav-category-link${isActive ? ' nav-active' : ''}"
               data-cat="${item.cat}">${item.label}</a>
        </li>`;
    }).join('');

    const navbar = `
    <nav class="navbar">
        <div class="navbar-inner">
            <a href="index.html" class="logo">FashionStore</a>

            <ul class="nav-links">
                ${catLinks}
                <li>
                    <a href="order-history.html"
                       class="auth-only ${currentPage === 'order-history.html' ? 'nav-active' : ''}"
                       style="display:none">
                        Đơn hàng
                    </a>
                </li>
                <li>
                    <a href="admin/dashboard.html"
                       class="admin-only"
                       style="display:none">
                        Dashboard
                    </a>
                </li>
            </ul>

            <div class="nav-search">
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input type="text" id="navSearchInput" placeholder="Tìm kiếm sản phẩm...">
            </div>

            <div class="nav-actions">
                <a href="login.html" class="nav-icon-btn guest-only" title="Đăng nhập">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </a>
                <a href="profile.html" class="nav-icon-btn auth-only" style="display:none" title="Tài khoản">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                </a>
                <a href="cart.html" class="nav-icon-btn auth-only" style="display:none" title="Giỏ hàng">
                    <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    <span class="cart-badge" id="cartBadge" style="display:none">0</span>
                </a>
            </div>
        </div>
    </nav>`;

    document.getElementById('navbar-placeholder').innerHTML = navbar;
}

function loadFooter() {
    const footer = `
    <footer>
        <div class="footer-inner">
            <div class="footer-brand">
                <a href="index.html" class="logo">FashionStore</a>
                <p>Thời trang chất lượng cao với giá tốt nhất</p>
            </div>
            <div class="footer-col">
                <h4>Về chúng tôi</h4>
                <ul>
                    <li><a href="#">Giới thiệu</a></li>
                    <li><a href="#">Tuyển dụng</a></li>
                    <li><a href="#">Liên hệ</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Hỗ trợ</h4>
                <ul>
                    <li><a href="#">Chính sách đổi trả</a></li>
                    <li><a href="#">Hướng dẫn mua hàng</a></li>
                    <li><a href="#">Câu hỏi thường gặp</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Theo dõi chúng tôi</h4>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">TikTok</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">© 2026 FashionStore. All rights reserved.</div>
    </footer>
    <div class="help-btn">?</div>`;

    document.getElementById('footer-placeholder').innerHTML = footer;
}

document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    loadFooter();

});