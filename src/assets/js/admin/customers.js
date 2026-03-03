/**
 * customers.js - Quản lý khách hàng admin
 */

const CUSTOMERS = [
    {
        id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0901234567',
        address: '123 Nguyễn Huệ, Quận 1, TP. HCM', joined: '15/6/2025',
        orders: 15, spend: 8450000, status: 'active',
        history: [
            { id: '#DH-2026-145', date: '28/2/2026', items: 3, total: 850000, status: 'completed' },
            { id: '#DH-2026-098', date: '15/1/2026', items: 5, total: 1250000, status: 'completed' },
            { id: '#DH-2025-234', date: '10/12/2025', items: 2, total: 620000, status: 'completed' },
            { id: '#DH-2025-189', date: '5/11/2025', items: 1, total: 299000, status: 'completed' },
        ]
    },
    {
        id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0909876543',
        address: '45 Lê Lợi, Quận 3, TP. HCM', joined: '20/8/2025',
        orders: 8, spend: 4250000, status: 'active',
        history: [
            { id: '#DH-2026-132', date: '20/2/2026', items: 2, total: 750000, status: 'shipping' },
            { id: '#DH-2025-310', date: '1/12/2025', items: 3, total: 980000, status: 'completed' },
            { id: '#DH-2025-245', date: '15/10/2025', items: 1, total: 450000, status: 'completed' },
        ]
    },
    {
        id: 3, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0912345678',
        address: '78 Trần Phú, Hà Đông, Hà Nội', joined: '10/11/2025',
        orders: 3, spend: 1890000, status: 'active',
        history: [
            { id: '#DH-2026-101', date: '5/2/2026', items: 2, total: 690000, status: 'pending' },
            { id: '#DH-2025-401', date: '20/12/2025', items: 1, total: 599000, status: 'completed' },
        ]
    },
    {
        id: 4, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0934567890',
        address: '12 Hoàng Diệu, Hải Châu, Đà Nẵng', joined: '3/9/2025',
        orders: 6, spend: 3200000, status: 'active',
        history: [
            { id: '#DH-2026-089', date: '10/2/2026', items: 4, total: 1200000, status: 'completed' },
            { id: '#DH-2025-278', date: '25/11/2025', items: 2, total: 800000, status: 'completed' },
        ]
    },
    {
        id: 5, name: 'Hoàng Văn E', email: 'hoangvane@email.com', phone: '0945678901',
        address: '56 Ngô Quyền, Hoàn Kiếm, Hà Nội', joined: '12/7/2025',
        orders: 11, spend: 6700000, status: 'active',
        history: [
            { id: '#DH-2026-120', date: '18/2/2026', items: 3, total: 1490000, status: 'completed' },
            { id: '#DH-2026-055', date: '10/1/2026', items: 2, total: 980000, status: 'completed' },
        ]
    },
    {
        id: 6, name: 'Đỗ Thị F', email: 'dothif@email.com', phone: '0956789012',
        address: '89 Lý Thường Kiệt, Tân Bình, TP. HCM', joined: '28/10/2025',
        orders: 2, spend: 1370000, status: 'blocked',
        history: [
            { id: '#DH-2025-389', date: '5/12/2025', items: 1, total: 699000, status: 'cancelled' },
            { id: '#DH-2025-302', date: '10/11/2025', items: 2, total: 671000, status: 'cancelled' },
        ]
    },
];

let viewingCustomerId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    updateStats();
    renderTable();
    bindEvents();
});

// ===== STATS =====
function updateStats() {
    document.getElementById('csTotalKH').textContent    = CUSTOMERS.length;
    document.getElementById('csActive').textContent     = CUSTOMERS.filter(c => c.status === 'active').length;
    document.getElementById('csBlocked').textContent    = CUSTOMERS.filter(c => c.status === 'blocked').length;
    const total = CUSTOMERS.reduce((s, c) => s + c.spend, 0);
    document.getElementById('csTotalRevenue').textContent = total.toLocaleString('vi-VN') + 'đ';
}

