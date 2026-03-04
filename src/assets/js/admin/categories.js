/**
 * categories.js - Quản lý danh mục admin
 * Lưu vào localStorage để products.js đọc được
 */

const CAT_STORAGE_KEY = 'adminCategories';

// ===== DEFAULT DATA =====
const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Đồ Nam',    parentId: null },
    { id: 2, name: 'Áo',        parentId: 1    },
    { id: 3, name: 'Quần',      parentId: 1    },
    { id: 4, name: 'Phụ kiện',  parentId: 1    },
    { id: 5, name: 'Đồ Nữ',    parentId: null },
    { id: 6, name: 'Váy',       parentId: 5    },
    { id: 7, name: 'Áo',        parentId: 5    },
    { id: 8, name: 'Quần',      parentId: 5    },
    { id: 9, name: 'Đồ Trẻ em', parentId: null },
    { id: 10, name: 'Giày dép', parentId: null },
];

let categories   = [];
let editingCatId = null;
let deleteCatId  = null;
let expanded     = new Set([1, 5]); // mở sẵn Đồ Nam, Đồ Nữ

// ===== STORAGE =====
function loadCategories() {
    try {
        const saved = localStorage.getItem(CAT_STORAGE_KEY);
        categories = saved ? JSON.parse(saved) : [...DEFAULT_CATEGORIES];
    } catch {
        categories = [...DEFAULT_CATEGORIES];
    }
}

function saveCategories() {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
}

function nextId() {
    return Math.max(...categories.map(c => c.id), 0) + 1;
}

// ===== RENDER TREE =====
function renderTree() {
    const tree  = document.getElementById('catTree');
    const roots = categories.filter(c => !c.parentId);

    tree.innerHTML = roots.map(root => {
        const children = categories.filter(c => c.parentId === root.id);
        const isOpen   = expanded.has(root.id);

        return `
        <div class="cat-root-item">
            <div class="cat-root-row ${editingCatId === root.id ? 'selected' : ''}"
                 onclick="toggleExpand(${root.id})">
                <span class="cat-toggle ${isOpen ? 'open' : ''}">
                    ${children.length > 0
                        ? `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="${isOpen ? 'm6 9 6 6 6-6' : 'm9 18 6-6-6-6'}"/></svg>`
                        : '<span style="width:12px;display:inline-block"></span>'
                    }
                </span>
                <svg class="cat-folder-icon" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
                <span class="cat-root-name">${root.name}</span>
                <div class="cat-row-actions">
                    <button class="cat-action-btn" onclick="editCat(event, ${root.id})" title="Sửa">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="cat-action-btn del" onclick="openDeleteCat(event, ${root.id})" title="Xóa">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${children.length > 0 ? `
            <div class="cat-children ${isOpen ? 'open' : ''}">
                ${children.map(child => `
                    <div class="cat-child-row ${editingCatId === child.id ? 'selected' : ''}">
                        <svg class="cat-child-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span class="cat-child-name" onclick="editCat(event, ${child.id})" style="cursor:pointer;flex:1">${child.name}</span>
                        <div class="cat-row-actions" style="opacity:1">
                            <button class="cat-action-btn" onclick="editCat(event, ${child.id})" title="Sửa">
                                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                            </button>
                            <button class="cat-action-btn del" onclick="openDeleteCat(event, ${child.id})" title="Xóa">
                                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>` : ''}
        </div>`;
    }).join('');

    renderParentSelect();
}

// ===== TOGGLE EXPAND =====
function toggleExpand(id) {
    if (expanded.has(id)) expanded.delete(id);
    else expanded.add(id);
    renderTree();
}

// ===== PARENT SELECT =====
function renderParentSelect() {
    const sel   = document.getElementById('catParent');
    const cur   = sel.value;
    const roots = categories.filter(c => !c.parentId && c.id !== editingCatId);

    sel.innerHTML = `<option value="">-- Không có (Danh mục gốc) --</option>` +
        roots.map(r => `<option value="${r.id}" ${cur == r.id ? 'selected' : ''}>${r.name}</option>`).join('');
}

// ===== EDIT =====
function editCat(e, id) {
    e.stopPropagation();
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    editingCatId = id;
    document.getElementById('catFormTitle').textContent = 'Chỉnh sửa danh mục';
    document.getElementById('catBtnSave').textContent   = 'Lưu thay đổi';
    document.getElementById('catName').value            = cat.name;

    renderParentSelect();
    document.getElementById('catParent').value = cat.parentId || '';

    renderTree();
}

// ===== SAVE =====
function saveCat() {
    const name     = document.getElementById('catName').value.trim();
    const parentId = document.getElementById('catParent').value
                     ? parseInt(document.getElementById('catParent').value) : null;

    if (!name) { alert('Vui lòng nhập tên danh mục!'); return; }

    if (editingCatId) {
        const idx = categories.findIndex(c => c.id === editingCatId);
        if (idx !== -1) categories[idx] = { ...categories[idx], name, parentId };
    } else {
        categories.push({ id: nextId(), name, parentId });
        if (parentId) expanded.add(parentId);
    }

    saveCategories();
    resetCatForm();
    renderTree();
}

// ===== RESET FORM =====
function resetCatForm() {
    editingCatId = null;
    document.getElementById('catFormTitle').textContent = 'Thêm danh mục mới';
    document.getElementById('catBtnSave').textContent   = 'Lưu danh mục';
    document.getElementById('catName').value            = '';
    document.getElementById('catParent').value          = '';
    renderTree();
}

// ===== DELETE =====
function openDeleteCat(e, id) {
    e.stopPropagation();
    e.preventDefault();
    const cat = categories.find(c => c.id === id);
    if (!cat) return;

    deleteCatId = id;
    const children = categories.filter(c => c.parentId === id);
    let msg = `Bạn có chắc muốn xóa danh mục "${cat.name}"?`;
    if (children.length > 0) msg += ` Sẽ xóa luôn ${children.length} danh mục con.`;

    document.getElementById('catDeleteMsg').textContent = msg;
    const overlay = document.getElementById('catDeleteOverlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

function closeDeleteCat() {
    const overlay = document.getElementById('catDeleteOverlay');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 200);
    document.body.style.overflow = '';
    deleteCatId = null;
}

function confirmDeleteCat() {
    if (!deleteCatId) return;

    const childIds = categories
        .filter(c => c.parentId === deleteCatId)
        .map(c => c.id);
    const toDelete = new Set([deleteCatId, ...childIds]);

    categories = categories.filter(c => !toDelete.has(c.id));
    saveCategories();

    if (toDelete.has(editingCatId)) resetCatForm();

    closeDeleteCat();
    renderTree();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    renderTree();

    document.getElementById('catBtnSave').addEventListener('click', saveCat);
    document.getElementById('catBtnCancel').addEventListener('click', resetCatForm);
    document.getElementById('catCancelDelete').addEventListener('click', closeDeleteCat);
    document.getElementById('catConfirmDelete').addEventListener('click', confirmDeleteCat);
});