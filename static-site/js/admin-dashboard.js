/* ========================================================================
   Admin Dashboard Module v2.0
   Complete admin dashboard: Books, Authors, Publishers, Categories,
   Notifications, Users, Borrow Records, Reservations, Reports, Settings.
   ======================================================================== */

var AdminDashboard = (function () {
  'use strict';

  var state = {
    activeSection: 'dashboard',
    bookSearch: '', bookFilterCategory: '', bookFilterClass: '', bookPage: 1, booksPerPage: 15,
    authorSearch: '', publisherSearch: '', userSearch: '', categorySearch: '',
    notificationFilter: 'all',
    borrowFilter: 'all', borrowPage: 1, borrowsPerPage: 15,
    reservationFilter: 'all', reservationPage: 1, reservationsPerPage: 15,
    editingBookId: null, editingAuthorId: null, editingPublisherId: null,
    editingCategoryId: null, editingBorrowId: null,
    sidebarOpen: false, reportType: 'books'
  };

  /* ========== Utilities ========== */
  function timeAgo(dateString) {
    if (!dateString) return 'Unknown';
    var diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (isNaN(diff)) return 'Unknown';
    if (diff < 5) return 'just now'; if (diff < 60) return diff + 's ago';
    var m = Math.floor(diff / 60); if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    var d = Math.floor(h / 24); if (d < 30) return d + 'd ago';
    var mo = Math.floor(d / 30); if (mo < 12) return mo + 'mo ago';
    return Math.floor(mo / 12) + 'y ago';
  }

  function escapeHTML(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(String(str)));
    return d.innerHTML;
  }

  function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function fmtDate(d) {
    if (!d) return '\u2014';
    var dt = new Date(d);
    return isNaN(dt.getTime()) ? '\u2014' : dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function fmtDateTime(d) {
    if (!d) return '\u2014';
    var dt = new Date(d);
    return isNaN(dt.getTime()) ? '\u2014' : dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /* ========== Data Access ========== */
  function ls(key) { try { var s = localStorage.getItem(key); return s ? JSON.parse(s) : []; } catch (e) { return []; } }
  function lsSave(key, arr) { try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {} }
  function getBooks() {
    try {
      var stored = localStorage.getItem('sl_books');
      if (stored) { var p = JSON.parse(stored); if (Array.isArray(p) && p.length > 0) return p; }
      var src = (typeof allBooks !== 'undefined' && Array.isArray(allBooks) && allBooks.length) ? allBooks : (typeof books !== 'undefined' && Array.isArray(books) && books.length) ? books : [];
      if (src.length) { localStorage.setItem('sl_books', JSON.stringify(src)); return src; }
      return [];
    } catch (e) { return []; }
  }
  function saveBooks(a) { lsSave('sl_books', a); }
  function getAuthors() { return ls('sl_authors'); }
  function saveAuthors(a) { lsSave('sl_authors', a); }
  function getPublishers() { return ls('sl_publishers'); }
  function savePublishers(a) { lsSave('sl_publishers', a); }
  function getCategories() { return ls('sl_categories'); }
  function saveCategories(a) { lsSave('sl_categories', a); }
  function getNotifications() {
    if (typeof Notifications !== 'undefined' && typeof Notifications.getAll === 'function') return Notifications.getAll() || [];
    return ls('sl_notifications');
  }
  function saveNotifications(a) { lsSave('sl_notifications', a); }
  function getAllUsers() {
    if (typeof Users !== 'undefined' && typeof Users.getAll === 'function') return Users.getAll() || [];
    if (typeof Auth !== 'undefined' && typeof Auth.getAllUsers === 'function') return Auth.getAllUsers() || [];
    return [];
  }
  function getBorrowRecords() { return ls('sl_borrow_records'); }
  function saveBorrowRecords(a) { lsSave('sl_borrow_records', a); }
  function getReservations() { return ls('sl_reservations'); }
  function saveReservations(a) { lsSave('sl_reservations', a); }
  function getSettings() { try { return JSON.parse(localStorage.getItem('sl_site_settings') || '{}'); } catch (e) { return {}; } }
  function saveSettings(o) { try { localStorage.setItem('sl_site_settings', JSON.stringify(o)); } catch (e) {} }
  function getUnreadCount() {
    if (typeof Notifications !== 'undefined' && typeof Notifications.getUnreadCount === 'function') return Notifications.getUnreadCount();
    return getNotifications().filter(function (n) { return !n.read; }).length;
  }

  /* ========== Toast & Confirm ========== */
  function showToast(msg, type) {
    if (typeof window.showToast === 'function') { window.showToast(msg, type); return; }
    var t = document.createElement('div');
    var bg = type === 'error' ? '#e53e3e' : type === 'success' ? '#38a169' : '#3182ce';
    t.style.cssText = 'position:fixed;top:20px;right:20px;z-index:99999;background:' + bg + ';color:#fff;padding:14px 24px;border-radius:10px;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,.3);transition:opacity .3s;max-width:400px';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 3000);
  }

  function showConfirm(title, message, onConfirm) {
    var ex = document.getElementById('admin-confirm-dialog'); if (ex) ex.remove();
    document.body.insertAdjacentHTML('beforeend',
      '<div class="confirm-overlay" id="admin-confirm-dialog"><div class="confirm-box">' +
      '<h3>' + escapeHTML(title) + '</h3><p>' + escapeHTML(message) + '</p>' +
      '<div class="confirm-actions"><button class="btn btn-outline" id="admin-confirm-cancel">Cancel</button>' +
      '<button class="btn btn-danger" id="admin-confirm-ok">Confirm</button></div></div></div>');
    document.getElementById('admin-confirm-cancel').onclick = function () { document.getElementById('admin-confirm-dialog').remove(); };
    document.getElementById('admin-confirm-ok').onclick = function () { document.getElementById('admin-confirm-dialog').remove(); if (onConfirm) onConfirm(); };
  }

  /* ========== Animated Counter ========== */
  function animateCounter(el, target) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 600, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ========== Pagination Helper ========== */
  function renderPagination(current, total, count, prefix) {
    if (total <= 1) return '';
    return '<div class="' + prefix + '-pag"><div class="pagination">' +
      '<button data-page="prev"' + (current <= 1 ? ' disabled' : '') + '>&laquo;</button>' +
      '<span class="pagination-info">Page ' + current + ' of ' + total + ' (' + count + ')</span>' +
      '<button data-page="next"' + (current >= total ? ' disabled' : '') + '>&raquo;</button></div></div>';
  }

  /* ========== Styles ========== */
  function getStyles() {
    return '<style>' +
      '#admin-dashboard{display:flex;min-height:calc(100vh - 80px);background:var(--bg-primary);color:var(--text-primary);font-family:inherit}' +
      '#admin-dashboard *{box-sizing:border-box}' +
      '#admin-dashboard .admin-sidebar{width:260px;min-width:260px;background:var(--bg-secondary);border-right:1px solid var(--border-color);padding:24px 0;display:flex;flex-direction:column;position:sticky;top:80px;height:calc(100vh - 80px);overflow-y:auto;z-index:100}' +
      '#admin-dashboard .sidebar-header{padding:0 24px 24px;border-bottom:1px solid var(--border-color);margin-bottom:8px}' +
      '#admin-dashboard .sidebar-header h2{margin:0;font-size:20px;font-weight:700}' +
      '#admin-dashboard .sidebar-header p{margin:4px 0 0;font-size:13px;color:var(--text-secondary)}' +
      '#admin-dashboard .sidebar-nav{flex:1;padding:8px 12px}' +
      '#admin-dashboard .nav-item{display:flex;align-items:center;gap:12px;padding:11px 16px;border-radius:10px;cursor:pointer;transition:all .2s;color:var(--text-secondary);font-size:14px;font-weight:500;margin-bottom:2px;user-select:none}' +
      '#admin-dashboard .nav-item:hover{background:var(--bg-tertiary);color:var(--text-primary)}' +
      '#admin-dashboard .nav-item.active{background:var(--accent-bg);color:var(--accent);font-weight:600}' +
      '#admin-dashboard .nav-item i{width:20px;text-align:center;font-size:15px}' +
      '#admin-dashboard .nav-badge{margin-left:auto;background:var(--accent);color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;min-width:20px;text-align:center}' +
      '#admin-dashboard .nav-divider{height:1px;background:var(--border-color);margin:8px 16px}' +
      '#admin-dashboard .admin-content{flex:1;padding:32px;overflow-y:auto;min-width:0}' +
      '#admin-dashboard .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:28px;flex-wrap:wrap;gap:12px}' +
      '#admin-dashboard .section-header h1{margin:0;font-size:28px;font-weight:700}' +
      '#admin-dashboard .section-header p{margin:4px 0 0;font-size:14px;color:var(--text-secondary)}' +
      '#admin-dashboard .section-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
      '#admin-dashboard .stat-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:28px}' +
      '#admin-dashboard .stat-card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:14px;padding:22px;transition:transform .2s,box-shadow .2s}' +
      '#admin-dashboard .stat-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}' +
      '#admin-dashboard .stat-card .stat-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:14px}' +
      '#admin-dashboard .stat-card .stat-value{font-size:30px;font-weight:700;line-height:1.1;margin-bottom:4px}' +
      '#admin-dashboard .stat-card .stat-label{font-size:13px;color:var(--text-secondary);font-weight:500}' +
      '#admin-dashboard .card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:14px;padding:24px;margin-bottom:24px}' +
      '#admin-dashboard .card h3{margin:0 0 16px;font-size:18px;font-weight:600}' +
      '#admin-dashboard table{width:100%;border-collapse:collapse}' +
      '#admin-dashboard th{text-align:left;padding:12px 14px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--text-secondary);border-bottom:2px solid var(--border-color);white-space:nowrap}' +
      '#admin-dashboard td{padding:11px 14px;font-size:14px;border-bottom:1px solid var(--border-color);vertical-align:middle}' +
      '#admin-dashboard tr:hover td{background:var(--bg-tertiary)}' +
      '#admin-dashboard .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;text-decoration:none;line-height:1.4}' +
      '#admin-dashboard .btn:active{transform:scale(0.97)}' +
      '#admin-dashboard .btn-primary{background:var(--accent);color:#fff}' +
      '#admin-dashboard .btn-primary:hover{opacity:.9}' +
      '#admin-dashboard .btn-danger{background:#e53e3e;color:#fff}' +
      '#admin-dashboard .btn-danger:hover{background:#c53030}' +
      '#admin-dashboard .btn-success{background:#38a169;color:#fff}' +
      '#admin-dashboard .btn-success:hover{background:#2f855a}' +
      '#admin-dashboard .btn-warning{background:#d97706;color:#fff}' +
      '#admin-dashboard .btn-outline{background:transparent;border:1px solid var(--border-color);color:var(--text-primary)}' +
      '#admin-dashboard .btn-outline:hover{background:var(--bg-tertiary)}' +
      '#admin-dashboard .btn-sm{padding:6px 14px;font-size:13px;border-radius:8px}' +
      '#admin-dashboard .btn-xs{padding:4px 10px;font-size:12px;border-radius:6px}' +
      '#admin-dashboard .search-wrap{position:relative;flex:1;min-width:200px}' +
      '#admin-dashboard .search-wrap i{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-tertiary);font-size:14px}' +
      '#admin-dashboard .search-wrap input{width:100%;padding:10px 16px 10px 40px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-tertiary);color:var(--text-primary);font-size:14px;transition:border-color .2s}' +
      '#admin-dashboard .search-wrap input:focus{outline:none;border-color:var(--accent)}' +
      '#admin-dashboard .filter-tabs{display:flex;gap:4px;margin-bottom:20px;background:var(--bg-tertiary);border-radius:10px;padding:4px;width:fit-content;flex-wrap:wrap}' +
      '#admin-dashboard .filter-tab{padding:8px 18px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;color:var(--text-secondary);user-select:none}' +
      '#admin-dashboard .filter-tab:hover{color:var(--text-primary)}' +
      '#admin-dashboard .filter-tab.active{background:var(--bg-secondary);color:var(--text-primary);box-shadow:var(--shadow-sm);font-weight:600}' +
      '#admin-dashboard select.filter-select{padding:10px 14px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-tertiary);color:var(--text-primary);font-size:14px;cursor:pointer}' +
      '#admin-dashboard select.filter-select:focus{outline:none;border-color:var(--accent)}' +
      '#admin-dashboard .pagination{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:20px}' +
      '#admin-dashboard .pagination button{padding:6px 14px;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-secondary);color:var(--text-primary);font-size:13px;cursor:pointer;transition:all .2s}' +
      '#admin-dashboard .pagination button:hover{background:var(--bg-tertiary)}' +
      '#admin-dashboard .pagination button:disabled{opacity:.4;cursor:not-allowed}' +
      '#admin-dashboard .pagination-info{font-size:13px;color:var(--text-secondary);margin:0 8px}' +
      '#admin-dashboard .form-group{margin-bottom:18px}' +
      '#admin-dashboard .form-group label{display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;text-transform:uppercase;letter-spacing:.3px}' +
      '#admin-dashboard .form-group input,.admin-dashboard .form-group select,.admin-dashboard .form-group textarea{width:100%;padding:10px 14px;border:1px solid var(--border-color);border-radius:10px;background:var(--bg-tertiary);color:var(--text-primary);font-size:14px;font-family:inherit;transition:border-color .2s}' +
      '#admin-dashboard .form-group input:focus,.admin-dashboard .form-group select:focus,.admin-dashboard .form-group textarea:focus{outline:none;border-color:var(--accent)}' +
      '#admin-dashboard .form-group textarea{min-height:100px;resize:vertical}' +
      '#admin-dashboard .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px}' +
      '#admin-dashboard .role-badge{display:inline-block;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:600}' +
      '#admin-dashboard .role-admin{background:#fef3c7;color:#92400e}' +
      '#admin-dashboard .role-user{background:#dbeafe;color:#1e40af}' +
      '#admin-dashboard .badge-success{background:#d1fae5;color:#065f46}' +
      '#admin-dashboard .badge-warning{background:#fef3c7;color:#92400e}' +
      '#admin-dashboard .badge-danger{background:#fee2e2;color:#991b1b}' +
      '#admin-dashboard .badge-info{background:#dbeafe;color:#1e40af}' +
      '#admin-dashboard .badge-secondary{background:var(--bg-tertiary);color:var(--text-secondary)}' +
      '#admin-dashboard .notif-item{display:flex;align-items:flex-start;gap:14px;padding:14px;border-radius:10px;cursor:pointer;transition:background .2s;border:1px solid transparent;margin-bottom:8px}' +
      '#admin-dashboard .notif-item:hover{background:var(--bg-tertiary)}' +
      '#admin-dashboard .notif-item.unread{border-left:3px solid var(--accent);background:var(--accent-bg)}' +
      '#admin-dashboard .notif-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}' +
      '#admin-dashboard .notif-body{flex:1;min-width:0}' +
      '#admin-dashboard .notif-title{font-size:14px;font-weight:600;margin-bottom:2px}' +
      '#admin-dashboard .notif-message{font-size:13px;color:var(--text-secondary);margin-bottom:4px}' +
      '#admin-dashboard .notif-time{font-size:12px;color:var(--text-tertiary)}' +
      '#admin-dashboard .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;backdrop-filter:blur(4px)}' +
      '#admin-dashboard .modal{background:var(--bg-secondary);border-radius:16px;width:100%;max-width:720px;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.3);padding:32px}' +
      '#admin-dashboard .modal h2{margin:0 0 24px;font-size:22px;font-weight:700}' +
      '#admin-dashboard .modal-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:24px;padding-top:20px;border-top:1px solid var(--border-color)}' +
      '#admin-dashboard .confirm-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:10001;padding:20px;backdrop-filter:blur(4px)}' +
      '#admin-dashboard .confirm-box{background:var(--bg-secondary);border-radius:16px;padding:32px;max-width:420px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.3)}' +
      '#admin-dashboard .confirm-box h3{margin:0 0 12px;font-size:20px}' +
      '#admin-dashboard .confirm-box p{margin:0 0 24px;color:var(--text-secondary);font-size:14px}' +
      '#admin-dashboard .confirm-box .confirm-actions{display:flex;gap:12px;justify-content:center}' +
      '#admin-dashboard .empty-state{text-align:center;padding:48px 20px;color:var(--text-secondary)}' +
      '#admin-dashboard .empty-state i{font-size:48px;margin-bottom:16px;opacity:.4;display:block}' +
      '#admin-dashboard .empty-state p{margin:0;font-size:15px}' +
      '#admin-dashboard .categories-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}' +
      '#admin-dashboard .category-card{background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:14px;padding:20px;transition:transform .2s;position:relative}' +
      '#admin-dashboard .category-card:hover{transform:translateY(-2px)}' +
      '#admin-dashboard .category-card .cat-icon{font-size:32px;margin-bottom:10px}' +
      '#admin-dashboard .category-card .cat-name{font-size:16px;font-weight:600;margin-bottom:4px}' +
      '#admin-dashboard .category-card .cat-desc{font-size:13px;color:var(--text-secondary);margin-bottom:10px;line-height:1.4}' +
      '#admin-dashboard .category-card .cat-count{font-size:13px;color:var(--accent);font-weight:600}' +
      '#admin-dashboard .category-card .cat-actions{position:absolute;top:12px;right:12px;display:flex;gap:4px}' +
      '#admin-dashboard .quick-actions{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:28px}' +
      '#admin-dashboard .quick-action-btn{display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px 12px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:12px;cursor:pointer;transition:all .2s;font-size:13px;font-weight:500;color:var(--text-secondary)}' +
      '#admin-dashboard .quick-action-btn:hover{background:var(--accent-bg);color:var(--accent);border-color:var(--accent)}' +
      '#admin-dashboard .quick-action-btn i{font-size:22px}' +
      '#admin-dashboard .activity-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border-color);font-size:14px}' +
      '#admin-dashboard .activity-item:last-child{border-bottom:none}' +
      '#admin-dashboard .activity-dot{width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0}' +
      '#admin-dashboard .report-option{display:flex;align-items:center;gap:16px;padding:18px;background:var(--bg-tertiary);border:1px solid var(--border-color);border-radius:12px;cursor:pointer;transition:all .2s;margin-bottom:12px}' +
      '#admin-dashboard .report-option:hover{border-color:var(--accent)}' +
      '#admin-dashboard .report-option.active{border-color:var(--accent);background:var(--accent-bg)}' +
      '#admin-dashboard .report-option i{font-size:24px;color:var(--accent)}' +
      '#admin-dashboard .report-option h4{margin:0 0 2px;font-size:15px}' +
      '#admin-dashboard .report-option p{margin:0;font-size:13px;color:var(--text-secondary)}' +
      '#admin-dashboard .export-btns{display:flex;gap:8px;flex-wrap:wrap}' +
      '#admin-dashboard .book-cover{width:40px;height:56px;border-radius:6px;object-fit:cover;background:var(--bg-tertiary);border:1px solid var(--border-color)}' +
      '#admin-dashboard .user-avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;background:var(--bg-tertiary);border:1px solid var(--border-color)}' +
      '#admin-dashboard .mobile-toggle{display:none;position:fixed;bottom:20px;right:20px;z-index:1000;background:var(--accent);color:#fff;width:52px;height:52px;border-radius:50%;border:none;font-size:20px;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3)}' +
      '#admin-dashboard .sidebar-close{display:none;position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;color:var(--text-secondary);cursor:pointer;padding:4px}' +
      '#admin-dashboard .backdrop{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:99}' +
      '@media(max-width:900px){#admin-dashboard{flex-direction:column}#admin-dashboard .admin-sidebar{position:fixed;top:0;left:0;width:280px;height:100vh;z-index:200;transform:translateX(-100%);transition:transform .3s}#admin-dashboard .admin-sidebar.open{transform:translateX(0)}#admin-dashboard .sidebar-close{display:block}#admin-dashboard .admin-content{padding:20px 16px;padding-bottom:80px}#admin-dashboard .mobile-toggle{display:flex;align-items:center;justify-content:center}#admin-dashboard .backdrop.show{display:block}#admin-dashboard .stat-cards{grid-template-columns:1fr 1fr}#admin-dashboard .form-row{grid-template-columns:1fr}#admin-dashboard .modal{margin:10px;padding:24px}#admin-dashboard table{font-size:13px}#admin-dashboard th,#admin-dashboard td{padding:10px 8px}#admin-dashboard .section-header h1{font-size:22px}#admin-dashboard .categories-grid{grid-template-columns:1fr 1fr}}' +
      '@media(max-width:500px){#admin-dashboard .stat-cards{grid-template-columns:1fr}#admin-dashboard .categories-grid{grid-template-columns:1fr}}' +
      '</style>';
  }
  /* ========== Sidebar ========== */
  function renderSidebar() {
    var unread = getUnreadCount();
    var items = [
      { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
      { id: 'books', icon: 'fa-book', label: 'Books' },
      { id: 'authors', icon: 'fa-pen-fancy', label: 'Authors' },
      { id: 'publishers', icon: 'fa-building', label: 'Publishers' },
      { id: 'categories', icon: 'fa-tags', label: 'Categories' },
      { id: 'notifications', icon: 'fa-bell', label: 'Notifications', badge: unread > 0 ? unread : null },
      { id: 'users', icon: 'fa-users', label: 'Users' },
      { id: 'borrow-records', icon: 'fa-hand-holding', label: 'Borrow Records' },
      { id: 'reservations', icon: 'fa-bookmark', label: 'Reservations' },
      { id: 'reports', icon: 'fa-chart-bar', label: 'Reports' },
      { id: 'settings', icon: 'fa-cog', label: 'Settings' }
    ];
    var nav = '';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      nav += '<div class="nav-item' + (state.activeSection === it.id ? ' active' : '') + '" data-section="' + it.id + '">' +
        '<i class="fa ' + it.icon + '"></i><span>' + it.label + '</span>' +
        (it.badge ? '<span class="nav-badge">' + it.badge + '</span>' : '') + '</div>';
    }
    nav += '<div class="nav-divider"></div>' +
      '<div class="nav-item" data-section="logout" style="color:#e53e3e"><i class="fa fa-right-from-bracket"></i><span>Logout</span></div>';
    return '<div class="admin-sidebar' + (state.sidebarOpen ? ' open' : '') + '">' +
      '<button class="sidebar-close" id="admin-sidebar-close"><i class="fa fa-times"></i></button>' +
      '<div class="sidebar-header"><h2><i class="fa fa-shield-halved" style="margin-right:8px;color:var(--accent)"></i>Admin Panel</h2><p>Manage your library</p></div>' +
      '<nav class="sidebar-nav">' + nav + '</nav></div>';
  }

  /* ========== Section: Dashboard ========== */
  function renderDashboard() {
    var books = getBooks(), authors = getAuthors(), publishers = getPublishers(), categories = getCategories();
    var users = getAllUsers(), notifications = getNotifications(), borrowRecords = getBorrowRecords(), reservations = getReservations();
    var activeBorrowed = borrowRecords.filter(function (r) { return r.status === 'active' || r.status === 'overdue'; }).length;
    var activeRes = reservations.filter(function (r) { return r.status === 'active' || r.status === 'pending'; }).length;
    var activeUsers = users.filter(function (u) { return u.lastLogin && (Date.now() - new Date(u.lastLogin).getTime()) < 86400000; }).length;

    var cards = [
      { label: 'Total Books', value: books.length, icon: 'fa-book', bg: '#dbeafe', color: '#1d4ed8' },
      { label: 'Total Authors', value: authors.length, icon: 'fa-pen-fancy', bg: '#ede9fe', color: '#7c3aed' },
      { label: 'Total Publishers', value: publishers.length, icon: 'fa-building', bg: '#fce7f3', color: '#be185d' },
      { label: 'Total Categories', value: categories.length, icon: 'fa-tags', bg: '#d1fae5', color: '#059669' },
      { label: 'Registered Users', value: users.length, icon: 'fa-users', bg: '#fef3c7', color: '#d97706' },
      { label: 'Active Users', value: activeUsers, icon: 'fa-user-check', bg: '#d1fae5', color: '#059669' },
      { label: 'Borrowed Books', value: activeBorrowed, icon: 'fa-hand-holding', bg: '#dbeafe', color: '#1d4ed8' },
      { label: 'Reserved Books', value: activeRes, icon: 'fa-bookmark', bg: '#ede9fe', color: '#7c3aed' },
      { label: 'Notifications', value: notifications.length, icon: 'fa-bell', bg: '#fef3c7', color: '#d97706' }
    ];
    var cardsHTML = '<div class="stat-cards">';
    for (var i = 0; i < cards.length; i++) {
      cardsHTML += '<div class="stat-card"><div class="stat-icon" style="background:' + cards[i].bg + ';color:' + cards[i].color + '"><i class="fa ' + cards[i].icon + '"></i></div><div class="stat-value" data-count="' + cards[i].value + '">0</div><div class="stat-label">' + cards[i].label + '</div></div>';
    }
    cardsHTML += '</div>';

    var qa = '<h3 style="margin:0 0 14px;font-size:18px;font-weight:600">Quick Actions</h3><div class="quick-actions">' +
      '<div class="quick-action-btn" data-nav="books"><i class="fa fa-plus"></i>Add Book</div>' +
      '<div class="quick-action-btn" data-nav="authors"><i class="fa fa-pen-fancy"></i>Add Author</div>' +
      '<div class="quick-action-btn" data-nav="borrow-records"><i class="fa fa-hand-holding"></i>New Borrow</div>' +
      '<div class="quick-action-btn" data-nav="reservations"><i class="fa fa-bookmark"></i>New Reservation</div>' +
      '<div class="quick-action-btn" data-nav="notifications"><i class="fa fa-bell"></i>Send Notif</div>' +
      '<div class="quick-action-btn" data-nav="reports"><i class="fa fa-chart-bar"></i>Reports</div></div>';

    var activities = [];
    books.slice(-5).reverse().forEach(function (b) { activities.push({ text: 'Book "' + (b.title || '') + '" added', time: b.createdAt, color: '#1d4ed8' }); });
    borrowRecords.slice(-5).reverse().forEach(function (r) { activities.push({ text: 'Borrow: "' + (r.bookTitle || r.bookName || '') + '"', time: r.createdAt || r.borrowDate, color: '#059669' }); });
    users.slice(-3).reverse().forEach(function (u) { activities.push({ text: 'User "' + (u.name || u.username || '') + '" registered', time: u.joined || u.createdAt, color: '#d97706' }); });
    activities.sort(function (a, b) { return new Date(b.time) - new Date(a.time); });
    activities = activities.slice(0, 8);
    var actHTML = activities.length === 0 ? '<div class="empty-state"><i class="fa fa-clock-rotate-left"></i><p>No recent activity</p></div>' : '';
    for (var a = 0; a < activities.length; a++) {
      actHTML += '<div class="activity-item"><div class="activity-dot" style="background:' + activities[a].color + '"></div><div style="flex:1"><div>' + escapeHTML(activities[a].text) + '</div><div style="font-size:12px;color:var(--text-tertiary);margin-top:2px">' + timeAgo(activities[a].time) + '</div></div></div>';
    }

    var recentNotifs = notifications.slice(-5).reverse();
    var nHTML = recentNotifs.length === 0 ? '<div class="empty-state"><i class="fa fa-bell-slash"></i><p>No notifications</p></div>' : '';
    for (var n = 0; n < recentNotifs.length; n++) {
      var nf = recentNotifs[n];
      nHTML += '<div class="notif-item' + (!nf.read ? ' unread' : '') + '"><div class="notif-body"><div class="notif-title">' + escapeHTML(nf.title || '') + '</div><div class="notif-message">' + escapeHTML(nf.message || '') + '</div><div class="notif-time">' + timeAgo(nf.time || nf.timestamp || nf.date) + '</div></div></div>';
    }
    return cardsHTML + qa + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">' +
      '<div class="card"><h3><i class="fa fa-clock-rotate-left" style="margin-right:8px;color:var(--accent)"></i>Recent Activity</h3>' + actHTML + '</div>' +
      '<div class="card"><h3><i class="fa fa-bell" style="margin-right:8px;color:var(--accent)"></i>Latest Notifications</h3>' + nHTML + '</div></div>';
  }

  /* ========== Section: Books ========== */
  function renderBooks() {
    var books = getBooks(), categories = getCategories();
    var q = state.bookSearch.toLowerCase(), catF = state.bookFilterCategory, classF = state.bookFilterClass;
    var filtered = books;
    if (q) filtered = filtered.filter(function (b) { return (b.title || '').toLowerCase().indexOf(q) !== -1 || (b.author || '').toLowerCase().indexOf(q) !== -1 || (b.isbn || '').toLowerCase().indexOf(q) !== -1; });
    if (catF) filtered = filtered.filter(function (b) { return (b.category || '') === catF; });
    if (classF) filtered = filtered.filter(function (b) { return String(b.class || b.grade || '') === classF; });

    var catOpts = '<option value="">All Categories</option>';
    for (var c = 0; c < categories.length; c++) catOpts += '<option value="' + escapeHTML(categories[c].name) + '"' + (catF === categories[c].name ? ' selected' : '') + '>' + escapeHTML(categories[c].name) + '</option>';
    var clsOpts = '<option value="">All Classes</option>';
    for (var cl = 1; cl <= 12; cl++) clsOpts += '<option value="' + cl + '"' + (classF === String(cl) ? ' selected' : '') + '>Class ' + cl + '</option>';

    var tp = Math.ceil(filtered.length / state.booksPerPage) || 1;
    if (state.bookPage > tp) state.bookPage = tp;
    var pageBooks = filtered.slice((state.bookPage - 1) * state.booksPerPage, state.bookPage * state.booksPerPage);

    var hdr = '<div class="section-header"><div><h1>Books</h1><p>' + books.length + ' total books</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-book-btn"><i class="fa fa-plus"></i> Add Book</button></div></div>';
    var filterBar = '<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px"><div class="search-wrap"><i class="fa fa-search"></i><input type="text" id="admin-book-search" placeholder="Search books..." value="' + escapeHTML(state.bookSearch) + '"></div><select class="filter-select" id="admin-book-cat-filter">' + catOpts + '</select><select class="filter-select" id="admin-book-class-filter">' + clsOpts + '</select></div>';

    if (filtered.length === 0) return hdr + filterBar + '<div class="card"><div class="empty-state"><i class="fa fa-book-open"></i><p>' + (q || catF || classF ? 'No books match your filters' : 'No books yet. Add your first book!') + '</p></div></div>';

    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>Cover</th><th>Title</th><th>Author</th><th>Publisher</th><th>Category</th><th>Class</th><th>ISBN</th><th>Copies</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < pageBooks.length; i++) {
      var b = pageBooks[i];
      var cover = b.coverImage ? '<img class="book-cover" src="' + escapeHTML(b.coverImage) + '" alt="" onerror="this.style.display=\'none\'">' : '<div class="book-cover" style="display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);font-size:16px"><i class="fa fa-book"></i></div>';
      var avail = b.availableCopies !== undefined ? b.availableCopies : (b.copies !== undefined ? b.copies : '\u2014');
      var tot = b.totalCopies !== undefined ? b.totalCopies : '\u2014';
      tbl += '<tr><td>' + cover + '</td><td style="font-weight:600;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escapeHTML(b.title || '') + '</td><td>' + escapeHTML(b.author || '') + '</td><td>' + escapeHTML(b.publisher || '') + '</td><td>' + escapeHTML(b.category || b.subject || '') + '</td><td>' + escapeHTML(b.class || b.grade || '') + '</td><td style="font-size:12px">' + escapeHTML(b.isbn || '') + '</td><td>' + avail + ' / ' + tot + '</td><td style="white-space:nowrap"><button class="btn btn-outline btn-sm admin-edit-book" data-id="' + escapeHTML(b.id) + '" style="margin-right:4px"><i class="fa fa-pen"></i></button><button class="btn btn-danger btn-sm admin-delete-book" data-id="' + escapeHTML(b.id) + '" data-title="' + escapeHTML(b.title || '') + '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    tbl += '</tbody></table></div>';
    return hdr + filterBar + tbl + renderPagination(state.bookPage, tp, filtered.length, 'admin-book');
  }
  /* ========== Book Form ========== */
  function showBookForm(book) {
    var isEdit = !!book, b = book || {};
    var categories = getCategories(), catHTML = '<option value="">Select Category</option>';
    for (var c = 0; c < categories.length; c++) catHTML += '<option value="' + escapeHTML(categories[c].name) + '"' + (b.category === categories[c].name ? ' selected' : '') + '>' + escapeHTML(categories[c].name) + '</option>';
    var clsHTML = '<option value="">Select Class</option>';
    for (var cl = 1; cl <= 12; cl++) clsHTML += '<option value="' + cl + '"' + (String(b.class || '') === String(cl) ? ' selected' : '') + '>Class ' + cl + '</option>';

    var html = '<div class="modal-overlay" id="admin-book-modal"><div class="modal"><h2><i class="fa ' + (isEdit ? 'fa-pen' : 'fa-plus') + '" style="margin-right:8px;color:var(--accent)"></i>' + (isEdit ? 'Edit Book' : 'Add New Book') + '</h2>' +
      '<form id="admin-book-form">' +
      '<div class="form-group"><label>Book Cover (Image URL)</label><input type="url" name="coverImage" value="' + escapeHTML(b.coverImage || '') + '" placeholder="https://example.com/cover.jpg"></div>' +
      '<div class="form-row"><div class="form-group"><label>Book Name *</label><input type="text" name="title" value="' + escapeHTML(b.title || '') + '" required></div><div class="form-group"><label>Author *</label><input type="text" name="author" value="' + escapeHTML(b.author || '') + '" required></div></div>' +
      '<div class="form-row"><div class="form-group"><label>Publisher</label><input type="text" name="publisher" value="' + escapeHTML(b.publisher || '') + '"></div><div class="form-group"><label>Price</label><input type="number" step="0.01" name="price" value="' + escapeHTML(b.price || '') + '" placeholder="0.00"></div></div>' +
      '<div class="form-row"><div class="form-group"><label>ISBN</label><input type="text" name="isbn" value="' + escapeHTML(b.isbn || '') + '"></div><div class="form-group"><label>Category</label><select name="category">' + catHTML + '</select></div></div>' +
      '<div class="form-row"><div class="form-group"><label>Class</label><select name="class">' + clsHTML + '</select></div><div class="form-group"><label>Language</label><input type="text" name="language" value="' + escapeHTML(b.language || '') + '" placeholder="English"></div></div>' +
      '<div class="form-row"><div class="form-group"><label>Total Copies</label><input type="number" name="totalCopies" value="' + escapeHTML(String(b.totalCopies !== undefined ? b.totalCopies : 1)) + '" min="0"></div><div class="form-group"><label>Available Copies</label><input type="number" name="availableCopies" value="' + escapeHTML(String(b.availableCopies !== undefined ? b.availableCopies : 1)) + '" min="0"></div></div>' +
      '<div class="form-group"><label>PDF Upload (URL)</label><input type="url" name="pdfFile" value="' + escapeHTML(b.pdfFile || '') + '" placeholder="https://example.com/book.pdf"></div>' +
      '<div class="form-group"><label>Description</label><textarea name="description">' + escapeHTML(b.description || '') + '</textarea></div>' +
      '<div class="form-group"><label>Publish Date</label><input type="date" name="publishDate" value="' + escapeHTML((b.publishDate || '').substring(0, 10)) + '"></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-book-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ' + (isEdit ? 'Update' : 'Add') + ' Book</button></div></form></div></div>';

    var existing = document.getElementById('admin-book-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-book-modal');
    document.getElementById('admin-book-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-book-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(this), title = fd.get('title'), author = fd.get('author');
      if (!title || !author) { showToast('Title and Author are required', 'error'); return; }
      var books = getBooks();
      if (state.editingBookId) {
        for (var i = 0; i < books.length; i++) {
          if (books[i].id === state.editingBookId) {
            books[i].title = title; books[i].author = author; books[i].coverImage = fd.get('coverImage') || '';
            books[i].publisher = fd.get('publisher') || ''; books[i].price = fd.get('price') || '';
            books[i].isbn = fd.get('isbn') || ''; books[i].category = fd.get('category') || '';
            books[i].class = fd.get('class') || ''; books[i].language = fd.get('language') || '';
            books[i].totalCopies = parseInt(fd.get('totalCopies') || '1', 10);
            books[i].availableCopies = parseInt(fd.get('availableCopies') || '1', 10);
            books[i].pdfFile = fd.get('pdfFile') || ''; books[i].description = fd.get('description') || '';
            books[i].publishDate = fd.get('publishDate') || ''; books[i].updatedAt = new Date().toISOString();
            break;
          }
        }
        saveBooks(books); showToast('Book updated successfully', 'success');
      } else {
        books.push({ id: generateId(), title: title, author: author, coverImage: fd.get('coverImage') || '', publisher: fd.get('publisher') || '', price: fd.get('price') || '', isbn: fd.get('isbn') || '', category: fd.get('category') || '', class: fd.get('class') || '', language: fd.get('language') || '', totalCopies: parseInt(fd.get('totalCopies') || '1', 10), availableCopies: parseInt(fd.get('availableCopies') || '1', 10), pdfFile: fd.get('pdfFile') || '', description: fd.get('description') || '', publishDate: fd.get('publishDate') || '', downloads: 0, createdAt: new Date().toISOString() });
        saveBooks(books);
        if (typeof Notifications !== 'undefined' && Notifications.add) Notifications.add('book_add', 'New Book', title + ' was added.');
        showToast('Book added successfully', 'success');
      }
      modal.remove(); renderContent(); updateSidebarActive();
    });
  }

  /* ========== Section: Authors ========== */
  function renderAuthors() {
    var authors = getAuthors(), books = getBooks(), q = state.authorSearch.toLowerCase();
    var filtered = q ? authors.filter(function (a) { return (a.name || '').toLowerCase().indexOf(q) !== -1 || (a.country || '').toLowerCase().indexOf(q) !== -1; }) : authors;
    var hdr = '<div class="section-header"><div><h1>Authors</h1><p>' + authors.length + ' total authors</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-author-btn"><i class="fa fa-plus"></i> Add Author</button></div></div>';
    var search = '<div style="display:flex;gap:12px;margin-bottom:20px"><div class="search-wrap" style="max-width:400px"><i class="fa fa-search"></i><input type="text" id="admin-author-search" placeholder="Search authors..." value="' + escapeHTML(state.authorSearch) + '"></div></div>';
    if (filtered.length === 0) return hdr + search + '<div class="card"><div class="empty-state"><i class="fa fa-pen-fancy"></i><p>' + (q ? 'No authors match your search' : 'No authors yet') + '</p></div></div>';
    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>Photo</th><th>Name</th><th>Country</th><th>Books</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var a = filtered[i], cnt = books.filter(function (b) { return (b.author || '').toLowerCase() === (a.name || '').toLowerCase(); }).length;
      var photo = a.photo ? '<img class="user-avatar" src="' + escapeHTML(a.photo) + '" onerror="this.style.display=\'none\'">' : '<div class="user-avatar" style="display:flex;align-items:center;justify-content:center;color:var(--text-tertiary)"><i class="fa fa-user"></i></div>';
      tbl += '<tr><td>' + photo + '</td><td style="font-weight:600">' + escapeHTML(a.name || '') + '</td><td>' + escapeHTML(a.country || '') + '</td><td>' + cnt + '</td><td style="white-space:nowrap"><button class="btn btn-outline btn-sm admin-edit-author" data-id="' + escapeHTML(a.id) + '" style="margin-right:4px"><i class="fa fa-pen"></i></button><button class="btn btn-danger btn-sm admin-delete-author" data-id="' + escapeHTML(a.id) + '" data-name="' + escapeHTML(a.name || '') + '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    return hdr + search + tbl + '</tbody></table></div>';
  }

  function showAuthorForm(author) {
    var isEdit = !!author, a = author || {};
    var html = '<div class="modal-overlay" id="admin-author-modal"><div class="modal" style="max-width:550px"><h2><i class="fa ' + (isEdit ? 'fa-pen' : 'fa-plus') + '" style="margin-right:8px;color:var(--accent)"></i>' + (isEdit ? 'Edit Author' : 'Add New Author') + '</h2>' +
      '<form id="admin-author-form"><div class="form-group"><label>Name *</label><input type="text" name="name" value="' + escapeHTML(a.name || '') + '" required></div>' +
      '<div class="form-group"><label>Photo URL</label><input type="url" name="photo" value="' + escapeHTML(a.photo || '') + '" placeholder="https://example.com/photo.jpg"></div>' +
      '<div class="form-group"><label>Biography</label><textarea name="biography">' + escapeHTML(a.biography || '') + '</textarea></div>' +
      '<div class="form-group"><label>Country</label><input type="text" name="country" value="' + escapeHTML(a.country || '') + '" placeholder="e.g. Nepal"></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-author-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ' + (isEdit ? 'Update' : 'Add') + '</button></div></form></div></div>';
    var existing = document.getElementById('admin-author-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-author-modal');
    document.getElementById('admin-author-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-author-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), name = fd.get('name');
      if (!name) { showToast('Author name is required', 'error'); return; }
      var authors = getAuthors();
      if (state.editingAuthorId) {
        for (var i = 0; i < authors.length; i++) { if (authors[i].id === state.editingAuthorId) { authors[i].name = name; authors[i].photo = fd.get('photo') || ''; authors[i].biography = fd.get('biography') || ''; authors[i].country = fd.get('country') || ''; authors[i].updatedAt = new Date().toISOString(); break; } }
        saveAuthors(authors); showToast('Author updated', 'success');
      } else {
        authors.push({ id: generateId(), name: name, photo: fd.get('photo') || '', biography: fd.get('biography') || '', country: fd.get('country') || '', createdAt: new Date().toISOString() });
        saveAuthors(authors); showToast('Author added', 'success');
      }
      modal.remove(); renderContent();
    });
  }
  /* ========== Section: Publishers ========== */
  function renderPublishers() {
    var pubs = getPublishers(), q = state.publisherSearch.toLowerCase();
    var filtered = q ? pubs.filter(function (p) { return (p.name || '').toLowerCase().indexOf(q) !== -1 || (p.email || '').toLowerCase().indexOf(q) !== -1; }) : pubs;
    var hdr = '<div class="section-header"><div><h1>Publishers</h1><p>' + pubs.length + ' total publishers</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-publisher-btn"><i class="fa fa-plus"></i> Add Publisher</button></div></div>';
    var search = '<div style="display:flex;gap:12px;margin-bottom:20px"><div class="search-wrap" style="max-width:400px"><i class="fa fa-search"></i><input type="text" id="admin-publisher-search" placeholder="Search publishers..." value="' + escapeHTML(state.publisherSearch) + '"></div></div>';
    if (filtered.length === 0) return hdr + search + '<div class="card"><div class="empty-state"><i class="fa fa-building"></i><p>' + (q ? 'No publishers match your search' : 'No publishers yet') + '</p></div></div>';
    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>Name</th><th>Address</th><th>Contact</th><th>Email</th><th>Website</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var p = filtered[i];
      tbl += '<tr><td style="font-weight:600">' + escapeHTML(p.name || '') + '</td><td>' + escapeHTML(p.address || '') + '</td><td>' + escapeHTML(p.contact || p.phone || '') + '</td><td>' + escapeHTML(p.email || '') + '</td><td>' + escapeHTML(p.website || '') + '</td><td style="white-space:nowrap"><button class="btn btn-outline btn-sm admin-edit-publisher" data-id="' + escapeHTML(p.id) + '" style="margin-right:4px"><i class="fa fa-pen"></i></button><button class="btn btn-danger btn-sm admin-delete-publisher" data-id="' + escapeHTML(p.id) + '" data-name="' + escapeHTML(p.name || '') + '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    return hdr + search + tbl + '</tbody></table></div>';
  }

  function showPublisherForm(pub) {
    var isEdit = !!pub, p = pub || {};
    var html = '<div class="modal-overlay" id="admin-publisher-modal"><div class="modal" style="max-width:550px"><h2><i class="fa ' + (isEdit ? 'fa-pen' : 'fa-plus') + '" style="margin-right:8px;color:var(--accent)"></i>' + (isEdit ? 'Edit Publisher' : 'Add New Publisher') + '</h2>' +
      '<form id="admin-publisher-form"><div class="form-group"><label>Publisher Name *</label><input type="text" name="name" value="' + escapeHTML(p.name || '') + '" required></div>' +
      '<div class="form-group"><label>Address</label><input type="text" name="address" value="' + escapeHTML(p.address || '') + '"></div>' +
      '<div class="form-row"><div class="form-group"><label>Contact</label><input type="text" name="contact" value="' + escapeHTML(p.contact || p.phone || '') + '"></div><div class="form-group"><label>Email</label><input type="email" name="email" value="' + escapeHTML(p.email || '') + '"></div></div>' +
      '<div class="form-group"><label>Website</label><input type="url" name="website" value="' + escapeHTML(p.website || '') + '" placeholder="https://example.com"></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-publisher-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ' + (isEdit ? 'Update' : 'Add') + '</button></div></form></div></div>';
    var existing = document.getElementById('admin-publisher-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-publisher-modal');
    document.getElementById('admin-publisher-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-publisher-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), name = fd.get('name');
      if (!name) { showToast('Publisher name is required', 'error'); return; }
      var pubs = getPublishers();
      if (state.editingPublisherId) {
        for (var i = 0; i < pubs.length; i++) { if (pubs[i].id === state.editingPublisherId) { pubs[i].name = name; pubs[i].address = fd.get('address') || ''; pubs[i].contact = fd.get('contact') || ''; pubs[i].email = fd.get('email') || ''; pubs[i].website = fd.get('website') || ''; pubs[i].updatedAt = new Date().toISOString(); break; } }
        savePublishers(pubs); showToast('Publisher updated', 'success');
      } else {
        pubs.push({ id: generateId(), name: name, address: fd.get('address') || '', contact: fd.get('contact') || '', email: fd.get('email') || '', website: fd.get('website') || '', createdAt: new Date().toISOString() });
        savePublishers(pubs); showToast('Publisher added', 'success');
      }
      modal.remove(); renderContent();
    });
  }

  /* ========== Section: Categories ========== */
  function renderCategories() {
    var cats = getCategories(), books = getBooks();
    var hdr = '<div class="section-header"><div><h1>Categories</h1><p>' + cats.length + ' categories</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-category-btn"><i class="fa fa-plus"></i> Add Category</button></div></div>';
    if (cats.length === 0) return hdr + '<div class="card"><div class="empty-state"><i class="fa fa-tags"></i><p>No categories yet. Create your first category!</p></div></div>';
    var grid = '<div class="categories-grid">';
    for (var i = 0; i < cats.length; i++) {
      var cat = cats[i], bc = books.filter(function (b) { return (b.category || b.subject || '') === cat.name; }).length;
      grid += '<div class="category-card"><div class="cat-actions"><button class="btn btn-outline btn-xs admin-edit-category" data-id="' + escapeHTML(cat.id) + '" title="Edit"><i class="fa fa-pen"></i></button><button class="btn btn-danger btn-xs admin-delete-category" data-id="' + escapeHTML(cat.id) + '" data-name="' + escapeHTML(cat.name || '') + '" title="Delete"><i class="fa fa-trash"></i></button></div><div class="cat-icon">' + (cat.icon || '\uD83D\uDCDA') + '</div><div class="cat-name">' + escapeHTML(cat.name || '') + '</div><div class="cat-desc">' + escapeHTML(cat.description || '') + '</div><div class="cat-count">' + bc + ' book' + (bc !== 1 ? 's' : '') + '</div></div>';
    }
    return hdr + grid + '</div>';
  }

  function showCategoryForm(cat) {
    var isEdit = !!cat, c = cat || {};
    var icons = ['\uD83D\uDCDA','\uD83D\uDCD6','\uD83C\uDF93','\uD83D\uDD2C','\uD83D\uDCD0','\uD83C\uDF0D','\uD83C\uDFA8','\uD83D\uDCA1','\uD83D\uDD22','\uD83D\uDCDD','\uD83E\uDDEB','\uD83C\uDFDB\uFE0F','\uD83C\uDFB5','\uD83D\uDCBB','\u2728'];
    var iconPicker = '';
    for (var i = 0; i < icons.length; i++) iconPicker += '<span class="cat-icon-opt" data-icon="' + icons[i] + '" style="font-size:24px;cursor:pointer;padding:6px;border:2px solid ' + ((c.icon || '\uD83D\uDCDA') === icons[i] ? 'var(--accent)' : 'transparent') + ';border-radius:8px;display:inline-block">' + icons[i] + '</span> ';
    var html = '<div class="modal-overlay" id="admin-category-modal"><div class="modal" style="max-width:500px"><h2><i class="fa ' + (isEdit ? 'fa-pen' : 'fa-plus') + '" style="margin-right:8px;color:var(--accent)"></i>' + (isEdit ? 'Edit Category' : 'Add Category') + '</h2>' +
      '<form id="admin-category-form"><div class="form-group"><label>Name *</label><input type="text" name="name" value="' + escapeHTML(c.name || '') + '" required></div>' +
      '<div class="form-group"><label>Icon/Emoji</label><div id="cat-icon-picker">' + iconPicker + '</div><input type="hidden" name="icon" id="cat-icon-input" value="' + escapeHTML(c.icon || '\uD83D\uDCDA') + '"></div>' +
      '<div class="form-group"><label>Description</label><textarea name="description">' + escapeHTML(c.description || '') + '</textarea></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-category-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ' + (isEdit ? 'Update' : 'Add') + '</button></div></form></div></div>';
    var existing = document.getElementById('admin-category-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-category-modal');
    document.getElementById('admin-category-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    var picker = document.getElementById('cat-icon-picker'), iconInput = document.getElementById('cat-icon-input');
    var opts = picker.querySelectorAll('.cat-icon-opt');
    for (var j = 0; j < opts.length; j++) {
      opts[j].addEventListener('click', function () {
        var all = picker.querySelectorAll('.cat-icon-opt'); for (var k = 0; k < all.length; k++) all[k].style.borderColor = 'transparent';
        this.style.borderColor = 'var(--accent)'; iconInput.value = this.getAttribute('data-icon');
      });
    }
    document.getElementById('admin-category-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), name = fd.get('name');
      if (!name) { showToast('Category name is required', 'error'); return; }
      var cats = getCategories();
      if (state.editingCategoryId) {
        for (var i = 0; i < cats.length; i++) { if (cats[i].id === state.editingCategoryId) { cats[i].name = name; cats[i].icon = fd.get('icon') || '\uD83D\uDCDA'; cats[i].description = fd.get('description') || ''; break; } }
        saveCategories(cats); showToast('Category updated', 'success');
      } else {
        cats.push({ id: generateId(), name: name, icon: fd.get('icon') || '\uD83D\uDCDA', description: fd.get('description') || '', createdAt: new Date().toISOString() });
        saveCategories(cats); showToast('Category added', 'success');
      }
      modal.remove(); renderContent();
    });
  }
  /* ========== Section: Notifications ========== */
  function renderNotificationsSection() {
    var all = getNotifications(), filter = state.notificationFilter, filtered = all;
    if (filter === 'unread') filtered = all.filter(function (n) { return !n.read; });
    else if (filter === 'today') { var ts = new Date(); ts.setHours(0,0,0,0); filtered = all.filter(function (n) { return new Date(n.time || n.timestamp || n.date).getTime() >= ts.getTime(); }); }
    var hdr = '<div class="section-header"><div><h1>Notifications</h1><p>' + getUnreadCount() + ' unread of ' + all.length + '</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-create-notif-btn"><i class="fa fa-plus"></i> New</button><button class="btn btn-outline btn-sm" id="admin-mark-all-read"><i class="fa fa-check-double"></i> Mark All Read</button><button class="btn btn-danger btn-sm" id="admin-clear-all-notifs"><i class="fa fa-trash"></i> Clear All</button></div></div>';
    var tabs = '<div class="filter-tabs"><div class="filter-tab' + (filter === 'all' ? ' active' : '') + '" data-filter="notifs_all">All (' + all.length + ')</div><div class="filter-tab' + (filter === 'unread' ? ' active' : '') + '" data-filter="notifs_unread">Unread (' + all.filter(function (n) { return !n.read; }).length + ')</div><div class="filter-tab' + (filter === 'today' ? ' active' : '') + '" data-filter="notifs_today">Today</div></div>';
    if (filtered.length === 0) return hdr + tabs + '<div class="card"><div class="empty-state"><i class="fa fa-bell-slash"></i><p>No notifications</p></div></div>';
    var list = '<div class="card">';
    for (var i = filtered.length - 1; i >= 0; i--) {
      var n = filtered[i], typeIcon = n.type === 'success' ? 'fa-circle-check' : n.type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info';
      list += '<div class="notif-item' + (!n.read ? ' unread' : '') + '" data-notif-id="' + escapeHTML(n.id || '') + '"><div class="notif-icon" style="background:' + (n.read ? 'var(--bg-tertiary)' : 'var(--accent-bg)') + ';color:' + (n.read ? 'var(--text-secondary)' : 'var(--accent)') + '"><i class="fa ' + typeIcon + '"></i></div><div class="notif-body"><div class="notif-title">' + escapeHTML(n.title || '') + '</div><div class="notif-message">' + escapeHTML(n.message || '') + '</div><div class="notif-time">' + timeAgo(n.time || n.timestamp || n.date) + '</div></div><button class="btn btn-outline btn-xs admin-delete-notif" data-id="' + escapeHTML(n.id || '') + '" title="Delete"><i class="fa fa-trash"></i></button></div>';
    }
    return hdr + tabs + list + '</div>';
  }

  function showNotificationForm() {
    var html = '<div class="modal-overlay" id="admin-notif-modal"><div class="modal" style="max-width:500px"><h2><i class="fa fa-bell" style="margin-right:8px;color:var(--accent)"></i>Create Notification</h2>' +
      '<form id="admin-notif-form"><div class="form-group"><label>Title *</label><input type="text" name="title" required></div><div class="form-group"><label>Message *</label><textarea name="message" required></textarea></div>' +
      '<div class="form-row"><div class="form-group"><label>Type</label><select name="type"><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option></select></div><div class="form-group"><label>Target</label><select name="target"><option value="all">All Users</option><option value="users">Registered Users</option></select></div></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-notif-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Create</button></div></form></div></div>';
    var existing = document.getElementById('admin-notif-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-notif-modal');
    document.getElementById('admin-notif-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-notif-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), title = fd.get('title'), message = fd.get('message');
      if (!title || !message) { showToast('Title and Message are required', 'error'); return; }
      if (typeof Notifications !== 'undefined' && Notifications.add) { Notifications.add(fd.get('type') || 'info', title, message); }
      else { var notifs = getNotifications(); notifs.push({ id: generateId(), title: title, message: message, type: fd.get('type') || 'info', target: fd.get('target') || 'all', read: false, time: new Date().toISOString() }); saveNotifications(notifs); }
      showToast('Notification created', 'success'); modal.remove(); renderContent(); updateSidebarActive();
    });
  }

  /* ========== Section: Users ========== */
  function renderUsersSection() {
    var users = getAllUsers(), q = state.userSearch.toLowerCase();
    var filtered = q ? users.filter(function (u) { return (u.name || '').toLowerCase().indexOf(q) !== -1 || (u.email || '').toLowerCase().indexOf(q) !== -1 || (u.username || '').toLowerCase().indexOf(q) !== -1 || (u.phone || '').toLowerCase().indexOf(q) !== -1; }) : users;
    var totalAdmins = users.filter(function (u) { return (u.role || '').toLowerCase() === 'admin'; }).length;
    var activeToday = users.filter(function (u) { return u.lastLogin && (Date.now() - new Date(u.lastLogin).getTime()) < 86400000; }).length;
    var hdr = '<div class="section-header"><div><h1>Users</h1><p>' + users.length + ' total users</p></div></div>';
    var stats = '<div class="stat-cards"><div class="stat-card"><div class="stat-icon" style="background:#dbeafe;color:#1d4ed8"><i class="fa fa-users"></i></div><div class="stat-value">' + users.length + '</div><div class="stat-label">Total Users</div></div><div class="stat-card"><div class="stat-icon" style="background:#fef3c7;color:#d97706"><i class="fa fa-user-shield"></i></div><div class="stat-value">' + totalAdmins + '</div><div class="stat-label">Admins</div></div><div class="stat-card"><div class="stat-icon" style="background:#d1fae5;color:#059669"><i class="fa fa-user"></i></div><div class="stat-value">' + (users.length - totalAdmins) + '</div><div class="stat-label">Regular Users</div></div><div class="stat-card"><div class="stat-icon" style="background:#ede9fe;color:#7c3aed"><i class="fa fa-user-check"></i></div><div class="stat-value">' + activeToday + '</div><div class="stat-label">Active Today</div></div></div>';
    var search = '<div style="display:flex;gap:12px;margin-bottom:20px"><div class="search-wrap" style="max-width:400px"><i class="fa fa-search"></i><input type="text" id="admin-user-search" placeholder="Search users..." value="' + escapeHTML(state.userSearch) + '"></div></div>';
    if (filtered.length === 0) return hdr + stats + search + '<div class="card"><div class="empty-state"><i class="fa fa-user-slash"></i><p>' + (q ? 'No users match your search' : 'No users found') + '</p></div></div>';
    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>Photo</th><th>Name</th><th>Username</th><th>Email</th><th>Phone</th><th>Joined</th><th>Last Login</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < filtered.length; i++) {
      var u = filtered[i], role = (u.role || 'user').toLowerCase(), roleClass = role === 'admin' ? 'role-admin' : 'role-user';
      var avatar = (u.photo || u.avatar) ? '<img class="user-avatar" src="' + escapeHTML(u.photo || u.avatar) + '" onerror="this.style.display=\'none\'">' : '<div class="user-avatar" style="display:flex;align-items:center;justify-content:center;color:var(--text-tertiary);font-size:14px"><i class="fa fa-user"></i></div>';
      var status = u.suspended ? '<span class="role-badge" style="background:#fee2e2;color:#991b1b">Suspended</span>' : '<span class="role-badge badge-success">Active</span>';
      var toggleLabel = u.suspended ? '<i class="fa fa-check"></i>' : '<i class="fa fa-ban"></i>';
      var deleteBtn = role === 'admin' ? '<button class="btn btn-outline btn-sm" disabled title="Cannot delete admin"><i class="fa fa-lock"></i></button>' : '<button class="btn btn-danger btn-sm admin-delete-user" data-id="' + escapeHTML(u.id || u.username || '') + '" data-name="' + escapeHTML(u.name || u.username || '') + '"><i class="fa fa-trash"></i></button>';
      tbl += '<tr><td>' + avatar + '</td><td style="font-weight:600">' + escapeHTML(u.name || u.username || '') + '</td><td>' + escapeHTML(u.username || '') + '</td><td>' + escapeHTML(u.email || '') + '</td><td>' + escapeHTML(u.phone || '') + '</td><td>' + fmtDate(u.joined || u.createdAt) + '</td><td>' + timeAgo(u.lastLogin) + '</td><td>' + status + '</td><td style="white-space:nowrap"><button class="btn btn-outline btn-sm admin-toggle-user" data-id="' + escapeHTML(u.id || u.username || '') + '" style="margin-right:4px" title="' + (u.suspended ? 'Activate' : 'Suspend') + '">' + toggleLabel + '</button>' + deleteBtn + '</td></tr>';
    }
    return hdr + stats + search + tbl + '</tbody></table></div>';
  }
  /* ========== Section: Borrow Records ========== */
  function renderBorrowRecords() {
    var records = getBorrowRecords(), filter = state.borrowFilter;
    var filtered = filter === 'all' ? records : records.filter(function (r) { return r.status === filter; });
    var tp = Math.ceil(filtered.length / state.borrowsPerPage) || 1;
    if (state.borrowPage > tp) state.borrowPage = tp;
    var pageRecords = filtered.slice((state.borrowPage - 1) * state.borrowsPerPage, state.borrowPage * state.borrowsPerPage);
    var hdr = '<div class="section-header"><div><h1>Borrow Records</h1><p>' + records.length + ' total records</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-borrow-btn"><i class="fa fa-plus"></i> New Borrow</button></div></div>';
    var tabs = '<div class="filter-tabs"><div class="filter-tab' + (filter === 'all' ? ' active' : '') + '" data-filter="borrow_all">All (' + records.length + ')</div><div class="filter-tab' + (filter === 'active' ? ' active' : '') + '" data-filter="borrow_active">Active (' + records.filter(function (r) { return r.status === 'active'; }).length + ')</div><div class="filter-tab' + (filter === 'overdue' ? ' active' : '') + '" data-filter="borrow_overdue">Overdue (' + records.filter(function (r) { return r.status === 'overdue'; }).length + ')</div><div class="filter-tab' + (filter === 'returned' ? ' active' : '') + '" data-filter="borrow_returned">Returned (' + records.filter(function (r) { return r.status === 'returned'; }).length + ')</div></div>';
    if (filtered.length === 0) return hdr + tabs + '<div class="card"><div class="empty-state"><i class="fa fa-hand-holding"></i><p>No borrow records found</p></div></div>';
    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>User</th><th>Book</th><th>Borrow Date</th><th>Due Date</th><th>Return Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < pageRecords.length; i++) {
      var r = pageRecords[i];
      var badge = r.status === 'active' ? '<span class="role-badge badge-success">Active</span>' : r.status === 'overdue' ? '<span class="role-badge badge-danger">Overdue</span>' : '<span class="role-badge badge-secondary">Returned</span>';
      var retBtn = r.status !== 'returned' ? '<button class="btn btn-success btn-sm admin-return-borrow" data-id="' + escapeHTML(r.id) + '" title="Mark Returned"><i class="fa fa-check"></i></button> ' : '';
      tbl += '<tr><td>' + escapeHTML(r.userName || r.user || '') + '</td><td>' + escapeHTML(r.bookTitle || r.bookName || r.book || '') + '</td><td>' + fmtDate(r.borrowDate) + '</td><td>' + fmtDate(r.dueDate) + '</td><td>' + fmtDate(r.returnDate) + '</td><td>' + badge + '</td><td style="white-space:nowrap">' + retBtn + '<button class="btn btn-outline btn-sm admin-edit-borrow" data-id="' + escapeHTML(r.id) + '"><i class="fa fa-pen"></i></button> <button class="btn btn-danger btn-sm admin-delete-borrow" data-id="' + escapeHTML(r.id) + '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    return hdr + tabs + tbl + '</tbody></table></div>' + renderPagination(state.borrowPage, tp, filtered.length, 'admin-borrow');
  }

  function showBorrowForm(record) {
    var isEdit = !!record, r = record || {}, users = getAllUsers(), books = getBooks();
    var userOpts = '<option value="">Select User</option>';
    for (var i = 0; i < users.length; i++) { var un = users[i].name || users[i].username || ''; userOpts += '<option value="' + escapeHTML(un) + '"' + ((r.userName || r.user || '') === un ? ' selected' : '') + '>' + escapeHTML(un) + '</option>'; }
    var bookOpts = '<option value="">Select Book</option>';
    for (var j = 0; j < books.length; j++) bookOpts += '<option value="' + escapeHTML(books[j].id || '') + '"' + ((r.bookId || '') === (books[j].id || '') ? ' selected' : '') + '>' + escapeHTML(books[j].title || '') + '</option>';
    var html = '<div class="modal-overlay" id="admin-borrow-modal"><div class="modal" style="max-width:550px"><h2><i class="fa ' + (isEdit ? 'fa-pen' : 'fa-plus') + '" style="margin-right:8px;color:var(--accent)"></i>' + (isEdit ? 'Edit Borrow Record' : 'New Borrow Record') + '</h2>' +
      '<form id="admin-borrow-form"><div class="form-group"><label>User *</label><select name="user" required>' + userOpts + '</select></div><div class="form-group"><label>Book *</label><select name="bookId" required>' + bookOpts + '</select></div>' +
      '<div class="form-row"><div class="form-group"><label>Borrow Date</label><input type="date" name="borrowDate" value="' + escapeHTML((r.borrowDate || new Date().toISOString()).substring(0, 10)) + '"></div><div class="form-group"><label>Due Date</label><input type="date" name="dueDate" value="' + escapeHTML((r.dueDate || '').substring(0, 10)) + '"></div></div>' +
      '<div class="form-group"><label>Status</label><select name="status"><option value="active"' + (r.status === 'active' ? ' selected' : '') + '>Active</option><option value="overdue"' + (r.status === 'overdue' ? ' selected' : '') + '>Overdue</option><option value="returned"' + (r.status === 'returned' ? ' selected' : '') + '>Returned</option></select></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-borrow-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> ' + (isEdit ? 'Update' : 'Create') + '</button></div></form></div></div>';
    var existing = document.getElementById('admin-borrow-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-borrow-modal');
    document.getElementById('admin-borrow-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-borrow-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), user = fd.get('user'), bookId = fd.get('bookId');
      if (!user || !bookId) { showToast('User and Book are required', 'error'); return; }
      var book = books.filter(function (b) { return b.id === bookId; })[0];
      var records = getBorrowRecords();
      if (isEdit) {
        for (var i = 0; i < records.length; i++) {
          if (records[i].id === r.id) { records[i].userName = user; records[i].user = user; records[i].bookId = bookId; records[i].bookTitle = book ? book.title : ''; records[i].borrowDate = fd.get('borrowDate') || ''; records[i].dueDate = fd.get('dueDate') || ''; records[i].status = fd.get('status') || 'active'; if (records[i].status === 'returned' && !records[i].returnDate) records[i].returnDate = new Date().toISOString(); break; }
        }
        saveBorrowRecords(records); showToast('Record updated', 'success');
      } else {
        records.push({ id: generateId(), userName: user, user: user, bookId: bookId, bookTitle: book ? book.title : '', book: book ? book.title : '', borrowDate: fd.get('borrowDate') || new Date().toISOString().substring(0, 10), dueDate: fd.get('dueDate') || '', returnDate: '', status: fd.get('status') || 'active', createdAt: new Date().toISOString() });
        saveBorrowRecords(records); showToast('Borrow record created', 'success');
      }
      modal.remove(); renderContent();
    });
  }

  /* ========== Section: Reservations ========== */
  function renderReservations() {
    var reservations = getReservations(), filter = state.reservationFilter;
    var filtered = filter === 'all' ? reservations : reservations.filter(function (r) { return r.status === filter; });
    var tp = Math.ceil(filtered.length / state.reservationsPerPage) || 1;
    if (state.reservationPage > tp) state.reservationPage = tp;
    var pageRes = filtered.slice((state.reservationPage - 1) * state.reservationsPerPage, state.reservationPage * state.reservationsPerPage);
    var hdr = '<div class="section-header"><div><h1>Reservations</h1><p>' + reservations.length + ' total reservations</p></div><div class="section-actions"><button class="btn btn-primary" id="admin-add-reservation-btn"><i class="fa fa-plus"></i> New Reservation</button></div></div>';
    var tabs = '<div class="filter-tabs"><div class="filter-tab' + (filter === 'all' ? ' active' : '') + '" data-filter="res_all">All</div><div class="filter-tab' + (filter === 'pending' ? ' active' : '') + '" data-filter="res_pending">Pending</div><div class="filter-tab' + (filter === 'active' ? ' active' : '') + '" data-filter="res_active">Active</div><div class="filter-tab' + (filter === 'confirmed' ? ' active' : '') + '" data-filter="res_confirmed">Confirmed</div><div class="filter-tab' + (filter === 'cancelled' ? ' active' : '') + '" data-filter="res_cancelled">Cancelled</div><div class="filter-tab' + (filter === 'expired' ? ' active' : '') + '" data-filter="res_expired">Expired</div></div>';
    if (filtered.length === 0) return hdr + tabs + '<div class="card"><div class="empty-state"><i class="fa fa-bookmark"></i><p>No reservations found</p></div></div>';
    var tbl = '<div class="card" style="overflow-x:auto"><table><thead><tr><th>User</th><th>Book</th><th>Reserved Date</th><th>Expiry</th><th>Status</th><th>Payment</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < pageRes.length; i++) {
      var r = pageRes[i];
      var badge = r.status === 'confirmed' ? '<span class="role-badge badge-success">Confirmed</span>' : r.status === 'cancelled' ? '<span class="role-badge badge-danger">Cancelled</span>' : r.status === 'expired' ? '<span class="role-badge badge-secondary">Expired</span>' : '<span class="role-badge badge-warning">' + escapeHTML(r.status || 'pending') + '</span>';
      var actions = (r.status === 'pending' || r.status === 'active') ? '<button class="btn btn-success btn-xs admin-confirm-res" data-id="' + escapeHTML(r.id) + '" title="Confirm"><i class="fa fa-check"></i></button> <button class="btn btn-warning btn-xs admin-cancel-res" data-id="' + escapeHTML(r.id) + '" title="Cancel"><i class="fa fa-times"></i></button> ' : '';
      tbl += '<tr><td>' + escapeHTML(r.userName || r.user || '') + '</td><td>' + escapeHTML(r.bookTitle || r.bookName || r.book || '') + '</td><td>' + fmtDate(r.reservedDate || r.createdAt) + '</td><td>' + fmtDate(r.expiry) + '</td><td>' + badge + '</td><td>' + escapeHTML(r.payment || 'Free') + '</td><td style="white-space:nowrap">' + actions + '<button class="btn btn-danger btn-xs admin-delete-res" data-id="' + escapeHTML(r.id) + '"><i class="fa fa-trash"></i></button></td></tr>';
    }
    return hdr + tabs + tbl + '</tbody></table></div>' + renderPagination(state.reservationPage, tp, filtered.length, 'admin-res');
  }

  function showReservationForm() {
    var users = getAllUsers(), books = getBooks();
    var userOpts = '<option value="">Select User</option>';
    for (var i = 0; i < users.length; i++) { var un = users[i].name || users[i].username || ''; userOpts += '<option value="' + escapeHTML(un) + '">' + escapeHTML(un) + '</option>'; }
    var bookOpts = '<option value="">Select Book</option>';
    for (var j = 0; j < books.length; j++) bookOpts += '<option value="' + escapeHTML(books[j].id || '') + '">' + escapeHTML(books[j].title || '') + '</option>';
    var html = '<div class="modal-overlay" id="admin-reservation-modal"><div class="modal" style="max-width:550px"><h2><i class="fa fa-bookmark" style="margin-right:8px;color:var(--accent)"></i>New Reservation</h2>' +
      '<form id="admin-reservation-form"><div class="form-group"><label>User *</label><select name="user" required>' + userOpts + '</select></div><div class="form-group"><label>Book *</label><select name="bookId" required>' + bookOpts + '</select></div>' +
      '<div class="form-row"><div class="form-group"><label>Reserved Date</label><input type="date" name="reservedDate" value="' + new Date().toISOString().substring(0, 10) + '"></div><div class="form-group"><label>Expiry</label><input type="date" name="expiry"></div></div>' +
      '<div class="form-group"><label>Payment</label><input type="text" name="payment" value="Free" placeholder="Free or amount"></div>' +
      '<div class="modal-actions"><button type="button" class="btn btn-outline" id="admin-reservation-cancel">Cancel</button><button type="submit" class="btn btn-primary"><i class="fa fa-check"></i> Create</button></div></form></div></div>';
    var existing = document.getElementById('admin-reservation-modal'); if (existing) existing.remove();
    document.body.insertAdjacentHTML('beforeend', html);
    var modal = document.getElementById('admin-reservation-modal');
    document.getElementById('admin-reservation-cancel').onclick = function () { modal.remove(); };
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.remove(); });
    document.getElementById('admin-reservation-form').addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), user = fd.get('user'), bookId = fd.get('bookId');
      if (!user || !bookId) { showToast('User and Book are required', 'error'); return; }
      var book = books.filter(function (b) { return b.id === bookId; })[0];
      var reservations = getReservations();
      reservations.push({ id: generateId(), userName: user, user: user, bookId: bookId, bookTitle: book ? book.title : '', book: book ? book.title : '', reservedDate: fd.get('reservedDate') || new Date().toISOString().substring(0, 10), expiry: fd.get('expiry') || '', payment: fd.get('payment') || 'Free', status: 'pending', createdAt: new Date().toISOString() });
      saveReservations(reservations); showToast('Reservation created', 'success'); modal.remove(); renderContent();
    });
  }
  /* ========== Section: Reports ========== */
  function renderReports() {
    var books = getBooks(), authors = getAuthors(), publishers = getPublishers(), categories = getCategories();
    var users = getAllUsers(), borrowRecords = getBorrowRecords(), reservations = getReservations(), notifications = getNotifications();
    var type = state.reportType;
    var opts = [
      { id: 'books', icon: 'fa-book', label: 'Books Report', desc: 'Complete book inventory' },
      { id: 'users', icon: 'fa-users', label: 'Users Report', desc: 'User accounts overview' },
      { id: 'borrow-records', icon: 'fa-hand-holding', label: 'Borrow Records', desc: 'All borrowing activity' },
      { id: 'reservations', icon: 'fa-bookmark', label: 'Reservations', desc: 'All reservations' },
      { id: 'notifications', icon: 'fa-bell', label: 'Notifications', desc: 'Notification history' }
    ];
    var html = '<div class="section-header"><div><h1>Reports</h1><p>Generate and export reports</p></div></div>';
    for (var i = 0; i < opts.length; i++) html += '<div class="report-option' + (type === opts[i].id ? ' active' : '') + '" data-report="' + opts[i].id + '"><i class="fa ' + opts[i].icon + '"></i><div><h4>' + opts[i].label + '</h4><p>' + opts[i].desc + '</p></div></div>';
    html += '<div class="card"><h3><i class="fa fa-download" style="margin-right:8px;color:var(--accent)"></i>Export</h3><div class="export-btns"><button class="btn btn-primary btn-sm" id="admin-export-pdf"><i class="fa fa-file-pdf"></i> PDF</button><button class="btn btn-success btn-sm" id="admin-export-excel"><i class="fa fa-file-excel"></i> Excel</button><button class="btn btn-warning btn-sm" id="admin-export-csv"><i class="fa fa-file-csv"></i> CSV</button></div></div>';
    html += '<div class="card" id="admin-report-content"><h3>Summary</h3>';
    if (type === 'books') {
      html += '<div class="stat-cards"><div class="stat-card"><div class="stat-value">' + books.length + '</div><div class="stat-label">Total Books</div></div><div class="stat-card"><div class="stat-value">' + authors.length + '</div><div class="stat-label">Authors</div></div><div class="stat-card"><div class="stat-value">' + publishers.length + '</div><div class="stat-label">Publishers</div></div><div class="stat-card"><div class="stat-value">' + categories.length + '</div><div class="stat-label">Categories</div></div></div>';
      if (categories.length > 0) { html += '<h4 style="margin:16px 0 8px">Books by Category</h4><table><thead><tr><th>Category</th><th>Count</th></tr></thead><tbody>'; for (var c = 0; c < categories.length; c++) { html += '<tr><td>' + escapeHTML(categories[c].name) + '</td><td>' + books.filter(function (b) { return (b.category || b.subject || '') === categories[c].name; }).length + '</td></tr>'; } html += '</tbody></table>'; }
    } else if (type === 'users') {
      html += '<div class="stat-cards"><div class="stat-card"><div class="stat-value">' + users.length + '</div><div class="stat-label">Total</div></div><div class="stat-card"><div class="stat-value">' + users.filter(function (u) { return (u.role || '').toLowerCase() === 'admin'; }).length + '</div><div class="stat-label">Admins</div></div><div class="stat-card"><div class="stat-value">' + users.filter(function (u) { return u.lastLogin && (Date.now() - new Date(u.lastLogin).getTime()) < 86400000; }).length + '</div><div class="stat-label">Active Today</div></div></div>';
    } else if (type === 'borrow-records') {
      html += '<div class="stat-cards"><div class="stat-card"><div class="stat-value">' + borrowRecords.length + '</div><div class="stat-label">Total</div></div><div class="stat-card"><div class="stat-value">' + borrowRecords.filter(function (r) { return r.status === 'active'; }).length + '</div><div class="stat-label">Active</div></div><div class="stat-card"><div class="stat-value">' + borrowRecords.filter(function (r) { return r.status === 'overdue'; }).length + '</div><div class="stat-label">Overdue</div></div><div class="stat-card"><div class="stat-value">' + borrowRecords.filter(function (r) { return r.status === 'returned'; }).length + '</div><div class="stat-label">Returned</div></div></div>';
    } else if (type === 'reservations') {
      html += '<div class="stat-cards"><div class="stat-card"><div class="stat-value">' + reservations.length + '</div><div class="stat-label">Total</div></div><div class="stat-card"><div class="stat-value">' + reservations.filter(function (r) { return r.status === 'pending' || r.status === 'active'; }).length + '</div><div class="stat-label">Active/Pending</div></div><div class="stat-card"><div class="stat-value">' + reservations.filter(function (r) { return r.status === 'confirmed'; }).length + '</div><div class="stat-label">Confirmed</div></div></div>';
    } else if (type === 'notifications') {
      html += '<div class="stat-cards"><div class="stat-card"><div class="stat-value">' + notifications.length + '</div><div class="stat-label">Total</div></div><div class="stat-card"><div class="stat-value">' + notifications.filter(function (n) { return !n.read; }).length + '</div><div class="stat-label">Unread</div></div></div>';
    }
    return html + '</div>';
  }

  function exportReport(format) {
    var type = state.reportType, data = [], filename = 'report-' + type + '-' + new Date().toISOString().substring(0, 10);
    if (type === 'books') data = getBooks().map(function (b) { return { Title: b.title, Author: b.author, Publisher: b.publisher, Category: b.category || b.subject, Class: b.class || b.grade, ISBN: b.isbn, Language: b.language, Copies: b.totalCopies, Available: b.availableCopies }; });
    else if (type === 'users') data = getAllUsers().map(function (u) { return { Name: u.name || u.username, Email: u.email, Phone: u.phone, Role: u.role, Joined: fmtDate(u.joined || u.createdAt) }; });
    else if (type === 'borrow-records') data = getBorrowRecords().map(function (r) { return { User: r.userName || r.user, Book: r.bookTitle || r.bookName || r.book, 'Borrow Date': fmtDate(r.borrowDate), 'Due Date': fmtDate(r.dueDate), 'Return Date': fmtDate(r.returnDate), Status: r.status }; });
    else if (type === 'reservations') data = getReservations().map(function (r) { return { User: r.userName || r.user, Book: r.bookTitle || r.bookName || r.book, 'Reserved': fmtDate(r.reservedDate || r.createdAt), Expiry: fmtDate(r.expiry), Status: r.status, Payment: r.payment }; });
    else if (type === 'notifications') data = getNotifications().map(function (n) { return { Title: n.title, Message: n.message, Type: n.type, Target: n.target, Date: fmtDateTime(n.time || n.timestamp || n.date) }; });
    if (!data.length) { showToast('No data to export', 'error'); return; }
    if (format === 'csv' || format === 'excel') {
      var headers = Object.keys(data[0]), csv = headers.join(',') + '\n';
      for (var i = 0; i < data.length; i++) { var row = []; for (var h = 0; h < headers.length; h++) row.push('"' + String(data[i][headers[h]] || '').replace(/"/g, '""') + '"'); csv += row.join(',') + '\n'; }
      var blob = format === 'excel' ? new Blob(['\ufeff' + csv], { type: 'application/vnd.ms-excel;charset=utf-8' }) : new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = filename + '.' + (format === 'excel' ? 'xls' : 'csv'); document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      var htmlContent = '<html><head><style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #ddd;padding:8px;text-align:left;font-size:12px}th{background:#f5f5f5}</style></head><body><h1>Library Admin Report</h1><h2>' + type.replace(/-/g, ' ').replace(/\b\w/g, function (l) { return l.toUpperCase(); }) + ' - ' + new Date().toLocaleDateString() + '</h2><table><thead><tr>';
      var keys = Object.keys(data[0]); for (var k = 0; k < keys.length; k++) htmlContent += '<th>' + keys[k] + '</th>';
      htmlContent += '</tr></thead><tbody>'; for (var r = 0; r < data.length; r++) { htmlContent += '<tr>'; for (var j = 0; j < keys.length; j++) htmlContent += '<td>' + escapeHTML(String(data[r][keys[j]] || '')) + '</td>'; htmlContent += '</tr>'; }
      htmlContent += '</tbody></table></body></html>';
      var pw = window.open('', '_blank'); pw.document.write(htmlContent); pw.document.close(); pw.print();
    }
    showToast('Report exported as ' + format.toUpperCase(), 'success');
  }

  /* ========== Section: Settings ========== */
  function renderSettingsSection() {
    var settings = getSettings(), contact = settings.contactInfo || {}, social = settings.socialLinks || [];
    var platforms = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'whatsapp'];
    var socialInputs = '';
    for (var s = 0; s < platforms.length; s++) {
      var p = platforms[s], url = '';
      for (var j = 0; j < social.length; j++) { if ((social[j].platform || social[j].name || '').toLowerCase() === p) { url = social[j].url || social[j].link || ''; break; } }
      socialInputs += '<div class="form-group"><label><i class="fa fa-' + p + '" style="margin-right:4px"></i>' + p.charAt(0).toUpperCase() + p.slice(1) + '</label><input type="url" name="social_' + p + '" value="' + escapeHTML(url) + '" placeholder="https://' + p + '.com/..."></div>';
    }
    return '<div class="section-header"><div><h1>Settings</h1><p>Configure your website</p></div></div>' +
      '<div class="card"><h3><i class="fa fa-globe" style="margin-right:8px;color:var(--accent)"></i>Website Info</h3><form id="admin-site-settings-form"><div class="form-row"><div class="form-group"><label>Website Name</label><input type="text" name="siteName" value="' + escapeHTML(settings.siteName || settings.siteTitle || '') + '" placeholder="My Library"></div><div class="form-group"><label>Logo URL</label><input type="url" name="logoUrl" value="' + escapeHTML(settings.logoUrl || '') + '"></div></div><div class="form-group"><label>Homepage Banner URL</label><input type="url" name="bannerUrl" value="' + escapeHTML(settings.bannerUrl || '') + '"></div><div class="form-group"><label>Footer Text</label><textarea name="footerText" rows="2">' + escapeHTML(settings.footerText || '') + '</textarea></div><div class="form-group"><label>Theme Color</label><input type="color" name="themeColor" value="' + escapeHTML(settings.themeColor || '#3b82f6') + '" style="width:60px;height:40px;padding:2px;cursor:pointer"></div><div style="margin-top:8px"><button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-save"></i> Save Website Info</button></div></form></div>' +
      '<div class="card"><h3><i class="fa fa-address-card" style="margin-right:8px;color:var(--accent)"></i>Contact Details</h3><form id="admin-contact-form"><div class="form-group"><label>Address</label><input type="text" name="address" value="' + escapeHTML(contact.address || '') + '"></div><div class="form-row"><div class="form-group"><label>Email</label><input type="email" name="email" value="' + escapeHTML(contact.email || '') + '"></div><div class="form-group"><label>Phone</label><input type="text" name="phone" value="' + escapeHTML(contact.phone || '') + '"></div></div><div style="margin-top:8px"><button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-save"></i> Save Contact</button></div></form></div>' +
      '<div class="card"><h3><i class="fa fa-share-nodes" style="margin-right:8px;color:var(--accent)"></i>Social Media Links</h3><form id="admin-social-form"><div class="form-row">' + socialInputs + '</div><div style="margin-top:8px"><button type="submit" class="btn btn-primary btn-sm"><i class="fa fa-save"></i> Save Social Links</button></div></form></div>';
  }
  /* ========== Notification Mark Read ========== */
  function markNotificationRead(nid) {
    try {
      var stored = localStorage.getItem('sl_notifications'); if (!stored) return;
      var arr = JSON.parse(stored); if (!Array.isArray(arr)) return;
      for (var i = 0; i < arr.length; i++) { if (String(arr[i].id) === String(nid)) { arr[i].read = true; break; } }
      localStorage.setItem('sl_notifications', JSON.stringify(arr)); updateSidebarActive();
    } catch (e) {}
  }

  /* ========== Render Content Dispatch ========== */
  function renderContent() {
    var el = document.getElementById('admin-content-area'); if (!el) return;
    switch (state.activeSection) {
      case 'dashboard': el.innerHTML = renderDashboard(); break;
      case 'books': el.innerHTML = renderBooks(); break;
      case 'authors': el.innerHTML = renderAuthors(); break;
      case 'publishers': el.innerHTML = renderPublishers(); break;
      case 'categories': el.innerHTML = renderCategories(); break;
      case 'notifications': el.innerHTML = renderNotificationsSection(); break;
      case 'users': el.innerHTML = renderUsersSection(); break;
      case 'borrow-records': el.innerHTML = renderBorrowRecords(); break;
      case 'reservations': el.innerHTML = renderReservations(); break;
      case 'reports': el.innerHTML = renderReports(); break;
      case 'settings': el.innerHTML = renderSettingsSection(); break;
      default: el.innerHTML = renderDashboard();
    }
    attachContentListeners();
    var counters = document.querySelectorAll('.stat-value[data-count]');
    for (var i = 0; i < counters.length; i++) animateCounter(counters[i], parseInt(counters[i].getAttribute('data-count') || '0', 10));
  }

  /* ========== Main Render ========== */
  function render(containerId) {
    var container = document.getElementById(containerId);
    if (!container) { console.error('AdminDashboard: Container "' + containerId + '" not found'); return; }
    container.innerHTML = getStyles() +
      '<div id="admin-dashboard">' + renderSidebar() +
      '<div class="admin-content" id="admin-content-area"></div>' +
      '<button class="mobile-toggle" id="admin-mobile-toggle"><i class="fa fa-bars"></i></button>' +
      '<div class="backdrop" id="admin-backdrop"></div></div>';
    renderContent(); attachSidebarListeners();
  }

  /* ========== Sidebar Listeners ========== */
  function attachSidebarListeners() {
    var navItems = document.querySelectorAll('#admin-dashboard .nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].addEventListener('click', function () {
        var section = this.getAttribute('data-section');
        if (section === 'logout') { showConfirm('Logout', 'Are you sure you want to logout?', function () { window.location.href = 'index.html'; }); return; }
        if (section) { state.activeSection = section; updateSidebarActive(); renderContent(); closeMobileSidebar(); }
      });
    }
    var mt = document.getElementById('admin-mobile-toggle');
    if (mt) mt.addEventListener('click', function () { state.sidebarOpen = true; document.querySelector('#admin-dashboard .admin-sidebar').classList.add('open'); document.getElementById('admin-backdrop').classList.add('show'); });
    var sc = document.getElementById('admin-sidebar-close'); if (sc) sc.addEventListener('click', closeMobileSidebar);
    var bd = document.getElementById('admin-backdrop'); if (bd) bd.addEventListener('click', closeMobileSidebar);
  }

  function closeMobileSidebar() {
    state.sidebarOpen = false;
    var s = document.querySelector('#admin-dashboard .admin-sidebar'), b = document.getElementById('admin-backdrop');
    if (s) s.classList.remove('open'); if (b) b.classList.remove('show');
  }

  function updateSidebarActive() {
    var items = document.querySelectorAll('#admin-dashboard .nav-item');
    for (var i = 0; i < items.length; i++) { if (items[i].getAttribute('data-section') === state.activeSection) items[i].classList.add('active'); else items[i].classList.remove('active'); }
    var unread = getUnreadCount(), badges = document.querySelectorAll('#admin-dashboard .nav-badge');
    for (var j = 0; j < badges.length; j++) { badges[j].textContent = unread > 0 ? unread : ''; badges[j].style.display = unread > 0 ? '' : 'none'; }
  }

  /* ========== Content Listeners ========== */
  function bindSearch(id, stateKey, extra) {
    var el = document.getElementById(id); if (!el) return;
    el.addEventListener('input', function () { state[stateKey] = this.value; if (extra) extra(); renderContent(); var e = document.getElementById(id); if (e) { e.focus(); e.setSelectionRange(e.value.length, e.value.length); } });
  }
  function bindClickAll(sel, fn) {
    var els = document.querySelectorAll(sel);
    for (var i = 0; i < els.length; i++) { (function (el) { el.addEventListener('click', function () { fn(el); }); })(els[i]); }
  }

  function attachContentListeners() {
    /* Dashboard quick actions */
    bindClickAll('.quick-action-btn[data-nav]', function (el) { state.activeSection = el.getAttribute('data-nav'); updateSidebarActive(); renderContent(); });

    /* Books */
    bindSearch('admin-book-search', 'bookSearch', function () { state.bookPage = 1; });
    var bcFilter = document.getElementById('admin-book-cat-filter');
    if (bcFilter) bcFilter.addEventListener('change', function () { state.bookFilterCategory = this.value; state.bookPage = 1; renderContent(); });
    var bsFilter = document.getElementById('admin-book-class-filter');
    if (bsFilter) bsFilter.addEventListener('change', function () { state.bookFilterClass = this.value; state.bookPage = 1; renderContent(); });
    var addBookBtn = document.getElementById('admin-add-book-btn');
    if (addBookBtn) addBookBtn.addEventListener('click', function () { state.editingBookId = null; showBookForm(null); });
    bindClickAll('.admin-edit-book', function (el) { var id = el.getAttribute('data-id'); var books = getBooks(); for (var i = 0; i < books.length; i++) { if (books[i].id === id) { state.editingBookId = id; showBookForm(books[i]); break; } } });
    bindClickAll('.admin-delete-book', function (el) { var id = el.getAttribute('data-id'), title = el.getAttribute('data-title'); showConfirm('Delete Book', 'Delete "' + title + '"?', function () { var books = getBooks(); for (var i = 0; i < books.length; i++) { if (books[i].id === id) { books.splice(i, 1); break; } } saveBooks(books); showToast('Book deleted', 'success'); renderContent(); updateSidebarActive(); }); });
    bindClickAll('.admin-book-pag [data-page]', function (el) { if (el.disabled) return; var pg = el.getAttribute('data-page'); if (pg === 'prev') state.bookPage--; else state.bookPage++; renderContent(); });

    /* Authors */
    bindSearch('admin-author-search', 'authorSearch');
    var addAuthBtn = document.getElementById('admin-add-author-btn');
    if (addAuthBtn) addAuthBtn.addEventListener('click', function () { state.editingAuthorId = null; showAuthorForm(null); });
    bindClickAll('.admin-edit-author', function (el) { var id = el.getAttribute('data-id'); var authors = getAuthors(); for (var i = 0; i < authors.length; i++) { if (authors[i].id === id) { state.editingAuthorId = id; showAuthorForm(authors[i]); break; } } });
    bindClickAll('.admin-delete-author', function (el) { var id = el.getAttribute('data-id'), name = el.getAttribute('data-name'); showConfirm('Delete Author', 'Delete "' + name + '"?', function () { var authors = getAuthors(); for (var i = 0; i < authors.length; i++) { if (authors[i].id === id) { authors.splice(i, 1); break; } } saveAuthors(authors); showToast('Author deleted', 'success'); renderContent(); }); });

    /* Publishers */
    bindSearch('admin-publisher-search', 'publisherSearch');
    var addPubBtn = document.getElementById('admin-add-publisher-btn');
    if (addPubBtn) addPubBtn.addEventListener('click', function () { state.editingPublisherId = null; showPublisherForm(null); });
    bindClickAll('.admin-edit-publisher', function (el) { var id = el.getAttribute('data-id'); var pubs = getPublishers(); for (var i = 0; i < pubs.length; i++) { if (pubs[i].id === id) { state.editingPublisherId = id; showPublisherForm(pubs[i]); break; } } });
    bindClickAll('.admin-delete-publisher', function (el) { var id = el.getAttribute('data-id'), name = el.getAttribute('data-name'); showConfirm('Delete Publisher', 'Delete "' + name + '"?', function () { var pubs = getPublishers(); for (var i = 0; i < pubs.length; i++) { if (pubs[i].id === id) { pubs.splice(i, 1); break; } } savePublishers(pubs); showToast('Publisher deleted', 'success'); renderContent(); }); });

    /* Categories */
    var addCatBtn = document.getElementById('admin-add-category-btn');
    if (addCatBtn) addCatBtn.addEventListener('click', function () { state.editingCategoryId = null; showCategoryForm(null); });
    bindClickAll('.admin-edit-category', function (el) { var id = el.getAttribute('data-id'); var cats = getCategories(); for (var i = 0; i < cats.length; i++) { if (cats[i].id === id) { state.editingCategoryId = id; showCategoryForm(cats[i]); break; } } });
    bindClickAll('.admin-delete-category', function (el) { var id = el.getAttribute('data-id'), name = el.getAttribute('data-name'); showConfirm('Delete Category', 'Delete "' + name + '"? Books will not be deleted.', function () { var cats = getCategories(); for (var i = 0; i < cats.length; i++) { if (cats[i].id === id) { cats.splice(i, 1); break; } } saveCategories(cats); showToast('Category deleted', 'success'); renderContent(); }); });

    /* Notifications */
    bindClickAll('.filter-tab[data-filter^="notifs_"]', function (el) { state.notificationFilter = el.getAttribute('data-filter').replace('notifs_', ''); renderContent(); });
    var createNotifBtn = document.getElementById('admin-create-notif-btn');
    if (createNotifBtn) createNotifBtn.addEventListener('click', showNotificationForm);
    var markAllBtn = document.getElementById('admin-mark-all-read');
    if (markAllBtn) markAllBtn.addEventListener('click', function () { if (typeof Notifications !== 'undefined' && Notifications.markAllAsRead) Notifications.markAllAsRead(); else { var n = getNotifications(); for (var i = 0; i < n.length; i++) n[i].read = true; saveNotifications(n); } showToast('All marked as read', 'success'); renderContent(); updateSidebarActive(); });
    var clearAllBtn = document.getElementById('admin-clear-all-notifs');
    if (clearAllBtn) clearAllBtn.addEventListener('click', function () { showConfirm('Clear All', 'Delete all notifications?', function () { if (typeof Notifications !== 'undefined' && Notifications.clearAll) Notifications.clearAll(); else saveNotifications([]); showToast('Notifications cleared', 'success'); renderContent(); updateSidebarActive(); }); });
    bindClickAll('.admin-delete-notif', function (el) { var id = el.getAttribute('data-id'); var notifs = getNotifications(); for (var i = 0; i < notifs.length; i++) { if (String(notifs[i].id) === String(id)) { notifs.splice(i, 1); break; } } saveNotifications(notifs); showToast('Deleted', 'success'); renderContent(); updateSidebarActive(); });
    bindClickAll('.notif-item[data-notif-id]', function (el) { if (el.querySelector('.admin-delete-notif')) return; var nid = el.getAttribute('data-notif-id'); markNotificationRead(nid); el.classList.remove('unread'); });

    /* Users */
    bindSearch('admin-user-search', 'userSearch');
    bindClickAll('.admin-toggle-user', function (el) { var id = el.getAttribute('data-id'); var users = getAllUsers(); for (var i = 0; i < users.length; i++) { if (String(users[i].id || users[i].username) === String(id)) { users[i].suspended = !users[i].suspended; if (typeof Users !== 'undefined' && Users.update) Users.update(users[i]); break; } } showToast('User status updated', 'success'); renderContent(); });
    bindClickAll('.admin-delete-user', function (el) { var id = el.getAttribute('data-id'), name = el.getAttribute('data-name'); showConfirm('Delete User', 'Delete "' + name + '"?', function () { if (typeof Users !== 'undefined' && Users.delete) Users.delete(id); else if (typeof Auth !== 'undefined' && Auth.deleteUser) Auth.deleteUser(id); showToast('User deleted', 'success'); renderContent(); }); });

    /* Borrow Records */
    bindClickAll('.filter-tab[data-filter^="borrow_"]', function (el) { state.borrowFilter = el.getAttribute('data-filter').replace('borrow_', ''); state.borrowPage = 1; renderContent(); });
    var addBorrowBtn = document.getElementById('admin-add-borrow-btn');
    if (addBorrowBtn) addBorrowBtn.addEventListener('click', function () { state.editingBorrowId = null; showBorrowForm(null); });
    bindClickAll('.admin-return-borrow', function (el) { var id = el.getAttribute('data-id'); showConfirm('Mark Returned', 'Mark this book as returned?', function () { var records = getBorrowRecords(); for (var i = 0; i < records.length; i++) { if (records[i].id === id) { records[i].status = 'returned'; records[i].returnDate = new Date().toISOString(); break; } } saveBorrowRecords(records); showToast('Book returned', 'success'); renderContent(); }); });
    bindClickAll('.admin-edit-borrow', function (el) { var id = el.getAttribute('data-id'); var records = getBorrowRecords(); for (var i = 0; i < records.length; i++) { if (records[i].id === id) { state.editingBorrowId = id; showBorrowForm(records[i]); break; } } });
    bindClickAll('.admin-delete-borrow', function (el) { var id = el.getAttribute('data-id'); showConfirm('Delete Record', 'Delete this borrow record?', function () { var records = getBorrowRecords(); for (var i = 0; i < records.length; i++) { if (records[i].id === id) { records.splice(i, 1); break; } } saveBorrowRecords(records); showToast('Record deleted', 'success'); renderContent(); }); });
    bindClickAll('.admin-borrow-pag [data-page]', function (el) { if (el.disabled) return; if (el.getAttribute('data-page') === 'prev') state.borrowPage--; else state.borrowPage++; renderContent(); });

    /* Reservations */
    bindClickAll('.filter-tab[data-filter^="res_"]', function (el) { state.reservationFilter = el.getAttribute('data-filter').replace('res_', ''); state.reservationPage = 1; renderContent(); });
    var addResBtn = document.getElementById('admin-add-reservation-btn');
    if (addResBtn) addResBtn.addEventListener('click', showReservationForm);
    bindClickAll('.admin-confirm-res', function (el) { var id = el.getAttribute('data-id'); var res = getReservations(); for (var i = 0; i < res.length; i++) { if (res[i].id === id) { res[i].status = 'confirmed'; break; } } saveReservations(res); showToast('Reservation confirmed', 'success'); renderContent(); });
    bindClickAll('.admin-cancel-res', function (el) { var id = el.getAttribute('data-id'); showConfirm('Cancel Reservation', 'Cancel this reservation?', function () { var res = getReservations(); for (var i = 0; i < res.length; i++) { if (res[i].id === id) { res[i].status = 'cancelled'; break; } } saveReservations(res); showToast('Reservation cancelled', 'success'); renderContent(); }); });
    bindClickAll('.admin-delete-res', function (el) { var id = el.getAttribute('data-id'); showConfirm('Delete Reservation', 'Delete this reservation?', function () { var res = getReservations(); for (var i = 0; i < res.length; i++) { if (res[i].id === id) { res.splice(i, 1); break; } } saveReservations(res); showToast('Reservation deleted', 'success'); renderContent(); }); });
    bindClickAll('.admin-res-pag [data-page]', function (el) { if (el.disabled) return; if (el.getAttribute('data-page') === 'prev') state.reservationPage--; else state.reservationPage++; renderContent(); });

    /* Reports */
    bindClickAll('.report-option[data-report]', function (el) { state.reportType = el.getAttribute('data-report'); renderContent(); });
    var expPdf = document.getElementById('admin-export-pdf'); if (expPdf) expPdf.addEventListener('click', function () { exportReport('pdf'); });
    var expExcel = document.getElementById('admin-export-excel'); if (expExcel) expExcel.addEventListener('click', function () { exportReport('excel'); });
    var expCsv = document.getElementById('admin-export-csv'); if (expCsv) expCsv.addEventListener('click', function () { exportReport('csv'); });

    /* Settings */
    var siteForm = document.getElementById('admin-site-settings-form');
    if (siteForm) siteForm.addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), settings = getSettings();
      settings.siteName = fd.get('siteName') || ''; settings.siteTitle = fd.get('siteName') || '';
      settings.logoUrl = fd.get('logoUrl') || ''; settings.bannerUrl = fd.get('bannerUrl') || '';
      settings.footerText = fd.get('footerText') || ''; settings.themeColor = fd.get('themeColor') || '#3b82f6';
      saveSettings(settings); showToast('Website info saved', 'success');
    });
    var contactForm = document.getElementById('admin-contact-form');
    if (contactForm) contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), settings = getSettings();
      settings.contactInfo = { address: fd.get('address') || '', email: fd.get('email') || '', phone: fd.get('phone') || '' };
      saveSettings(settings); showToast('Contact info saved', 'success');
    });
    var socialForm = document.getElementById('admin-social-form');
    if (socialForm) socialForm.addEventListener('submit', function (e) {
      e.preventDefault(); var fd = new FormData(this), settings = getSettings();
      var platforms = ['facebook', 'twitter', 'instagram', 'youtube', 'linkedin', 'whatsapp'], links = [];
      for (var i = 0; i < platforms.length; i++) { var url = fd.get('social_' + platforms[i]) || ''; if (url) links.push({ name: platforms[i].charAt(0).toUpperCase() + platforms[i].slice(1), platform: platforms[i], url: url }); }
      settings.socialLinks = links; saveSettings(settings); showToast('Social links saved', 'success');
    });
  }

  /* ========== Public API ========== */
  return {
    render: render,
    timeAgo: timeAgo,
    navigateTo: function (section) { state.activeSection = section; updateSidebarActive(); renderContent(); }
  };
})();
