/**
 * profile.js - Logic trang hồ sơ cá nhân
 */

document.addEventListener('DOMContentLoaded', () => {
    Auth.requireAuth();
    Auth.updateUI();

    // ===== Load thông tin user từ localStorage =====
    const name  = localStorage.getItem('userName')  || 'Người dùng';
    const email = localStorage.getItem('userEmail') || '';

    // Sidebar
    document.getElementById('sidebarName').textContent  = name;
    document.getElementById('sidebarEmail').textContent = email;

    // Avatar chữ cái đầu
    document.getElementById('profileAvatar').textContent = name.charAt(0).toUpperCase();
    document.getElementById('avatarName').textContent    = name;
    document.getElementById('avatarEmail').textContent   = email;

    // Fields
    document.getElementById('fieldName').value  = name;
    document.getElementById('fieldEmail').value = email;

    // ===== EDIT MODE =====
    const btnEdit        = document.getElementById('btnEdit');
    const btnEditActions = document.getElementById('btnEditActions');
    const btnCancel      = document.getElementById('btnCancel');
    const btnSave        = document.getElementById('btnSave');
    const avatarCameraBtn = document.getElementById('avatarCameraBtn');

    const editableFields = ['fieldName', 'fieldEmail', 'fieldPhone', 'fieldDob', 'fieldGender'];

    // Lưu giá trị gốc để hủy
    let originalValues = {};

    function enterEditMode() {
        // Lưu giá trị hiện tại
        editableFields.forEach(id => {
            const el = document.getElementById(id);
            originalValues[id] = el.value;
            el.disabled = false;
        });

        btnEdit.style.display        = 'none';
        btnEditActions.style.display = 'flex';
        avatarCameraBtn.style.display = 'flex';
    }

    function exitEditMode() {
        editableFields.forEach(id => {
            document.getElementById(id).disabled = true;
        });
        btnEdit.style.display        = '';
        btnEditActions.style.display = 'none';
        avatarCameraBtn.style.display = 'none';
    }

    btnEdit.addEventListener('click', enterEditMode);

    btnCancel.addEventListener('click', () => {
        // Khôi phục giá trị gốc
        editableFields.forEach(id => {
            document.getElementById(id).value = originalValues[id];
        });
        exitEditMode();
    });

    btnSave.addEventListener('click', () => {
        const newName  = document.getElementById('fieldName').value.trim();
        const newEmail = document.getElementById('fieldEmail').value.trim();

        if (!newName) {
            alert('Tên không được để trống!');
            return;
        }

        // Lưu vào localStorage
        localStorage.setItem('userName', newName);
        localStorage.setItem('userEmail', newEmail);

        // Cập nhật UI
        document.getElementById('sidebarName').textContent   = newName;
        document.getElementById('sidebarEmail').textContent  = newEmail;
        document.getElementById('profileAvatar').textContent = newName.charAt(0).toUpperCase();
        document.getElementById('avatarName').textContent    = newName;
        document.getElementById('avatarEmail').textContent   = newEmail;

        exitEditMode();
    });

    // ===== ĐỔI MẬT KHẨU =====
    const btnPasswordToggle = document.getElementById('btnPasswordToggle');
    const passwordForm      = document.getElementById('passwordForm');

    btnPasswordToggle.addEventListener('click', () => {
        const isOpen = passwordForm.style.display !== 'none';
        passwordForm.style.display = isOpen ? 'none' : 'flex';
        btnPasswordToggle.classList.toggle('open', !isOpen);
    });

    // Toggle show/hide password
    document.querySelectorAll('.toggle-pw-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.target);
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    });

    // Submit đổi mật khẩu
    document.getElementById('btnSavePassword').addEventListener('click', () => {
        const current = document.getElementById('currentPassword').value;
        const newPw   = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const msg     = document.getElementById('passwordMsg');

        const showMsg = (text, type) => {
            msg.textContent  = text;
            msg.className    = `password-msg ${type}`;
            msg.style.display = '';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
        };

        if (!current || !newPw || !confirm) {
            showMsg('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        // Tạm thời kiểm tra mật khẩu hiện tại hardcode
        const savedPassword = localStorage.getItem('userPassword') || '123456';
        if (current !== savedPassword) {
            showMsg('Mật khẩu hiện tại không đúng!', 'error');
            return;
        }

        if (newPw.length < 6) {
            showMsg('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
            return;
        }

        if (newPw !== confirm) {
            showMsg('Mật khẩu xác nhận không khớp!', 'error');
            return;
        }

        // Lưu mật khẩu mới
        localStorage.setItem('userPassword', newPw);

        // Reset form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value     = '';
        document.getElementById('confirmPassword').value = '';

        showMsg('Đổi mật khẩu thành công!', 'success');
    });

    // ===== ĐĂNG XUẤT =====
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        Auth.logout();
    });
});