/**
 * order-history.js - Logic trang lịch sử đơn hàng
 */

// ===== DATA GIẢ =====
const ORDERS = [
    {
        id: 'DH-2026-001',
        status: 'completed',
        date: '28/1/2026',
        total: 1028000,
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop'
        ]
    },
    {
        id: 'DH-2026-002',
        status: 'shipping',
        date: '30/1/2026',
        total: 1080000,
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&h=200&fit=crop'
        ]
    },
    {
        id: 'DH-2026-003',
        status: 'pending',
        date: '1/2/2026',
        total: 699000,
        images: [
            'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'
        ]
    },
    {
        id: 'DH-2026-004',
        status: 'cancelled',
        date: '5/2/2026',
        total: 319000,
        images: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=200&fit=crop'
        ]
    }
];

const STATUS_LABEL = {
    completed: 'Hoàn thành',
    shipping:  'Đang giao',
    pending:   'Chờ xác nhận',
    cancelled: 'Đã hủy'
};

// ===== RENDER =====
function renderOrders(filter = 'all') {
    const list = document.getElementById('orderList');
    const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);

    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <p>Không có đơn hàng nào</p>
            </div>`;
        return;
    }

    list.innerHTML = filtered.map(order => `
        <div class="order-card">
            <div class="order-card-header">
                <span class="order-id">#${order.id}</span>
                <span class="order-status status-${order.status}">${STATUS_LABEL[order.status]}</span>
                <span class="order-date">Ngày đặt: ${order.date}</span>
            </div>
            <div class="order-images">
                ${order.images.map(img => `<img src="${img}" alt="Sản phẩm">`).join('')}
            </div>
            <div class="order-card-footer">
                <div class="order-total">
                    Tổng tiền: <strong>${order.total.toLocaleString('vi-VN')}đ</strong>
                </div>
                <button class="btn-detail">Xem chi tiết</button>
            </div>
        </div>
    `).join('');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Bảo vệ trang - chỉ user đăng nhập mới vào được
    Auth.requireAuth();
    Auth.updateUI();

    // Hiển thị tên & email user
    document.getElementById('userName').textContent = localStorage.getItem('userName') || 'Người dùng';
    document.getElementById('userEmail').textContent = localStorage.getItem('userEmail') || '';

    // Render đơn hàng
    renderOrders();

    // Tab filter
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOrders(btn.dataset.status);
        });
    });

    // Đăng xuất
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
    });
});