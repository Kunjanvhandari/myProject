/* ========================================
   Utility Functions
   ======================================== */

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function getQueryParam(name) {
  var urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function formatDate(dateStr) {
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/* ========================================
   Time Ago Utility (Relative Time)
   ======================================== */

function timeAgo(dateString) {
  if (!dateString) return '';
  var date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  var now = new Date();
  var seconds = Math.floor((now - date) / 1000);

  if (seconds < 0) return 'just now';
  if (seconds < 5) return 'just now';
  if (seconds < 60) return seconds + ' seconds ago';

  var minutes = Math.floor(seconds / 60);
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return minutes + ' minutes ago';

  var hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return hours + ' hours ago';

  var days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return days + ' days ago';

  var weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return weeks + ' weeks ago';

  var months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return months + ' months ago';

  var years = Math.floor(days / 365);
  if (years === 1) return '1 year ago';
  return years + ' years ago';
}

/* ========================================
   HTML Sanitize Utility (XSS Prevention)
   ======================================== */

function sanitizeHTML(str) {
  if (!str) return '';
  if (typeof str !== 'string') return '' + str;
  var temp = document.createElement('div');
  temp.appendChild(document.createTextNode(str));
  return temp.innerHTML;
}

function sanitizeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ========================================
   Smooth Scroll To Element
   ======================================== */

function smoothScrollTo(selector, offset, duration) {
  if (!selector) return;
  var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) return;

  offset = offset || 0;
  duration = duration || 600;

  var startY = window.pageYOffset || document.documentElement.scrollTop;
  var targetY = el.getBoundingClientRect().top + startY - offset;
  var diff = targetY - startY;
  if (diff === 0) return;

  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    window.scrollTo(0, startY + diff * eased);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/* ========================================
   Theme Management
   ======================================== */

function initTheme() {
  var saved = localStorage.getItem('theme-mode');
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

function toggleTheme() {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme-mode', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  var sunIcon = document.getElementById('theme-icon-sun');
  var moonIcon = document.getElementById('theme-icon-moon');
  if (sunIcon && moonIcon) {
    sunIcon.style.display = isDark ? 'none' : 'inline';
    moonIcon.style.display = isDark ? 'inline' : 'none';
  }
}

/* ========================================
   Base Path Detection
   ======================================== */

function getBasePath() {
  var path = window.location.pathname;
  var parts = path.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length <= 1 || (parts.length === 1 && parts[0] === 'index.html')) return '';
  var depth = parts.length - 1;
  var base = '';
  for (var i = 0; i < depth; i++) {
    base += '../';
  }
  return base;
}

function getAssetPath() {
  return getBasePath();
}

/* ========================================
   Auth System
   ======================================== */

/* Auth module is in js/auth.js - loaded before main.js */

/* ========================================
   Toast / Notification System
   ======================================== */

function createToastContainer() {
  var container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function showToast(message, type, duration) {
  type = type || 'info';
  duration = duration || 4000;
  var container = document.getElementById('toast-container') || createToastContainer();
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  var icons = {
    success: '&#10004;',
    error: '&#10006;',
    warning: '&#9888;',
    info: '&#8505;'
  };
  toast.innerHTML =
    '<span class="toast-icon">' + (icons[type] || icons.info) + '</span>' +
    '<span class="toast-msg">' + sanitizeHTML(message) + '</span>' +
    '<button class="toast-close" onclick="this.parentElement.remove()">&times;</button>';
  container.appendChild(toast);
  setTimeout(function () {
    toast.classList.add('toast-show');
  }, 10);
  setTimeout(function () {
    toast.classList.remove('toast-show');
    setTimeout(function () {
      toast.remove();
    }, 300);
  }, duration);
}

/* ========================================
   Navbar Rendering
   ======================================== */

function renderNavbar(activePage) {
  var navbarEl = document.getElementById('navbar');
  if (!navbarEl) return;
  var html = generateNavbarHTML(activePage);
  navbarEl.innerHTML = html;
  initHamburgerMenu();
  initSearchForm();
  initMobileDrawerLinks();
  updateThemeIcon();
  updateCartBadge();
}

/* ========================================
   Footer Rendering
   ======================================== */

function renderFooter() {
  var footerEl = document.getElementById('footer');
  if (!footerEl) return;
  var html = generateFooterHTML();
  footerEl.innerHTML = html;

  // Add floating WhatsApp button if not already present
  if (!document.getElementById('whatsapp-float-btn')) {
    var waBtn = document.createElement('a');
    waBtn.id = 'whatsapp-float-btn';
    waBtn.href = 'https://wa.me/9779743962189';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.className = 'whatsapp-float';
    waBtn.title = 'Chat with us on WhatsApp';
    waBtn.setAttribute('aria-label', 'Chat with us on WhatsApp');
    waBtn.innerHTML = '<svg viewBox="0 0 32 32" fill="white" width="28" height="28"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.058 9.374L1.054 31.25l6.118-1.97C9.69 31.156 12.748 32 16.004 32 24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.37 22.608c-.39 1.1-1.932 2.014-3.162 2.27-.84.174-1.936.312-5.628-1.206-4.726-1.94-7.764-6.716-7.998-7.026-.226-.31-1.896-2.524-1.896-4.814s1.2-3.41 1.628-3.878c.39-.428.922-.57 1.228-.57.31 0 .62.002.89.016.286.014.668-.108 1.04.794.39.944 1.334 3.246 1.448 3.478.114.232.19.502.038.812-.152.31-.228.504-.456.776-.228.272-.48.608-.684.814-.228.232-.464.484-.196.94.268.456 1.19 1.962 2.552 3.178 1.752 1.566 3.228 2.052 3.692 2.28.464.228.736.19 1.008-.114.272-.31 1.16-1.352 1.47-1.826.31-.474.62-.39 1.046-.234.428.154 2.716 1.282 3.182 1.514.466.232.776.348.89.54.114.194.114 1.12-.276 2.22z"/></svg>';
    document.body.appendChild(waBtn);
  }
}

/* ========================================
   Scroll Reveal Animation
   ======================================== */

function initScrollReveal() {
  var targets = document.querySelectorAll('.scroll-reveal:not(.revealed)');
  if (targets.length === 0) return;

  targets.forEach(function (el) {
    el.style.willChange = 'transform';
  });

  var observer = new IntersectionObserver(
    function (entries) {
      var batch = [];
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          batch.push(entry.target);
          observer.unobserve(entry.target);
        }
      });
      batch.forEach(function (el) {
        el.classList.add('revealed');
        el.style.willChange = '';
      });
    },
    { threshold: 0.1, rootMargin: '-50px' }
  );
  targets.forEach(function (el) {
    observer.observe(el);
  });
}

