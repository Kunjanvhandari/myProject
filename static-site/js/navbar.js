function generateNavbarHTML(activePage) {
  var base = getBasePath();
  var user = Auth.getUser();
  var isLoggedIn = Auth.isAuthenticated;
  var isAdmin = Auth.isAdmin;
  var cartCount = parseInt(localStorage.getItem('librivista_cart_count') || '0', 10);
  var userName = user ? (user.name || user.username || 'Account') : 'Account';

  var navLinks = [
    { label: 'Home', href: 'index.html', id: 'home' },
    { label: 'Library', href: 'library/index.html', id: 'library' },
    { label: 'Books', href: 'library/books/index.html', id: 'books' },
    { label: 'New Releases', href: 'library/new-release/index.html', id: 'new-release' },
    { label: 'About', href: 'about-us/index.html', id: 'about' },
    { label: 'Contact', href: 'contact-us/index.html', id: 'contact' },
    { label: 'Blog', href: 'blog/index.html', id: 'blog' },
    { label: 'Developer', href: 'head-developer/index.html', id: 'developer' }
  ];

  var mobileNavLinks = navLinks.map(function(link) {
    var activeClass = activePage === link.id ? ' active' : '';
    return '<li><a href="' + base + link.href + '" class="mobile-nav-link' + activeClass + '" data-nav-link><i class="fa ' + getNavIcon(link.id) + '"></i> ' + link.label + '</a></li>';
  }).join('');

  var desktopNavLinks = navLinks.map(function(link) {
    var activeClass = activePage === link.id ? ' active' : '';
    return '<a href="' + base + link.href + '" class="nav-link' + activeClass + '">' + link.label + '</a>';
  }).join('');

  var profileAvatar = '';
  if (isLoggedIn && user && user.profilePhoto) {
    profileAvatar = '<img src="' + user.profilePhoto + '" alt="' + userName + '" class="nav-profile-avatar">';
  } else if (isLoggedIn) {
    profileAvatar = '<div class="nav-profile-avatar nav-profile-avatar-text">' + userName.charAt(0).toUpperCase() + '</div>';
  } else {
    profileAvatar = '<div class="nav-profile-avatar nav-profile-avatar-icon"><i class="fa fa-user"></i></div>';
  }

  var profileBtn = isLoggedIn
    ? '<button class="nav-profile-btn" id="nav-profile-btn" onclick="toggleUserDropdown(event)" title="' + userName + '">' +
        profileAvatar +
        '<span class="nav-profile-name">' + userName + '</span>' +
        '<i class="fa fa-chevron-down nav-profile-chevron"></i>' +
      '</button>'
    : '<a href="' + base + 'library/auth/login/index.html" class="nav-profile-btn nav-profile-login" title="Sign In">' +
        '<div class="nav-profile-avatar nav-profile-avatar-icon"><i class="fa fa-user"></i></div>' +
        '<span class="nav-profile-name">Sign In</span>' +
      '</a>';

  var userDropdown = isLoggedIn
    ? '<div class="user-dropdown" id="user-dropdown">' +
        '<div class="user-dropdown-header">' +
          profileAvatar +
          '<div class="user-dropdown-info">' +
            '<div class="user-dropdown-name">' + (user.name || 'User') + '</div>' +
            '<div class="user-dropdown-email">' + (user.email || user.username || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="user-dropdown-divider"></div>' +
        '<a href="' + base + 'library/profile/index.html" class="user-dropdown-item"><i class="fa fa-id-card"></i> My Profile</a>' +
        '<a href="' + base + 'library/profile/index.html" class="user-dropdown-item"><i class="fa fa-user-edit"></i> Edit Profile</a>' +
        '<a href="' + base + 'library/profile/index.html#borrowed" class="user-dropdown-item"><i class="fa fa-book-reader"></i> Borrowed Books</a>' +
        '<a href="' + base + 'library/profile/index.html#reserved" class="user-dropdown-item"><i class="fa fa-bookmark"></i> Reserved Books</a>' +
        '<a href="' + base + 'library/profile/index.html#history" class="user-dropdown-item"><i class="fa fa-history"></i> Reading History</a>' +
        '<a href="' + base + 'library/profile/index.html#downloads" class="user-dropdown-item"><i class="fa fa-download"></i> Downloads</a>' +
        '<div class="user-dropdown-divider"></div>' +
        '<button class="user-dropdown-item user-dropdown-logout" onclick="Auth.logout()"><i class="fa fa-sign-out-alt"></i> Logout</button>' +
      '</div>'
    : '';

  var notifBtn = isAdmin
    ? '<button class="nav-icon-btn notif-bell-btn" id="notif-bell-btn" title="Notifications" onclick="toggleNotifDropdown()">' +
        '<i class="fa fa-bell"></i>' +
        '<span class="notif-badge" id="notif-badge" style="display:none;"></span>' +
      '</button>'
    : '';

  var adminBtn = !isAdmin
    ? '<button class="nav-icon-btn admin-btn" onclick="openModal(\'admin-login-modal\')" title="Head Admin Login" aria-label="Head Admin login">' +
        '<i class="fa fa-shield-alt"></i><span class="admin-btn-text">Admin</span>' +
      '</button>'
    : '';

  var dashboardBtn = isAdmin
    ? '<a href="' + base + 'admin/index.html" class="nav-icon-btn dashboard-btn" title="Admin Dashboard">' +
        '<i class="fa fa-tachometer-alt"></i>' +
      '</a>'
    : '';

  return '' +
    '<nav class="navbar" id="main-navbar" role="navigation" aria-label="Main navigation">' +
      '<div class="nav-container">' +
        '<button class="hamburger-btn" id="hamburger-btn" aria-label="Toggle navigation menu" aria-expanded="false">' +
          '<span class="hamburger-line"></span>' +
          '<span class="hamburger-line"></span>' +
          '<span class="hamburger-line"></span>' +
        '</button>' +
        '<a href="' + base + 'index.html" class="nav-logo" aria-label="SaraswatiLibrary Home">' +
          '<img src="' + base + 'images/logo/book-icon.svg" alt="SaraswatiLibrary" class="logo-img" width="36" height="36">' +
          '<span class="logo-text">SaraswatiLibrary</span>' +
        '</a>' +
        '<form class="nav-search-form" id="nav-search-form" role="search">' +
          '<input type="text" name="search" class="nav-search-input" placeholder="Search books, authors..." id="nav-search-input" autocomplete="off" aria-label="Search books">' +
          '<button type="submit" class="nav-search-btn" aria-label="Search"><i class="fa fa-search"></i></button>' +
        '</form>' +
        '<div class="nav-links" id="nav-links">' + desktopNavLinks + '</div>' +
        '<div class="nav-icons">' +
          '<button class="nav-icon-btn theme-toggle-btn" id="theme-toggle" title="Toggle dark/light mode" aria-label="Toggle theme" onclick="toggleTheme()">' +
            '<i class="fa fa-sun-o" id="theme-icon-sun"></i>' +
            '<i class="fa fa-moon-o" id="theme-icon-moon" style="display:none;"></i>' +
          '</button>' +
          notifBtn +
          '<div class="nav-profile-wrapper">' +
            profileBtn +
            userDropdown +
          '</div>' +
          adminBtn +
          dashboardBtn +
          '<button class="nav-icon-btn cart-btn" onclick="window.location.href=\'' + base + 'library/cart/index.html\'" title="Shopping Cart" aria-label="Cart">' +
            '<i class="fa fa-shopping-cart"></i>' +
            '<span class="cart-badge" id="cart-badge"' + (cartCount === 0 ? ' style="display:none;"' : '') + '>' + cartCount + '</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</nav>' +

    '<div class="mobile-drawer-overlay" id="mobile-drawer-overlay" onclick="closeMobileDrawer()"></div>' +
    '<div class="mobile-drawer" id="mobile-drawer" role="dialog" aria-label="Mobile navigation">' +
      '<div class="mobile-drawer-header">' +
        '<div class="mobile-drawer-user">' +
          (isLoggedIn
            ? '<div class="drawer-user-avatar"><i class="fa fa-user-circle"></i></div><div class="drawer-user-info"><span class="drawer-user-name">' + userName + '</span><span class="drawer-user-role">' + (user.role === 'admin' ? 'Administrator' : 'Member') + '</span></div>'
            : '<div class="drawer-user-avatar"><i class="fa fa-user"></i></div><div class="drawer-user-info"><span class="drawer-user-name">Guest</span><span class="drawer-user-role">Sign in to access your account</span></div>'
          ) +
        '</div>' +
        '<button class="drawer-close-btn" onclick="closeMobileDrawer()" aria-label="Close menu"><i class="fa fa-times"></i></button>' +
      '</div>' +
      '<form class="mobile-drawer-search" action="' + base + 'library/books/index.html" method="GET" data-drawer-form>' +
        '<input type="text" name="search" class="mobile-search-input" placeholder="Search books..." aria-label="Search books">' +
        '<button type="submit" class="mobile-search-btn"><i class="fa fa-search"></i></button>' +
      '</form>' +
      '<ul class="mobile-drawer-nav">' + mobileNavLinks + '</ul>' +
      '<div class="mobile-drawer-footer">' +
        (isLoggedIn
          ? '<button class="drawer-logout-btn" onclick="Auth.logout()" style="width:100%; padding:10px; border-radius:var(--radius-md); border:1.5px solid rgba(239,68,68,0.3); background:rgba(239,68,68,0.08); color:#EF4444; font-weight:600; font-size:14px; cursor:pointer;"><i class="fa fa-sign-out"></i> Logout</button>'
          : '<a href="' + base + 'library/auth/login/index.html" class="drawer-login-btn" onclick="closeMobileDrawer()" style="display:block; text-align:center; padding:10px; border-radius:var(--radius-md); background:var(--accent); color:white; font-weight:600; font-size:14px; text-decoration:none;"><i class="fa fa-sign-in"></i> Sign In / Register</a>'
        ) +
        '<div class="drawer-social-links">' +
          '<a href="https://www.facebook.com/kunjan.vhandari" target="_blank" rel="noopener" aria-label="Facebook"><i class="fa fa-facebook-f"></i></a>' +
          '<a href="https://instagram.com/saraswatilibrary" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa fa-instagram"></i></a>' +
          '<a href="https://twitter.com/saraswatilibrary" target="_blank" rel="noopener" aria-label="Twitter"><i class="fa fa-twitter"></i></a>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="modal-overlay" id="admin-login-modal" role="dialog" aria-label="Admin login">' +
      '<div class="modal-dialog">' +
        '<div class="modal-header">' +
          '<h3><i class="fa fa-shield-alt"></i> Head Admin Access</h3>' +
          '<button class="modal-close-btn" onclick="closeModal(\'admin-login-modal\')" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<form id="admin-login-form" onsubmit="handleAdminLogin(event)">' +
            '<div class="form-group">' +
              '<label class="form-label" for="admin-username"><i class="fa fa-user"></i> Admin Username</label>' +
              '<input type="text" id="admin-username" class="form-control" placeholder="Enter admin username" required>' +
            '</div>' +
            '<div class="form-group">' +
              '<label class="form-label" for="admin-password"><i class="fa fa-key"></i> Admin Password</label>' +
              '<input type="password" id="admin-password" class="form-control" placeholder="Enter admin password" required>' +
            '</div>' +
            '<div id="admin-login-error" class="form-error" style="display:none;"></div>' +
            '<button type="submit" class="btn btn-primary btn-block"><i class="fa fa-sign-in"></i> Authenticate</button>' +
          '</form>' +
          '<div style="text-align:center;margin-top:16px;">' +
            '<a href="' + base + 'admin/index.html" style="font-size:13px;color:var(--accent);text-decoration:none;font-weight:600;"><i class="fa fa-arrow-right"></i> Go to Admin Dashboard</a>' +
          '</div>' +
        '</div>' +
        '<div class="modal-footer"><p class="modal-footer-text">Authorized personnel only.</p></div>' +
      '</div>' +
    '</div>' +

    (isAdmin ? '<div class="notif-dropdown" id="notif-dropdown">' +
      '<div class="notif-dropdown-header">' +
        '<h4>Notifications</h4>' +
        '<button onclick="Notifications.markAllAsRead();renderNotifList();">Mark all read</button>' +
      '</div>' +
      '<div id="notif-list-container"></div>' +
    '</div>' : '');
}

function getNavIcon(id) {
  var icons = {
    'home': 'fa-home',
    'library': 'fa-book-open',
    'books': 'fa-book',
    'new-release': 'fa-star',
    'about': 'fa-info-circle',
    'contact': 'fa-envelope',
    'blog': 'fa-pencil-alt',
    'developer': 'fa-code'
  };
  return icons[id] || 'fa-circle';
}

function generateFooterHTML() {
  var base = getBasePath();
  var currentYear = new Date().getFullYear();

  var quickLinksHTML = '';
  var supportLinksHTML = '';

  if (typeof footerSections !== 'undefined' && footerSections.length > 0) {
    footerSections.forEach(function(section) {
      var linksHTML = '';
      if (section.links && section.links.length > 0) {
        section.links.forEach(function(link) {
          linksHTML += '<li><a href="' + base + link.href + '">' + link.label + '</a></li>';
        });
      }
      if (section.title === 'Quick Links') quickLinksHTML = linksHTML;
      else if (section.title === 'Support') supportLinksHTML = linksHTML;
    });
  }

  var socialLinksHTML = '';
  if (typeof socialLinks !== 'undefined' && socialLinks.length > 0) {
    socialLinks.forEach(function(link) {
      socialLinksHTML += '<a href="' + link.url + '" target="_blank" rel="noopener noreferrer" class="footer-social-link" title="' + link.name + '" aria-label="' + link.name + '"><i class="' + link.icon + '"></i></a>';
    });
  }

  var contactHTML = '';
  if (typeof contactInfo !== 'undefined' && contactInfo.length > 0) {
    contactInfo.forEach(function(info) {
      var valueContent = info.link
        ? '<a href="' + info.link + '" class="footer-contact-link">' + info.value + '</a>'
        : '<span class="footer-contact-value">' + info.value + '</span>';
      contactHTML +=
        '<div class="footer-contact-item">' +
          '<i class="' + info.icon + '"></i>' +
          '<div>' +
            '<span class="footer-contact-label">' + info.label + '</span>' +
            valueContent +
          '</div>' +
        '</div>';
    });
  }

  return '' +
    '<footer class="footer" id="main-footer" role="contentinfo">' +
      '<div class="footer-wave"><svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path d="M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L0,120Z" fill="var(--bg-primary)"></path></svg></div>' +
      '<div class="footer-container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col footer-about">' +
            '<a href="' + base + 'index.html" class="footer-logo" aria-label="SaraswatiLibrary Home">' +
              '<img src="' + base + 'images/logo/book-icon.svg" alt="SaraswatiLibrary" class="footer-logo-img" width="40" height="40" loading="lazy">' +
              '<span class="footer-logo-text">SaraswatiLibrary</span>' +
            '</a>' +
            '<p class="footer-about-text">Saraswati Library is a modern library dedicated to providing access to knowledge and education for all. We offer a vast collection of physical books, e-books, and digital resources.</p>' +
            '<div class="footer-social">' + socialLinksHTML + '</div>' +
          '</div>' +
          '<div class="footer-col footer-links-col">' +
            '<h4 class="footer-heading">Quick Links</h4>' +
            '<ul class="footer-links">' + quickLinksHTML + '</ul>' +
          '</div>' +
          '<div class="footer-col footer-links-col">' +
            '<h4 class="footer-heading">Support</h4>' +
            '<ul class="footer-links">' + supportLinksHTML + '</ul>' +
          '</div>' +
          '<div class="footer-col footer-contact-col">' +
            '<h4 class="footer-heading">Contact Us</h4>' +
            '<div class="footer-contact-list">' + contactHTML + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div class="footer-bottom-left"><p>&copy; ' + currentYear + ' Saraswati Library. All rights reserved.</p></div>' +
          '<div class="footer-bottom-right"><p>Designed & Developed by <a href="' + base + 'head-developer/index.html" class="footer-dev-link">Kunjan Bhandari</a></p></div>' +
        '</div>' +
      '</div>' +
    '</footer>';
}

/* ========================================
   User Dropdown
   ======================================== */

function toggleUserDropdown(e) {
  e.stopPropagation();
  var dropdown = document.getElementById('user-dropdown');
  if (!dropdown) return;
  var wasOpen = dropdown.classList.contains('open');

  var notifDd = document.getElementById('notif-dropdown');
  if (notifDd) notifDd.classList.remove('open');

  if (wasOpen) {
    dropdown.classList.remove('open');
  } else {
    dropdown.classList.add('open');
  }
}

/* ========================================
   Notification Dropdown
   ======================================== */

function toggleNotifDropdown() {
  var dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  var wasOpen = dropdown.classList.contains('open');

  var userDd = document.getElementById('user-dropdown');
  if (userDd) userDd.classList.remove('open');

  if (wasOpen) {
    dropdown.classList.remove('open');
  } else {
    dropdown.classList.add('open');
    renderNotifList();
    Notifications.updateBadge();
  }
}

function renderNotifList() {
  var container = document.getElementById('notif-list-container');
  if (!container) return;
  var notifs = Notifications.getAll().slice(0, 30);
  if (notifs.length === 0) {
    container.innerHTML = '<div style="padding:40px 16px;text-align:center;color:var(--text-tertiary);font-size:13px;"><i class="fa fa-bell-slash" style="font-size:24px;display:block;margin-bottom:8px;opacity:0.4;"></i>No notifications yet</div>';
    return;
  }
  container.innerHTML = notifs.map(function(n) {
    var icon = Notifications.getIcon(n.type);
    var color = Notifications.getColor(n.type);
    var time = typeof timeAgo === 'function' ? timeAgo(n.createdAt) : '';
    var readStyle = n.read ? '' : 'background:rgba(14,165,233,0.04);';
    var unreadDot = n.read ? '' : '<span style="width:8px;height:8px;border-radius:50%;background:' + color + ';flex-shrink:0;"></span>';
    return '<div onclick="Notifications.markAsRead(\'' + n.id + '\');this.style.background=\'var(--bg-tertiary)\';this.querySelector(\'span:last-child\').remove();" style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border-color);cursor:pointer;transition:background 0.2s;' + readStyle + '">' +
      '<div style="width:36px;height:36px;border-radius:10px;background:' + color + '15;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fa ' + icon + '" style="color:' + color + ';font-size:14px;"></i></div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:13px;font-weight:600;color:var(--text-primary);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + n.title + '</div>' +
        '<div style="font-size:12px;color:var(--text-tertiary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + n.message + '</div>' +
        '<div style="font-size:11px;color:var(--text-tertiary);margin-top:3px;">' + time + '</div>' +
      '</div>' +
      unreadDot +
    '</div>';
  }).join('');
}

function initNotifBadge() {
  if (typeof Notifications !== 'undefined') {
    Notifications.updateBadge();
  }
}

document.addEventListener('click', function(e) {
  var notifDropdown = document.getElementById('notif-dropdown');
  var notifBtn = document.getElementById('notif-bell-btn');
  var userDropdown = document.getElementById('user-dropdown');
  var profileBtn = document.getElementById('nav-profile-btn');

  if (notifDropdown && !notifDropdown.contains(e.target) && (!notifBtn || !notifBtn.contains(e.target))) {
    notifDropdown.classList.remove('open');
  }
  if (userDropdown && !userDropdown.contains(e.target) && (!profileBtn || !profileBtn.contains(e.target))) {
    userDropdown.classList.remove('open');
  }
});