// ===== RENDER TABLE =====
function renderTable(filter = '') {
    const tbody = document.getElementById('custTableBody');
    const list  = filter
        ? CUSTOMERS.filter(c =>
            c.name.toLowerCase().includes(filter.toLowerCase()) ||
            c.email.toLowerCase().includes(filter.toLowerCase()) ||
            c.phone.includes(filter))
        : CUSTOMERS;

    if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:var(--gray-text)">Không tìm thấy khách hàng</td></tr>`;
        return;
    }

    tbody.innerHTML = list.map(c => `
        <tr>
            <td>
                <div class="cust-cell">
                    <div class="cust-avatar">${c.name.charAt(0)}</div>
                    <div>
                        <div class="cust-cell-name">${c.name}</div>
                        <div class="cust-cell-id">ID: ${c.id}</div>
                    </div>
                </div>
            </td>
            <td>
                <div class="contact-cell">
                    <div class="contact-row">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        ${c.email}
                    </div>
                    <div class="contact-row">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        ${c.phone}
                    </div>
                </div>
            </td>
            <td>
                <div style="display:flex;align-items:center;gap:6px;color:#555;font-size:.875rem">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    ${c.orders}
                </div>
            </td>
            <td class="spend-val">${c.spend.toLocaleString('vi-VN')}đ</td>
            <td>
                <div class="date-cell">
                    <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    ${c.joined}
                </div>
            </td>
            <td><span class="cust-badge ${c.status === 'active' ? 'active' : 'blocked'}">${c.status === 'active' ? 'Hoạt động' : 'Đã chặn'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-view-cust" onclick="openDetail(${c.id})" title="Xem chi tiết">
                        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button class="btn-block-cust" onclick="toggleBlock(${c.id})" title="${c.status === 'active' ? 'Chặn' : 'Bỏ chặn'}">
                        <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ===== OPEN DETAIL =====
function openDetail(id) {
    const c = CUSTOMERS.find(x => x.id === id);
    if (!c) return;
    viewingCustomerId = id;

    document.getElementById('cdmAvatar').textContent  = c.name.charAt(0);
    document.getElementById('cdmName').textContent    = c.name;
    document.getElementById('cdmEmail').textContent   = c.email;
    document.getElementById('cdmPhone').textContent   = c.phone;
    document.getElementById('cdmAddress').textContent = c.address;
    document.getElementById('cdmJoined').textContent  = c.joined;
    document.getElementById('cdmOrders').textContent  = c.orders;

    const spendM = c.spend / 1000000;
    document.getElementById('cdmSpend').textContent   = spendM.toFixed(1) + ' Trđ';
    const avg = Math.round(c.spend / c.orders / 1000);
    document.getElementById('cdmAvgOrder').textContent = avg + 'K';

    // Block btn
    const blockBtn  = document.getElementById('cdmBtnBlock');
    const blockText = document.getElementById('cdmBtnBlockText');
    if (c.status === 'blocked') {
        blockBtn.classList.add('unblock');
        blockText.textContent = 'Bỏ chặn khách hàng';
    } else {
        blockBtn.classList.remove('unblock');
        blockText.textContent = 'Chặn khách hàng';
    }

    // Order history
    const statusMap = {
        completed: ['Hoàn thành','completed'],
        shipping:  ['Đang giao','shipping'],
        pending:   ['Chờ xử lý','pending'],
        cancelled: ['Đã hủy','cancelled'],
    };

    document.getElementById('cdmOrderList').innerHTML = c.history.map(o => {
        const [label, cls] = statusMap[o.status] || ['—',''];
        return `
        <div class="cdm-order-item">
            <div class="cdm-order-top">
                <span class="cdm-order-id">${o.id}</span>
                <span class="cdm-order-badge ${cls}">${label}</span>
            </div>
            <div class="cdm-order-meta">
                <span>${o.date} &nbsp;·&nbsp; ${o.items} sản phẩm</span>
                <span class="cdm-order-price">${o.total.toLocaleString('vi-VN')}đ</span>
            </div>
        </div>`;
    }).join('');

    const overlay = document.getElementById('custDetailOverlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

function closeDetail() {
    const overlay = document.getElementById('custDetailOverlay');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 220);
    document.body.style.overflow = '';
    viewingCustomerId = null;
}

// ===== BLOCK / UNBLOCK =====
function toggleBlock(id) {
    const c = CUSTOMERS.find(x => x.id === id);
    if (!c) return;
    c.status = c.status === 'active' ? 'blocked' : 'active';
    updateStats();
    renderTable(document.getElementById('custSearch').value);
}

// ===== EVENTS =====
function bindEvents() {
    document.getElementById('custSearch')?.addEventListener('input', e => renderTable(e.target.value));

    document.getElementById('cdmClose')?.addEventListener('click', closeDetail);
    document.getElementById('cdmBtnClose')?.addEventListener('click', closeDetail);
    document.getElementById('custDetailOverlay')?.addEventListener('click', e => {
        if (e.target === document.getElementById('custDetailOverlay')) closeDetail();
    });

    document.getElementById('cdmBtnBlock')?.addEventListener('click', () => {
        if (!viewingCustomerId) return;
        toggleBlock(viewingCustomerId);
        openDetail(viewingCustomerId); // re-render modal
    });
}