/* ========================================
   Navbar Scroll Effect
   ======================================== */

function initNavbarScroll() {
  window.addEventListener('scroll', function () {
    var navbar = document.querySelector('.navbar');
    if (navbar) {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/* ========================================
   Mobile Hamburger Menu
   ======================================== */

function initHamburgerMenu() {
  var hamburger = document.getElementById('hamburger-btn');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      toggleMobileDrawer();
    });
  }
}

function toggleMobileDrawer() {
  var drawer = document.getElementById('mobile-drawer');
  var overlay = document.getElementById('mobile-drawer-overlay');
  var hamburger = document.getElementById('hamburger-btn');
  if (drawer && overlay && hamburger) {
    var isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      drawer.classList.add('open');
      overlay.classList.add('open');
      hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
}

function closeMobileDrawer() {
  var drawer = document.getElementById('mobile-drawer');
  var overlay = document.getElementById('mobile-drawer-overlay');
  var hamburger = document.getElementById('hamburger-btn');
  if (drawer) drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
  if (hamburger) hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

function initMobileDrawerLinks() {
  var drawer = document.getElementById('mobile-drawer');
  if (!drawer) return;
  var links = drawer.querySelectorAll('a.mobile-nav-link, a.drawer-login-btn');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMobileDrawer();
    });
  });
  var forms = drawer.querySelectorAll('form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function () {
      closeMobileDrawer();
    });
  });
}

/* ========================================
   Search Functionality
   ======================================== */

function initSearchForm() {
  var form = document.getElementById('nav-search-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('nav-search-input');
      if (input && input.value.trim()) {
        var base = getBasePath();
        window.location.href = base + 'library/books/index.html?search=' + encodeURIComponent(input.value.trim());
      }
    });
  }
}

/* ========================================
   Modal / Dialog System
   ======================================== */

function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('open')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var openModals = document.querySelectorAll('.modal-overlay.open');
    openModals.forEach(function (modal) {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  }
});

/* ========================================
   Star Rating Renderer
   ======================================== */

function renderStars(rating, size) {
  size = size || 'small';
  var html = '';
  var fullStars = Math.floor(rating);
  var hasHalf = rating % 1 >= 0.5;
  for (var i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      html += '<span class="star filled ' + size + '">&#9733;</span>';
    } else if (i === fullStars + 1 && hasHalf) {
      html += '<span class="star filled half ' + size + '">&#9733;</span>';
    } else {
      html += '<span class="star ' + size + '">&#9733;</span>';
    }
  }
  return html;
}

/* ========================================
   Skeleton Loading
   ======================================== */

function showSkeletonLoading(containerId, count) {
  var container = document.getElementById(containerId);
  if (!container) return;
  count = count || 8;
  var html = '';
  for (var i = 0; i < count; i++) {
    html +=
      '<div class="book-card skeleton-card">' +
        '<div class="skeleton-image skeleton-pulse"></div>' +
        '<div class="skeleton-body">' +
          '<div class="skeleton-line skeleton-line-title skeleton-pulse"></div>' +
          '<div class="skeleton-line skeleton-line-subtitle skeleton-pulse"></div>' +
          '<div class="skeleton-line skeleton-line-short skeleton-pulse"></div>' +
          '<div class="skeleton-line skeleton-line-price skeleton-pulse"></div>' +
        '</div>' +
      '</div>';
  }
  container.innerHTML = html;
}

function hideSkeletonLoading(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var skeletons = container.querySelectorAll('.skeleton-card');
  skeletons.forEach(function (sk) {
    sk.remove();
  });
}

/* ========================================
   Book Card HTML Generator
   ======================================== */

function renderBookCard(book, options) {
  options = options || {};
  var base = getBasePath();
  var imageSrc = book.coverImage || book.image || 'images/books/book_subject_generic.svg';
  var badge = book.badge || '';
  var title = book.title || 'Untitled';
  var author = book.author || 'Unknown Author';
  var rating = book.rating || 0;
  var price = book.price || 0;
  var category = book.category || '';
  var subject = book.subject || '';
  var bookId = book._id || book.id;

  var badgeHTML = badge
    ? '<span class="book-badge">' + sanitizeHTML(badge) + '</span>'
    : '';

  var starsHTML = renderStars(rating);

  var buttonsHTML = options.showButtons !== false
    ? '<div class="book-card-buttons">' +
      '<button class="btn btn-sm btn-primary" onclick="handleBorrowBook(\'' + sanitizeAttr(bookId) + '\')"><i class="fa fa-book"></i> Borrow</button>' +
      '<button class="btn btn-sm btn-outline" onclick="handleAddToCart(\'' + sanitizeAttr(bookId) + '\')"><i class="fa fa-cart-plus"></i> Cart</button>' +
      '</div>'
    : '';

  return '' +
    '<div class="book-card scroll-reveal" data-id="' + sanitizeAttr(bookId) + '" data-category="' + sanitizeAttr(category.toLowerCase().replace(/\s+/g, '-')) + '" data-subject="' + sanitizeAttr(subject.toLowerCase().replace(/\s+/g, '-')) + '">' +
      '<div class="book-card-image-wrapper">' +
        badgeHTML +
        '<img src="' + base + sanitizeAttr(imageSrc) + '" alt="' + sanitizeAttr(title) + '" class="book-card-image" loading="lazy">' +
        '<div class="book-card-overlay">' +
          '<button class="quick-view-btn" onclick="showBookDetail(\'' + sanitizeAttr(bookId) + '\')" title="Quick View"><i class="fa fa-eye"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="book-card-body">' +
        '<h4 class="book-card-title" title="' + sanitizeAttr(title) + '">' + sanitizeHTML(title) + '</h4>' +
        '<p class="book-card-author">' + sanitizeHTML(author) + '</p>' +
        '<div class="book-card-rating">' +
          starsHTML +
          '<span class="rating-text">' + rating.toFixed(1) + '</span>' +
        '</div>' +
        '<div class="book-card-price">' +
          '<span class="price">NPR ' + price + '</span>' +
        '</div>' +
        buttonsHTML +
      '</div>' +
    '</div>';
}

