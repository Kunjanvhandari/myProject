/* ========================================
   Notifications Module - Admin Notifications
   ======================================== */

if (typeof Notifications === 'undefined') {

  var Notifications = {

    getAll: function() {
      return JSON.parse(localStorage.getItem('sl_notifications') || '[]');
    },

    save: function(notifications) {
      localStorage.setItem('sl_notifications', JSON.stringify(notifications));
    },

    add: function(type, title, message, relatedUserId) {
      var notifications = this.getAll();
      notifications.unshift({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        type: type,
        title: title,
        message: message,
        relatedUserId: relatedUserId || '',
        global: false,
        read: false,
        createdAt: new Date().toISOString()
      });
      if (notifications.length > 500) {
        notifications = notifications.slice(0, 500);
      }
      this.save(notifications);
      this.updateBadge();
    },

    addGlobal: function(type, title, message) {
      var notifications = this.getAll();
      notifications.unshift({
        id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        type: type,
        title: title,
        message: message,
        relatedUserId: '',
        global: true,
        read: false,
        createdAt: new Date().toISOString()
      });
      if (notifications.length > 500) {
        notifications = notifications.slice(0, 500);
      }
      this.save(notifications);
      this.updateBadge();
    },

    getForUser: function(userId) {
      if (!userId) return [];
      var uid = String(userId);
      return this.getAll().filter(function(n) {
        return n.global || String(n.relatedUserId) === uid;
      });
    },

    getGlobal: function() {
      return this.getAll().filter(function(n) {
        return !!n.global;
      });
    },

    getRecent: function(count) {
      count = count || 10;
      var all = this.getAll();
      return all.slice(0, count);
    },

    getToday: function() {
      var todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      var todayTime = todayStart.getTime();
      return this.getAll().filter(function(n) {
        if (!n.createdAt) return false;
        return new Date(n.createdAt).getTime() >= todayTime;
      });
    },

    getUnread: function() {
      return this.getAll().filter(function(n) { return !n.read; });
    },

    getUnreadCount: function() {
      return this.getUnread().length;
    },

    markAsRead: function(notifId) {
      var notifications = this.getAll();
      var idx = notifications.findIndex(function(n) { return n.id === notifId; });
      if (idx >= 0) {
        notifications[idx].read = true;
        this.save(notifications);
      }
      this.updateBadge();
    },

    markAllAsRead: function() {
      var notifications = this.getAll();
      notifications.forEach(function(n) { n.read = true; });
      this.save(notifications);
      this.updateBadge();
    },

    clearAll: function() {
      this.save([]);
      this.updateBadge();
    },

    delete: function(notifId) {
      var notifications = this.getAll();
      notifications = notifications.filter(function(n) { return n.id !== notifId; });
      this.save(notifications);
      this.updateBadge();
    },

    updateBadge: function() {
      var badge = document.getElementById('notif-badge');
      if (!badge) return;
      var count = this.getUnreadCount();
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    },

    getIcon: function(type) {
      var icons = {
        'user_register': 'fa-user-plus',
        'user_login': 'fa-sign-in-alt',
        'user_profile_update': 'fa-user-edit',
        'user_profile_photo': 'fa-camera',
        'user_suspend': 'fa-user-lock',
        'user_activate': 'fa-user-check',
        'book_add': 'fa-book',
        'book_delete': 'fa-trash',
        'book_reserve': 'fa-bookmark',
        'book_borrow': 'fa-hand-holding',
        'book_return': 'fa-undo',
        'contact_form': 'fa-envelope',
        'system': 'fa-cog',
        'announcement': 'fa-bullhorn'
      };
      return icons[type] || 'fa-bell';
    },

    getColor: function(type) {
      var colors = {
        'user_register': '#22C55E',
        'user_login': '#3B82F6',
        'user_profile_update': '#8B5CF6',
        'user_profile_photo': '#EC4899',
        'user_suspend': '#EF4444',
        'user_activate': '#22C55E',
        'book_add': '#0EA5E9',
        'book_delete': '#EF4444',
        'book_reserve': '#F59E0B',
        'book_borrow': '#F97316',
        'book_return': '#22C55E',
        'contact_form': '#6366F1',
        'system': '#6B7280',
        'announcement': '#3B82F6'
      };
      return colors[type] || 'var(--accent)';
    },

    getStats: function() {
      var all = this.getAll();
      var now = Date.now();
      var day = 24 * 60 * 60 * 1000;
      return {
        total: all.length,
        unread: all.filter(function(n) { return !n.read; }).length,
        global: all.filter(function(n) { return !!n.global; }).length,
        today: all.filter(function(n) {
          return n.createdAt && (now - new Date(n.createdAt).getTime()) < day;
        }).length,
        thisWeek: all.filter(function(n) {
          return n.createdAt && (now - new Date(n.createdAt).getTime()) < 7 * day;
        }).length
      };
    }
  };
}
