/* ========================================
   Users Module - User Management
   ======================================== */

if (typeof Users === 'undefined') {

  var Users = {

    getAll: function() {
      return Auth.getAllUsers();
    },

    getById: function(id) {
      return Auth.getUserById(id);
    },

    getByRole: function(role) {
      return this.getAll().filter(function(u) { return u.role === role; });
    },

    getByStatus: function(status) {
      return this.getAll().filter(function(u) {
        if (status === 'active') {
          return !u.suspended;
        } else if (status === 'suspended') {
          return !!u.suspended;
        }
        return true;
      });
    },

    search: function(query) {
      if (!query) return this.getAll();
      var q = query.toLowerCase().trim();
      return this.getAll().filter(function(u) {
        return (u.name && u.name.toLowerCase().indexOf(q) !== -1) ||
               (u.email && u.email.toLowerCase().indexOf(q) !== -1) ||
               (u.username && u.username.toLowerCase().indexOf(q) !== -1) ||
               (u.phone && u.phone.indexOf(q) !== -1);
      });
    },

    update: function(userId, updates) {
      return Auth.updateProfile(userId, updates);
    },

    delete: function(userId) {
      var user = Auth.getUserById(userId);
      if (user && user.role === 'admin') {
        return { success: false, message: 'Cannot delete admin account.' };
      }
      return Auth.deleteUser(userId);
    },

    suspendUser: function(userId) {
      var user = Auth.getUserById(userId);
      if (!user) {
        return { success: false, message: 'User not found.' };
      }
      if (user.role === 'admin') {
        return { success: false, message: 'Cannot suspend admin account.' };
      }
      var result = Auth.updateProfile(userId, { suspended: true, suspendedAt: new Date().toISOString() });
      if (result && result.success !== false) {
        if (typeof Notifications !== 'undefined') {
          Notifications.add('user_suspend', 'User Suspended', 'User ' + (user.name || user.username || userId) + ' has been suspended.', userId);
        }
      }
      return { success: true, message: 'User suspended.' };
    },

    activateUser: function(userId) {
      var user = Auth.getUserById(userId);
      if (!user) {
        return { success: false, message: 'User not found.' };
      }
      var result = Auth.updateProfile(userId, { suspended: false, suspendedAt: null });
      if (result && result.success !== false) {
        if (typeof Notifications !== 'undefined') {
          Notifications.add('user_activate', 'User Activated', 'User ' + (user.name || user.username || userId) + ' has been activated.', userId);
        }
      }
      return { success: true, message: 'User activated.' };
    },

    getStats: function() {
      var users = this.getAll();
      var now = Date.now();
      var day = 24 * 60 * 60 * 1000;
      return {
        total: users.length,
        admins: users.filter(function(u) { return u.role === 'admin'; }).length,
        regularUsers: users.filter(function(u) { return u.role !== 'admin'; }).length,
        suspended: users.filter(function(u) { return !!u.suspended; }).length,
        newThisWeek: users.filter(function(u) {
          return u.joinedAt && (now - new Date(u.joinedAt).getTime()) < 7 * day;
        }).length,
        activeToday: users.filter(function(u) {
          return u.lastActive && (now - new Date(u.lastActive).getTime()) < day;
        }).length
      };
    },

    getUserActivity: function(userId) {
      var user = Auth.getUserById(userId);
      if (!user) return [];
      return user.activities || [];
    },

    updateLastActive: function(userId) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      users[idx].lastActive = new Date().toISOString();
      Auth.saveAllUsers(users);
    },

    addActivity: function(userId, type, description) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      if (!users[idx].activities) users[idx].activities = [];
      users[idx].activities.unshift({
        type: type,
        description: description,
        timestamp: new Date().toISOString()
      });
      if (users[idx].activities.length > 100) {
        users[idx].activities = users[idx].activities.slice(0, 100);
      }
      Auth.saveAllUsers(users);
    },

    addBorrowedBook: function(userId, bookId) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      if (!users[idx].borrowedBooks) users[idx].borrowedBooks = [];
      users[idx].borrowedBooks.push({
        bookId: bookId,
        borrowedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });
      Auth.saveAllUsers(users);
      this.addActivity(userId, 'borrow', 'Borrowed book ' + bookId);
    },

    returnBook: function(userId, bookId) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      var borrowed = users[idx].borrowedBooks || [];
      var bookIdx = -1;
      for (var j = 0; j < borrowed.length; j++) {
        if (String(borrowed[j].bookId) === String(bookId)) {
          bookIdx = j;
          break;
        }
      }
      if (bookIdx === -1) return;
      var returned = borrowed.splice(bookIdx, 1)[0];
      if (!users[idx].readingHistory) users[idx].readingHistory = [];
      users[idx].readingHistory.push({
        bookId: bookId,
        borrowedAt: returned.borrowedAt,
        returnedAt: new Date().toISOString()
      });
      Auth.saveAllUsers(users);
      this.addActivity(userId, 'return', 'Returned book ' + bookId);
      if (typeof Notifications !== 'undefined') {
        Notifications.add('book_return', 'Book Returned', 'A book was returned.', userId);
      }
    },

    reserveBook: function(userId, bookId) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      if (!users[idx].reservedBooks) users[idx].reservedBooks = [];
      var alreadyReserved = false;
      for (var j = 0; j < users[idx].reservedBooks.length; j++) {
        if (String(users[idx].reservedBooks[j].bookId) === String(bookId)) {
          alreadyReserved = true;
          break;
        }
      }
      if (alreadyReserved) return;
      users[idx].reservedBooks.push({
        bookId: bookId,
        reservedAt: new Date().toISOString()
      });
      Auth.saveAllUsers(users);
      this.addActivity(userId, 'reserve', 'Reserved book ' + bookId);
      if (typeof Notifications !== 'undefined') {
        Notifications.add('book_reserve', 'Book Reserved', 'A book was reserved.', userId);
      }
    },

    addDownload: function(userId, bookId) {
      var users = Auth.getAllUsers();
      var idx = -1;
      for (var i = 0; i < users.length; i++) {
        if (String(users[i].id) === String(userId)) {
          idx = i;
          break;
        }
      }
      if (idx === -1) return;
      if (!users[idx].downloadedBooks) users[idx].downloadedBooks = [];
      var alreadyDownloaded = false;
      for (var j = 0; j < users[idx].downloadedBooks.length; j++) {
        if (String(users[idx].downloadedBooks[j].bookId) === String(bookId)) {
          alreadyDownloaded = true;
          break;
        }
      }
      if (!alreadyDownloaded) {
        users[idx].downloadedBooks.push({
          bookId: bookId,
          downloadedAt: new Date().toISOString()
        });
        Auth.saveAllUsers(users);
      }
    }
  };
}