/* ========================================
   Book Detail Modal
   ======================================== */

function showBookDetail(bookId) {
  var books = typeof allBooks !== 'undefined' ? allBooks : [];
  var book = null;
  for (var i = 0; i < books.length; i++) {
    if (String(books[i]._id || books[i].id) === String(bookId)) {
      book = books[i];
      break;
    }
  }

  if (!book) {
    var featured = typeof featuredBooks !== 'undefined' ? featuredBooks : [];
    var newRel = typeof newReleases !== 'undefined' ? newReleases : [];
    var combined = featured.concat(newRel);
    for (var j = 0; j < combined.length; j++) {
      if (String(combined[j].id) === String(bookId)) {
        book = combined[j];
        break;
      }
    }
  }

  if (!book) {
    showToast('Book details not found.', 'error');
    return;
  }

  var base = getBasePath();
  var imageSrc = book.coverImage || book.image || 'images/books/book_subject_generic.svg';
  var title = book.title || 'Untitled';
  var author = book.author || 'Unknown Author';
  var rating = book.rating || 0;
  var price = book.price || 0;
  var category = book.category || 'N/A';
  var subject = book.subject || 'N/A';
  var pages = book.pages || 0;
  var availableCopies = book.availableCopies || 0;
  var description = book.description || 'No description available.';
  var bookIdClean = book._id || book.id;

  var starsHTML = renderStars(rating, 'large');

  var copiesClass = availableCopies > 3 ? 'in-stock' : availableCopies > 0 ? 'low-stock' : 'out-of-stock';
  var copiesLabel = availableCopies > 3 ? 'In Stock' : availableCopies > 0 ? 'Low Stock' : 'Out of Stock';

  var slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  var pdfPath = base + 'pdfs/' + slug + '.pdf';

  var modalHTML =
    '<div class="modal-overlay open" id="book-detail-modal" onclick="if(event.target===this)closeBookDetail()">' +
      '<div class="modal-dialog book-detail-dialog">' +
        '<div class="modal-header">' +
          '<h3><i class="fa fa-book"></i> Book Details</h3>' +
          '<button class="modal-close-btn" onclick="closeBookDetail()">&times;</button>' +
        '</div>' +
        '<div class="modal-body">' +
          '<div class="book-detail-content">' +
            '<div class="book-detail-image">' +
              '<img src="' + base + sanitizeAttr(imageSrc) + '" alt="' + sanitizeAttr(title) + '" loading="lazy">' +
            '</div>' +
            '<div class="book-detail-info">' +
              '<h2 class="book-detail-title">' + sanitizeHTML(title) + '</h2>' +
              '<p class="book-detail-author">by <strong>' + sanitizeHTML(author) + '</strong></p>' +
              '<div class="book-detail-rating">' +
                starsHTML +
                '<span class="rating-number">' + rating.toFixed(1) + ' / 5</span>' +
              '</div>' +
              '<div class="book-detail-meta">' +
                '<span class="book-detail-category"><i class="fa fa-tag"></i> ' + sanitizeHTML(category) + '</span>' +
                '<span class="book-detail-subject"><i class="fa fa-graduation-cap"></i> ' + sanitizeHTML(subject) + '</span>' +
                '<span class="book-detail-pages"><i class="fa fa-file-alt"></i> ' + pages + ' pages</span>' +
                '<span class="book-detail-copies ' + copiesClass + '"><i class="fa fa-database"></i> ' + availableCopies + ' copies - ' + copiesLabel + '</span>' +
              '</div>' +
              '<div class="book-detail-price-section">' +
                '<span class="book-detail-price">NPR ' + price + '</span>' +
              '</div>' +
              '<p class="book-detail-description">' + sanitizeHTML(description) + '</p>' +
              '<div class="book-detail-actions">' +
                '<a href="' + pdfPath + '" target="_blank" class="btn btn-primary btn-lg" onclick="closeBookDetail()"><i class="fa fa-book-open"></i> Read Book</a>' +
                '<a href="' + pdfPath + '" download class="btn btn-success btn-lg"><i class="fa fa-download"></i> Download PDF</a>' +
                '<button class="btn btn-outline btn-lg" onclick="handleAddToCart(\'' + sanitizeAttr(bookIdClean) + '\');closeBookDetail()"><i class="fa fa-cart-plus"></i> Add to Cart</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var existing = document.getElementById('book-detail-modal');
  if (existing) existing.remove();

  var wrapper = document.createElement('div');
  wrapper.innerHTML = modalHTML;
  document.body.appendChild(wrapper.firstChild);
}

function closeBookDetail() {
  var modal = document.getElementById('book-detail-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      modal.remove();
    }, 300);
  }
}

/* ========================================
   Hero Slider
   ======================================== */

