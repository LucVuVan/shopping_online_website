/**
 * home.js - Logic cho trang chủ (index.html)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cập nhật navbar theo trạng thái login
    Auth.updateUI();

    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const priceVal = document.getElementById('priceVal');

    if (priceRange && priceVal) {
        priceRange.addEventListener('input', () => {
            priceVal.textContent = Number(priceRange.value).toLocaleString('vi-VN') + 'đ';
        });
    }
});