function initHeroSlider() {
  var sliderContainer = document.getElementById('hero-slider');
  if (!sliderContainer) return;

  var currentSlide = 0;
  var slides = typeof sliderImages !== 'undefined' ? sliderImages : [];
  if (slides.length === 0) return;

  var base = getBasePath();

  var slidesHTML = '';
  var dotsHTML = '';

  slides.forEach(function (slide, index) {
    slidesHTML +=
      '<div class="hero-slide' + (index === 0 ? ' active' : '') + '" data-index="' + index + '">' +
        '<div class="hero-slide-bg" style="background-image: url(\'' + base + sanitizeAttr(slide.image) + '\')"></div>' +
        '<div class="hero-slide-content">' +
          '<h2 class="hero-slide-title">' + sanitizeHTML(slide.title) + '</h2>' +
          '<p class="hero-slide-subtitle">by ' + sanitizeHTML(slide.subtitle) + '</p>' +
          '<a href="' + base + 'library/books/index.html" class="btn btn-primary btn-lg hero-slide-btn"><i class="fa fa-book"></i> Explore Books</a>' +
        '</div>' +
      '</div>';
    dotsHTML +=
      '<button class="hero-dot' + (index === 0 ? ' active' : '') + '" data-index="' + index + '" aria-label="Go to slide ' + (index + 1) + '"></button>';
  });

  sliderContainer.innerHTML =
    '<div class="hero-slides-wrapper">' + slidesHTML + '</div>' +
    '<button class="hero-nav hero-prev" id="hero-prev" aria-label="Previous slide"><i class="fa fa-chevron-left"></i></button>' +
    '<button class="hero-nav hero-next" id="hero-next" aria-label="Next slide"><i class="fa fa-chevron-right"></i></button>' +
    '<div class="hero-dots">' + dotsHTML + '</div>';

  function goToSlide(index) {
    var allSlides = sliderContainer.querySelectorAll('.hero-slide');
    var allDots = sliderContainer.querySelectorAll('.hero-dot');
    if (allSlides.length === 0) return;
    allSlides[currentSlide].classList.remove('active');
    allDots[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    allSlides[currentSlide].classList.add('active');
    allDots[currentSlide].classList.add('active');
  }

  var prevBtn = document.getElementById('hero-prev');
  var nextBtn = document.getElementById('hero-next');
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
    });
  }

  sliderContainer.querySelectorAll('.hero-dot').forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(dot.getAttribute('data-index'), 10);
      goToSlide(idx);
    });
  });

  setInterval(function () {
    goToSlide(currentSlide + 1);
  }, 4000);
}

/* ========================================
   Featured Books Section
   ======================================== */

function renderFeaturedBooks() {
  var container = document.getElementById('featured-books-grid');
  if (!container) return;
  var books = typeof featuredBooks !== 'undefined' ? featuredBooks : [];
  var html = '';
  books.forEach(function (book) {
    html += renderBookCard(book);
  });
  container.innerHTML = html;
}

/* ========================================
   New Releases Section
   ======================================== */

function renderNewReleases() {
  var container = document.getElementById('new-releases-grid');
  if (!container) return;
  var books = typeof newReleases !== 'undefined' ? newReleases : [];
  var html = '';
  books.forEach(function (book) {
    html += renderBookCard(book);
  });
  container.innerHTML = html;
}

/* ========================================
   Categories Section
   ======================================== */

function renderCategories() {
  var container = document.getElementById('categories-grid');
  if (!container) return;
  var cats = typeof categories !== 'undefined' ? categories : [];
  var base = getBasePath();
  var html = '';
  cats.forEach(function (cat) {
    html +=
      '<a href="' + base + 'library/books/index.html?category=' + encodeURIComponent(cat.name.toLowerCase()) + '" class="category-card scroll-reveal">' +
        '<div class="category-emoji">' + cat.emoji + '</div>' +
        '<h4 class="category-name">' + sanitizeHTML(cat.name) + '</h4>' +
        '<span class="category-count">' + cat.count.toLocaleString() + ' books</span>' +
      '</a>';
  });
  container.innerHTML = html;
}

/* ========================================
   Stats Section
   ======================================== */

function renderStats() {
  var container = document.getElementById('stats-grid');
  if (!container) return;
  var stats = typeof statsData !== 'undefined' ? statsData : [];
  var html = '';
  stats.forEach(function (stat) {
    html +=
      '<div class="stat-card scroll-reveal">' +
        '<div class="stat-icon"><i class="' + sanitizeAttr(stat.icon) + '"></i></div>' +
        '<div class="stat-value">' + sanitizeHTML(stat.value) + '</div>' +
        '<div class="stat-label">' + sanitizeHTML(stat.label) + '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Testimonials Section
   ======================================== */

function renderTestimonials() {
  var container = document.getElementById('testimonials-grid');
  if (!container) return;
  var items = typeof testimonials !== 'undefined' ? testimonials : [];
  var base = getBasePath();
  var html = '';
  items.forEach(function (item) {
    html +=
      '<div class="testimonial-card scroll-reveal">' +
        '<div class="testimonial-header">' +
          '<img src="' + base + sanitizeAttr(item.image) + '" alt="' + sanitizeAttr(item.name) + '" class="testimonial-avatar" onerror="this.src=\'' + base + 'images/team/default-avatar.png\'">' +
          '<div class="testimonial-info">' +
            '<h4 class="testimonial-name">' + sanitizeHTML(item.name) + '</h4>' +
            '<span class="testimonial-role">' + sanitizeHTML(item.role) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="testimonial-rating">' + renderStars(item.rating) + '</div>' +
        '<p class="testimonial-text">' + sanitizeHTML(item.text) + '</p>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Team Section
   ======================================== */

function renderTeamMembers() {
  var container = document.getElementById('team-grid');
  if (!container) return;
  var members = typeof teamMembers !== 'undefined' ? teamMembers : [];
  var base = getBasePath();
  var html = '';
  members.forEach(function (member) {
    html +=
      '<div class="team-card scroll-reveal">' +
        '<div class="team-card-image">' +
          '<img src="' + base + sanitizeAttr(member.image) + '" alt="' + sanitizeAttr(member.name) + '" class="team-avatar" onerror="this.src=\'' + base + 'images/team/default-avatar.png\'">' +
        '</div>' +
        '<div class="team-card-body">' +
          '<h3 class="team-name">' + sanitizeHTML(member.name) + '</h3>' +
          '<span class="team-role">' + sanitizeHTML(member.role) + '</span>' +
          '<p class="team-description">' + sanitizeHTML(member.description) + '</p>' +
          '<div class="team-details">' +
            '<div class="team-detail"><i class="fa fa-birthday-cake"></i> Age: ' + member.age + '</div>' +
            '<div class="team-detail"><i class="fa fa-map-marker-alt"></i> ' + sanitizeHTML(member.address) + '</div>' +
            '<div class="team-detail"><i class="fa fa-phone"></i> ' + sanitizeHTML(member.phone) + '</div>' +
            '<div class="team-detail"><i class="fa fa-graduation-cap"></i> ' + sanitizeHTML(member.study) + '</div>' +
          '</div>' +
          '<div class="team-social">' +
            '<a href="' + sanitizeAttr(member.facebook) + '" target="_blank" rel="noopener" class="team-social-link"><i class="fa fa-facebook-f"></i></a>' +
            '<a href="' + sanitizeAttr(member.instagram) + '" target="_blank" rel="noopener" class="team-social-link"><i class="fa fa-instagram"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   FAQ Section
   ======================================== */

function renderFAQs() {
  var container = document.getElementById('faq-list');
  if (!container) return;
  var faqs = typeof faqData !== 'undefined' ? faqData : [];
  var html = '';
  faqs.forEach(function (faq) {
    html +=
      '<div class="faq-item scroll-reveal" id="faq-' + faq.id + '">' +
        '<button class="faq-question" onclick="toggleFAQ(' + faq.id + ')">' +
          '<span>' + sanitizeHTML(faq.question) + '</span>' +
          '<i class="fa fa-chevron-down faq-icon"></i>' +
        '</button>' +
        '<div class="faq-answer" id="faq-answer-' + faq.id + '">' +
          '<p>' + sanitizeHTML(faq.answer) + '</p>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

function toggleFAQ(id) {
  var item = document.getElementById('faq-' + id);
  if (item) {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
      openItem.classList.remove('open');
    });
    if (!isOpen) {
      item.classList.add('open');
    }
  }
}

/* ========================================
   Articles / Blog Section
   ======================================== */

function renderArticles() {
  var container = document.getElementById('articles-grid');
  if (!container) return;
  var items = typeof articles !== 'undefined' ? articles : [];
  var base = getBasePath();
  var html = '';
  items.forEach(function (article) {
    var dateFormatted = new Date(article.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    html +=
      '<div class="article-card scroll-reveal">' +
        '<div class="article-card-image">' +
          '<img src="' + base + sanitizeAttr(article.image) + '" alt="' + sanitizeAttr(article.title) + '" loading="lazy" onerror="this.src=\'' + base + 'images/blog/placeholder.jpg\'">' +
          '<span class="article-category-badge">' + sanitizeHTML(article.category) + '</span>' +
        '</div>' +
        '<div class="article-card-body">' +
          '<div class="article-meta">' +
            '<span class="article-date"><i class="fa fa-calendar-alt"></i> ' + dateFormatted + '</span>' +
            '<span class="article-author"><i class="fa fa-user"></i> ' + sanitizeHTML(article.author) + '</span>' +
          '</div>' +
          '<h3 class="article-title">' + sanitizeHTML(article.title) + '</h3>' +
          '<p class="article-excerpt">' + sanitizeHTML(article.excerpt) + '</p>' +
          '<a href="' + base + 'blog/article.html?id=' + article.id + '" class="btn btn-sm btn-primary"><i class="fa fa-arrow-right"></i> Read More</a>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Contact Info Section
   ======================================== */

function renderContactInfo() {
  var container = document.getElementById('contact-info-list');
  if (!container) return;
  var info = typeof contactInfo !== 'undefined' ? contactInfo : [];
  var html = '';
  info.forEach(function (item) {
    html +=
      '<div class="contact-info-item">' +
        '<div class="contact-info-icon"><i class="' + sanitizeAttr(item.icon) + '"></i></div>' +
        '<div class="contact-info-details">' +
          '<span class="contact-info-label">' + sanitizeHTML(item.label) + '</span>' +
          '<span class="contact-info-value">' + sanitizeHTML(item.value) + '</span>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Pagination
   ======================================== */

function renderPagination(totalBooks, currentPage, booksPerPage) {
  var container = document.getElementById('pagination-container');
  if (!container) return;

  var totalPages = Math.ceil(totalBooks / booksPerPage);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  currentPage = parseInt(currentPage, 10) || 1;
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  var base = getBasePath();
  var html = '';

  html += '<button class="pagination-btn pagination-prev' + (currentPage === 1 ? ' disabled' : '') + '" data-page="' + (currentPage - 1) + '"><i class="fa fa-chevron-left"></i> Prev</button>';

  var startPage = Math.max(1, currentPage - 2);
  var endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += '<button class="pagination-btn pagination-number" data-page="1">1</button>';
    if (startPage > 2) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
  }

  for (var i = startPage; i <= endPage; i++) {
    var activeClass = i === currentPage ? ' active' : '';
    html += '<button class="pagination-btn pagination-number' + activeClass + '" data-page="' + i + '">' + i + '</button>';
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      html += '<span class="pagination-ellipsis">...</span>';
    }
    html += '<button class="pagination-btn pagination-number" data-page="' + totalPages + '">' + totalPages + '</button>';
  }

  html += '<button class="pagination-btn pagination-next' + (currentPage === totalPages ? ' disabled' : '') + '" data-page="' + (currentPage + 1) + '">Next <i class="fa fa-chevron-right"></i></button>';

  container.innerHTML = html;

  var paginationBtns = container.querySelectorAll('.pagination-btn:not(.disabled)');
  paginationBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var page = parseInt(btn.getAttribute('data-page'), 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        var currentSubject = getQueryParam('subject') || 'all';
        var currentCategory = getQueryParam('category') || getQueryParam('cat') || 'all';
        var currentSearch = getQueryParam('search') || '';
        updateURLParam('page', page.toString());
        filterAndRenderBooks();
        var booksGrid = document.getElementById('books-grid');
        if (booksGrid) {
          smoothScrollTo(booksGrid, 80, 400);
        }
      }
    });
  });
}

function updateURLParam(key, value) {
  var url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.replaceState({}, '', url.toString());
}

/* ========================================
   Books Page Functionality
   ======================================== */

function renderBooksPage() {
  var container = document.getElementById('books-grid');
  if (!container) return;

  var books = typeof allBooks !== 'undefined' ? allBooks : [];
  var searchTerm = getQueryParam('search');
  var categoryFilter = getQueryParam('category') || getQueryParam('cat');
  var subjectFilter = getQueryParam('subject');
  var activeCategory = 'all';
  var activeSubject = 'all';

  var tabsContainer = document.getElementById('category-tabs');
  if (tabsContainer) {
    var cats = typeof bookCategories !== 'undefined' ? bookCategories : [];
    var tabsHTML = '';
    cats.forEach(function (cat) {
      var activeClass = '';
      if (categoryFilter) {
        var filterNorm = categoryFilter.toLowerCase().replace(/\s+/g, '-');
        if (filterNorm === cat.id) activeClass = ' active';
      } else {
        if (cat.id === 'all') activeClass = ' active';
      }
      if (activeClass) activeCategory = cat.id;
      tabsHTML +=
        '<button class="category-tab' + activeClass + '" data-category="' + cat.id + '" onclick="filterBooksByCategory(\'' + sanitizeAttr(cat.id) + '\')">' +
          sanitizeHTML(cat.name) +
        '</button>';
    });
    tabsContainer.innerHTML = tabsHTML;
  }

  var subjectTabsContainer = document.getElementById('subject-tabs');
  if (subjectTabsContainer) {
    var subjects = getUniqueSubjects(books);
    var subjectTabsHTML = '<button class="subject-tab active" data-subject="all" onclick="filterBooksBySubject(\'all\')">All Subjects</button>';
    subjects.forEach(function (subj) {
      var activeClass = subjectFilter && subjectFilter.toLowerCase() === subj.toLowerCase() ? ' active' : '';
      if (activeClass) activeSubject = subj;
      var slug = subj.toLowerCase().replace(/\s+/g, '-');
      subjectTabsHTML +=
        '<button class="subject-tab' + activeClass + '" data-subject="' + sanitizeAttr(slug) + '" onclick="filterBooksBySubject(\'' + sanitizeAttr(slug) + '\')">' +
          sanitizeHTML(subj) +
        '</button>';
    });
    subjectTabsContainer.innerHTML = subjectTabsHTML;
  }

  var searchInput = document.getElementById('books-search-input');
  if (searchInput && searchTerm) {
    searchInput.value = searchTerm;
  }

  filterAndRenderBooks();
}

function getUniqueSubjects(books) {
  var subjectSet = {};
  var subjects = [];
  books.forEach(function (book) {
    if (book.subject && !subjectSet[book.subject]) {
      subjectSet[book.subject] = true;
      subjects.push(book.subject);
    }
  });
  return subjects.sort();
}

function filterBooksByCategory(categoryId) {
  document.querySelectorAll('.category-tab').forEach(function (tab) {
    tab.classList.remove('active');
    if (tab.getAttribute('data-category') === categoryId) {
      tab.classList.add('active');
    }
  });

  if (categoryId !== 'all') {
    updateURLParam('category', categoryId);
    updateURLParam('page', '1');
  } else {
    var url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('cat');
    url.searchParams.delete('page');
    window.history.replaceState({}, '', url.toString());
  }

  filterAndRenderBooks();
}

function filterBooksBySubject(subjectId) {
  document.querySelectorAll('.subject-tab').forEach(function (tab) {
    tab.classList.remove('active');
    if (tab.getAttribute('data-subject') === subjectId) {
      tab.classList.add('active');
    }
  });

  if (subjectId !== 'all') {
    updateURLParam('subject', subjectId);
    updateURLParam('page', '1');
  } else {
    var url = new URL(window.location.href);
    url.searchParams.delete('subject');
    url.searchParams.delete('page');
    window.history.replaceState({}, '', url.toString());
  }

  filterAndRenderBooks();
}

function filterAndRenderBooks() {
  var container = document.getElementById('books-grid');
  if (!container) return;

  var books = typeof allBooks !== 'undefined' ? allBooks : [];
  var searchTerm = getQueryParam('search') || '';
  var categoryFilter = getQueryParam('category') || getQueryParam('cat') || 'all';
  var subjectFilter = getQueryParam('subject') || 'all';
  var currentPage = parseInt(getQueryParam('page'), 10) || 1;
  var booksPerPage = 12;

  var filtered = books.filter(function (book) {
    var matchesSearch = true;
    var matchesCategory = true;
    var matchesSubject = true;

    if (searchTerm) {
      var term = searchTerm.toLowerCase();
      matchesSearch =
        book.title.toLowerCase().indexOf(term) !== -1 ||
        book.author.toLowerCase().indexOf(term) !== -1 ||
        (book.category && book.category.toLowerCase().indexOf(term) !== -1) ||
        (book.subject && book.subject.toLowerCase().indexOf(term) !== -1);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      matchesCategory = book.category &&
        book.category.toLowerCase().replace(/\s+/g, '-') === categoryFilter.toLowerCase();
    }

    if (subjectFilter && subjectFilter !== 'all') {
      matchesSubject = book.subject &&
        book.subject.toLowerCase().replace(/\s+/g, '-') === subjectFilter.toLowerCase();
    }

    return matchesSearch && matchesCategory && matchesSubject;
  });

  var resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = filtered.length + ' book' + (filtered.length !== 1 ? 's' : '') + ' found';
  }

  var totalPages = Math.ceil(filtered.length / booksPerPage);
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  var startIndex = (currentPage - 1) * booksPerPage;
  var pageBooks = filtered.slice(startIndex, startIndex + booksPerPage);

  showSkeletonLoading('books-grid', Math.min(pageBooks.length || 8, booksPerPage));

  setTimeout(function () {
    if (pageBooks.length === 0) {
      container.innerHTML =
        '<div class="no-books-found">' +
          '<i class="fa fa-search no-books-icon"></i>' +
          '<h3>No books found</h3>' +
          '<p>Try adjusting your search or filter criteria.</p>' +
        '</div>';
    } else {
      var html = '';
      pageBooks.forEach(function (book) {
        html += renderBookCard(book);
      });
      container.innerHTML = html;
      initScrollReveal();
    }

    renderPagination(filtered.length, currentPage, booksPerPage);
  }, 300);
}

function initBooksSearch() {
  var searchInput = document.getElementById('books-search-input');
  var searchForm = document.getElementById('books-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var term = searchInput ? searchInput.value.trim() : '';
      if (term) {
        updateURLParam('search', term);
      } else {
        var url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url.toString());
      }
      updateURLParam('page', '1');
      filterAndRenderBooks();
    });
  }
  if (searchInput) {
    var debouncedSearch = debounce(function () {
      var term = searchInput.value.trim();
      if (term) {
        updateURLParam('search', term);
      } else {
        var url = new URL(window.location.href);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url.toString());
      }
      updateURLParam('page', '1');
      filterAndRenderBooks();
    }, 300);
    searchInput.addEventListener('input', debouncedSearch);
  }
}

/* ========================================
   New Releases Page
   ======================================== */

function renderNewReleasesPage() {
  var container = document.getElementById('new-releases-grid');
  if (!container) return;
  var books = typeof newReleases !== 'undefined' ? newReleases : [];
  var html = '';
  books.forEach(function (book) {
    html += renderBookCard(book, { showButtons: true });
  });
  container.innerHTML = html;
}

/* ========================================
   Cart System
   ======================================== */

function getCartItems() {
  return JSON.parse(localStorage.getItem('librivista_cart') || '[]');
}

function setCartItems(items) {
  localStorage.setItem('librivista_cart', JSON.stringify(items));
  updateCartBadge();
}

function getCartCount() {
  var items = getCartItems();
  var count = 0;
  items.forEach(function (item) {
    count += item.quantity || 1;
  });
  return count;
}

function updateCartBadge() {
  var badge = document.getElementById('cart-badge');
  var count = getCartCount();
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
  }
}

function handleAddToCart(bookId) {
  var books = typeof allBooks !== 'undefined' ? allBooks : [];
  var book = null;
  for (var i = 0; i < books.length; i++) {
    if (String(books[i]._id || books[i].id) === String(bookId)) {
      book = books[i];
      break;
    }
  }

  if (!book) {
    var featured = typeof featuredBooks !== 'undefined' ? featuredBooks : [];
    var newRel = typeof newReleases !== 'undefined' ? newReleases : [];
    var combined = featured.concat(newRel);
    for (var j = 0; j < combined.length; j++) {
      if (String(combined[j].id) === String(bookId)) {
        book = combined[j];
        break;
      }
    }
  }

  if (!book) {
    showToast('Book not found.', 'error');
    return;
  }

  var cartItems = getCartItems();
  var found = false;
  for (var k = 0; k < cartItems.length; k++) {
    if (String(cartItems[k].id) === String(bookId)) {
      cartItems[k].quantity = (cartItems[k].quantity || 1) + 1;
      found = true;
      break;
    }
  }

  if (!found) {
    cartItems.push({
      id: book._id || book.id,
      title: book.title || 'Untitled',
      author: book.author || 'Unknown',
      price: book.price || 0,
      coverImage: book.coverImage || book.image || 'images/books/book_subject_generic.svg',
      category: book.category || '',
      quantity: 1
    });
  }

  setCartItems(cartItems);
  showToast('"' + book.title + '" added to cart!', 'success');
}

function removeFromCart(bookId) {
  var cartItems = getCartItems();
  var updated = [];
  for (var i = 0; i < cartItems.length; i++) {
    if (String(cartItems[i].id) !== String(bookId)) {
      updated.push(cartItems[i]);
    }
  }
  setCartItems(updated);
  showToast('Item removed from cart.', 'info');
}

function updateCartItemQuantity(bookId, quantity) {
  if (quantity < 1) {
    removeFromCart(bookId);
    return;
  }
  var cartItems = getCartItems();
  for (var i = 0; i < cartItems.length; i++) {
    if (String(cartItems[i].id) === String(bookId)) {
      cartItems[i].quantity = quantity;
      break;
    }
  }
  setCartItems(cartItems);
}

function getCartTotal() {
  var items = getCartItems();
  var total = 0;
  items.forEach(function (item) {
    total += (item.price || 0) * (item.quantity || 1);
  });
  return total;
}

function handleBorrowBook(bookId) {
  if (!Auth.isAuthenticated) {
    showToast('Please sign in to borrow books.', 'warning');
    var base = getBasePath();
    setTimeout(function() { window.location.href = base + 'library/auth/login/index.html'; }, 800);
    return;
  }
  showToast('Book borrow request submitted!', 'success');
}

function handleQuickView(bookId) {
  showBookDetail(bookId);
}

/* ========================================
   Auth Event Handlers
   ======================================== */

function handleAccountClick() {
  if (Auth.isAuthenticated) {
    var base = getBasePath();
    window.location.href = base + 'library/profile/index.html';
  } else {
    var base = getBasePath();
    window.location.href = base + 'library/auth/login/index.html';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  var emailInput = document.getElementById('login-email');
  var passwordInput = document.getElementById('login-password');
  var errorEl = document.getElementById('login-error');

  var email = emailInput ? emailInput.value.trim() : '';
  var password = passwordInput ? passwordInput.value : '';

  var result = await Auth.login(email, password);

  if (result.success) {
    showToast('Login successful! Welcome back.', 'success');
    setTimeout(function () {
      window.location.reload();
    }, 500);
  } else {
    if (errorEl) {
      errorEl.textContent = result.message;
      errorEl.style.display = 'block';
    }
  }
}

function showRegisterForm() {
  var base = getBasePath();
  window.location.href = base + 'library/auth/signup/index.html';
}

function showLoginForm() {
  var base = getBasePath();
  window.location.href = base + 'library/auth/login/index.html';
}

async function handleRegister(e) {
  e.preventDefault();
  var nameInput = document.getElementById('reg-name');
  var emailInput = document.getElementById('reg-email');
  var phoneInput = document.getElementById('reg-phone');
  var usernameInput = document.getElementById('reg-username');
  var passwordInput = document.getElementById('reg-password');
  var confirmInput = document.getElementById('reg-confirm-password');
  var errorEl = document.getElementById('register-error');

  var data = {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    username: usernameInput ? usernameInput.value.trim() : '',
    password: passwordInput ? passwordInput.value : '',
    confirmPassword: confirmInput ? confirmInput.value : ''
  };

  if (!data.name || !data.email || !data.username || !data.password) {
    if (errorEl) {
      errorEl.textContent = 'Please fill in all required fields.';
      errorEl.style.display = 'block';
    }
    return;
  }

  var result = await Auth.register(data);

  if (result.success) {
    showToast('Registration successful! Welcome to Saraswati Library.', 'success');
    setTimeout(function () {
      window.location.reload();
    }, 500);
  } else {
    if (errorEl) {
      errorEl.textContent = 'Registration failed. Please try again.';
      errorEl.style.display = 'block';
    }
  }
}

/* ========================================
   Admin Login Handler
   ======================================== */

async function handleAdminLogin(e) {
  e.preventDefault();
  var usernameInput = document.getElementById('admin-username') || document.getElementById('admin-username-static');
  var passwordInput = document.getElementById('admin-password') || document.getElementById('admin-password-static');
  var errorEl = document.getElementById('admin-login-error') || document.getElementById('admin-login-error-static');

  var username = usernameInput ? usernameInput.value.trim() : '';
  var password = passwordInput ? passwordInput.value : '';

  var result = await Auth.loginAdmin(username, password);

  if (result.success) {
    showToast('Admin access granted! Redirecting...', 'success');
    closeModal('admin-login-modal');
    var staticModal = document.getElementById('admin-login-modal-static');
    if (staticModal) staticModal.style.display = 'none';
    var base = typeof getBasePath === 'function' ? getBasePath() : '';
    setTimeout(function () {
      window.location.href = base + 'admin/index.html';
    }, 800);
  } else {
    if (errorEl) {
      errorEl.textContent = result.message;
      errorEl.style.display = 'block';
    }
  }
}

/* ========================================
   Counter Animation
   ======================================== */

function initCounterAnimation() {
  var counters = document.querySelectorAll('.stat-value');
  if (counters.length === 0) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

function animateCounter(el) {
  var text = el.textContent.trim();
  var hasPlus = text.indexOf('+') !== -1;
  var hasComma = text.indexOf(',') !== -1;
  var numStr = text.replace(/[^0-9]/g, '');
  var target = parseInt(numStr, 10);
  if (isNaN(target)) return;

  var duration = 2000;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(eased * target);

    var display = '';
    if (hasComma) {
      display = current.toLocaleString();
    } else {
      display = current.toString();
    }
    if (hasPlus) display += '+';
    if (text.indexOf('/') !== -1) display += text.substring(text.indexOf('/'));
    el.textContent = display;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = text;
    }
  }

  requestAnimationFrame(step);
}

/* ========================================
   Ebooks Page Renderer
   ======================================== */

function renderEbooksPage() {
  var container = document.getElementById('ebooks-grid');
  if (!container) return;
  var books = typeof ebooks !== 'undefined' ? ebooks : [];
  var base = getBasePath();
  var html = '';
  books.forEach(function (book) {
    html +=
      '<div class="ebook-card scroll-reveal">' +
        '<div class="ebook-card-image">' +
          '<img src="' + base + sanitizeAttr(book.image) + '" alt="' + sanitizeAttr(book.title) + '" loading="lazy">' +
          '<span class="ebook-format-badge">' + sanitizeHTML(book.format) + '</span>' +
        '</div>' +
        '<div class="ebook-card-body">' +
          '<h4 class="ebook-title">' + sanitizeHTML(book.title) + '</h4>' +
          '<p class="ebook-author">' + sanitizeHTML(book.author) + '</p>' +
          '<div class="ebook-meta">' +
            '<span><i class="fa fa-file"></i> ' + sanitizeHTML(book.format) + '</span>' +
            '<span><i class="fa fa-database"></i> ' + sanitizeHTML(book.size) + '</span>' +
          '</div>' +
          '<a href="' + base + sanitizeAttr(book.file) + '" class="btn btn-primary btn-block ebook-download-btn" download>' +
            '<i class="fa fa-download"></i> Download' +
          '</a>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Library Page Stats Renderer
   ======================================== */

function renderLibraryStats() {
  var container = document.getElementById('library-stats');
  if (!container) return;
  var stats = typeof statsData !== 'undefined' ? statsData : [];
  var html = '';
  stats.forEach(function (stat) {
    html +=
      '<div class="library-stat-item">' +
        '<i class="' + sanitizeAttr(stat.icon) + '"></i>' +
        '<div class="library-stat-info">' +
          '<span class="library-stat-value">' + sanitizeHTML(stat.value) + '</span>' +
          '<span class="library-stat-label">' + sanitizeHTML(stat.label) + '</span>' +
        '</div>' +
      '</div>';
  });
  container.innerHTML = html;
}

/* ========================================
   Page Initialization
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  updateThemeIcon();
  initNavbarScroll();
  initScrollReveal();
  updateCartBadge();
  initCounterAnimation();
  if (typeof initNotifBadge === 'function') initNotifBadge();

  var page = document.body.getAttribute('data-page');
  if (!page) return;

  switch (page) {
    case 'home':
      renderNavbar('home');
      renderFooter();
      initHeroSlider();
      renderFeaturedBooks();
      renderCategories();
      renderStats();
      renderTestimonials();
      renderNewReleases();
      renderArticles();
      break;

    case 'library':
      renderNavbar('library');
      renderFooter();
      renderLibraryStats();
      renderCategories();
      break;

    case 'class':
      renderNavbar('library');
      renderFooter();
      break;

    case 'books':
      renderNavbar('books');
      renderFooter();
      renderBooksPage();
      initBooksSearch();
      break;

    case 'new-release':
      renderNavbar('new-release');
      renderFooter();
      renderNewReleasesPage();
      break;

    case 'about':
      renderNavbar('about');
      renderFooter();
      renderTeamMembers();
      renderStats();
      break;

    case 'contact':
      renderNavbar('contact');
      renderFooter();
      renderContactInfo();
      break;

    case 'blog':
      renderNavbar('blog');
      renderFooter();
      renderArticles();
      break;

    case 'developer':
      renderNavbar('developer');
      renderFooter();
      renderTeamMembers();
      break;

    case 'faq':
    case 'faqs':
      renderNavbar('faqs');
      renderFooter();
      renderFAQs();
      break;

    case 'privacy':
      renderNavbar('privacy');
      renderFooter();
      break;

    case 'terms':
      renderNavbar('terms');
      renderFooter();
      break;

    case 'cart':
      renderNavbar('cart');
      renderFooter();
      break;

    case 'account':
      renderNavbar('account');
      renderFooter();
      break;

    default:
      renderNavbar('home');
      renderFooter();
      break;
  }
});

/* ============================================
   Scroll Reveal Animation (Global Observer)
   ============================================ */
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.scroll-reveal').forEach(function(el) {
    observer.observe(el);
  });
})();

/* ============================================
   Lazy Loading Images
   ============================================ */
(function() {
  var imgObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.addEventListener('load', function() {
          img.classList.add('loaded');
        });
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('img[data-src]').forEach(function(img) {
    imgObserver.observe(img);
  });
})();
