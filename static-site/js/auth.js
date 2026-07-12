/* ========================================
   Auth Module - Secure Authentication System
   ======================================== */

if (typeof Auth === 'undefined') {

  var ADMIN_USERNAME = 'admin';
  var ADMIN_PASSWORD_HASH = null;

  var Auth = {

    hashPassword: async function(password, salt) {
      if (!salt) salt = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      var encoder = new TextEncoder();
      var data = encoder.encode(salt + password);
      var hashBuffer = await crypto.subtle.digest('SHA-256', data);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      var hashHex = hashArray.map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      return { hash: hashHex, salt: salt };
    },

    init: async function() {
      if (!ADMIN_PASSWORD_HASH) {
        var result = await this.hashPassword('kunjan1122');
        ADMIN_PASSWORD_HASH = result;
      }
    },

    getUser: function() {
      try {
        var token = localStorage.getItem('sl_session_token');
        if (!token) return null;
        var session = JSON.parse(localStorage.getItem('sl_sessions_' + token) || 'null');
        if (!session || session.expiresAt < Date.now()) {
          if (session) localStorage.removeItem('sl_sessions_' + token);
          localStorage.removeItem('sl_session_token');
          return null;
        }
        var users = this.getAllUsers();
        var user = users.find(function(u) { return u.id === session.userId; });
        if (!user) return null;
        if (user.status === 'suspended') return null;
        var safe = Object.assign({}, user);
        delete safe.passwordHash;
        delete safe.salt;
        return safe;
      } catch (e) { return null; }
    },

    getAllUsers: function() {
      return JSON.parse(localStorage.getItem('sl_users') || '[]');
    },

    saveAllUsers: function(users) {
      localStorage.setItem('sl_users', JSON.stringify(users));
    },

    getUserById: function(id) {
      return this.getAllUsers().find(function(u) { return u.id === id; }) || null;
    },

    setUser: function(user) {
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === user.id; });
      if (idx >= 0) users[idx] = user;
      else users.push(user);
      this.saveAllUsers(users);
    },

    get isAuthenticated() {
      return !!this.getUser();
    },

    get isAdmin() {
      var user = this.getUser();
      return user && user.role === 'admin';
    },

    _createSession: function(userId, remember) {
      var token = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      var duration = remember ? (30 * 24 * 60 * 60 * 1000) : (7 * 24 * 60 * 60 * 1000);
      var session = {
        userId: userId,
        createdAt: Date.now(),
        expiresAt: Date.now() + duration
      };
      localStorage.setItem('sl_sessions_' + token, JSON.stringify(session));
      localStorage.setItem('sl_session_token', token);
      return token;
    },

    updateLastActive: function(userId) {
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === userId; });
      if (idx >= 0) {
        users[idx].lastActive = new Date().toISOString();
        this.saveAllUsers(users);
      }
    },

    validatePhone: function(phone) {
      if (!phone || !phone.trim()) return true;
      var phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
      return phoneRegex.test(phone.trim());
    },

    uploadProfilePhoto: function(userId, file) {
      var self = this;
      return new Promise(function(resolve, reject) {
        if (!file) {
          reject({ success: false, message: 'No file provided.' });
          return;
        }
        var allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.indexOf(file.type) === -1) {
          reject({ success: false, message: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP.' });
          return;
        }
        var maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          reject({ success: false, message: 'File size must be less than 2MB.' });
          return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
          var result = self.updateProfile(userId, { profilePhoto: e.target.result });
          resolve(result);
        };
        reader.onerror = function() {
          reject({ success: false, message: 'Failed to read file.' });
        };
        reader.readAsDataURL(file);
      });
    },

    generateResetToken: function(email) {
      if (!email) return { success: false, message: 'Please provide an email address.' };
      var users = this.getAllUsers();
      var query = email.toLowerCase().trim();
      var user = users.find(function(u) { return u.email && u.email.toLowerCase() === query; });
      if (!user) {
        return { success: true, message: 'If an account with that email exists, a reset token has been generated.' };
      }
      var token = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
      var resetData = {
        token: token,
        userId: user.id,
        email: user.email,
        createdAt: Date.now(),
        expiresAt: Date.now() + (60 * 60 * 1000)
      };
      var keys = Object.keys(localStorage);
      keys.forEach(function(key) {
        if (key.indexOf('sl_reset_') === 0) {
          try {
            var data = JSON.parse(localStorage.getItem(key));
            if (data && data.userId === user.id) {
              localStorage.removeItem(key);
            }
          } catch (e) {}
        }
      });
      localStorage.setItem('sl_reset_' + token, JSON.stringify(resetData));
      return { success: true, message: 'Reset token generated.', token: token, userId: user.id };
    },

    validateResetToken: function(token) {
      if (!token) return { success: false, message: 'No token provided.' };
      var data = JSON.parse(localStorage.getItem('sl_reset_' + token) || 'null');
      if (!data) return { success: false, message: 'Invalid or expired reset token.' };
      if (data.expiresAt < Date.now()) {
        localStorage.removeItem('sl_reset_' + token);
        return { success: false, message: 'Reset token has expired.' };
      }
      return { success: true, userId: data.userId, email: data.email };
    },

    resetPassword: async function(token, newPassword) {
      if (!token || !newPassword) {
        return { success: false, message: 'Token and new password are required.' };
      }
      if (newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }
      var validation = this.validateResetToken(token);
      if (!validation.success) return validation;
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === validation.userId; });
      if (idx === -1) return { success: false, message: 'User not found.' };
      var newResult = await this.hashPassword(newPassword);
      users[idx].passwordHash = newResult.hash;
      users[idx].salt = newResult.salt;
      users[idx].lastActive = new Date().toISOString();
      this.saveAllUsers(users);
      localStorage.removeItem('sl_reset_' + token);
      var keys = Object.keys(localStorage);
      var uid = validation.userId;
      keys.forEach(function(key) {
        if (key.indexOf('sl_sessions_') === 0) {
          try {
            var session = JSON.parse(localStorage.getItem(key));
            if (session && session.userId === uid) {
              localStorage.removeItem(key);
            }
          } catch (e) {}
        }
      });
      return { success: true, message: 'Password has been reset successfully.' };
    },

    login: async function(emailOrUsername, password, remember) {
      if (!emailOrUsername || !password) {
        return { success: false, message: 'Please enter your credentials.' };
      }
      await this.init();
      var users = this.getAllUsers();
      var query = emailOrUsername.toLowerCase().trim();
      var user = users.find(function(u) {
        return (u.email && u.email.toLowerCase() === query) ||
               (u.username && u.username.toLowerCase() === query);
      });
      if (!user) {
        return { success: false, message: 'No account found with that email or username.' };
      }
      if (user.status === 'suspended') {
        return { success: false, message: 'Your account has been suspended. Please contact an administrator.' };
      }
      var result = await this.hashPassword(password, user.salt);
      if (result.hash !== user.passwordHash) {
        return { success: false, message: 'Incorrect password. Please try again.' };
      }
      user.lastLogin = new Date().toISOString();
      user.lastActive = new Date().toISOString();
      user.loginCount = (user.loginCount || 0) + 1;
      this.setUser(user);
      this._createSession(user.id, !!remember);
      if (typeof Users !== 'undefined') {
        Users.addActivity(user.id, 'login', 'Logged in');
      }
      if (typeof Notifications !== 'undefined' && user.role !== 'admin') {
        Notifications.add('user_login', 'User Login', (user.name || user.username) + ' logged in.', user.id);
      }
      return { success: true, user: user };
    },

    loginAdmin: async function(username, password) {
      if (!username || !password) {
        return { success: false, message: 'Please enter admin credentials.' };
      }
      await this.init();
      if (username.toLowerCase().trim() !== ADMIN_USERNAME) {
        return { success: false, message: 'Invalid admin username.' };
      }
      var result = await this.hashPassword(password, ADMIN_PASSWORD_HASH.salt);
      if (result.hash !== ADMIN_PASSWORD_HASH.hash) {
        return { success: false, message: 'Incorrect admin password.' };
      }
      var users = this.getAllUsers();
      var admin = users.find(function(u) { return u.role === 'admin'; });
      if (!admin) {
        admin = this._createAdminUser();
      }
      admin.lastLogin = new Date().toISOString();
      admin.lastActive = new Date().toISOString();
      admin.loginCount = (admin.loginCount || 0) + 1;
      this.setUser(admin);
      this._createSession(admin.id, false);
      return { success: true, user: admin };
    },

    register: async function(data) {
      if (!data || !data.name || !data.email || !data.username || !data.password) {
        return { success: false, message: 'Please fill in all required fields.' };
      }
      if (data.password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
      if (data.password !== data.confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
      }
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, message: 'Please enter a valid email address.' };
      }
      if (data.phone && data.phone.trim() && !this.validatePhone(data.phone)) {
        return { success: false, message: 'Please enter a valid phone number (e.g., +977-9841234567).' };
      }
      var users = this.getAllUsers();
      var emailExists = users.some(function(u) { return u.email.toLowerCase() === data.email.toLowerCase(); });
      if (emailExists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      var usernameExists = users.some(function(u) { return u.username.toLowerCase() === data.username.toLowerCase(); });
      if (usernameExists) {
        return { success: false, message: 'This username is already taken.' };
      }
      var result = await this.hashPassword(data.password);
      var userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      var user = {
        id: userId,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        username: data.username.trim().toLowerCase(),
        phone: (data.phone || '').trim(),
        role: 'user',
        status: 'active',
        passwordHash: result.hash,
        salt: result.salt,
        profilePhoto: '',
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        loginCount: 1,
        borrowedBooks: [],
        reservedBooks: [],
        readingHistory: [],
        downloadedBooks: [],
        activities: []
      };
      users.push(user);
      this.saveAllUsers(users);
      this._createSession(userId, !!data.remember);
      if (typeof Users !== 'undefined') {
        Users.addActivity(userId, 'register', 'Account created');
      }
      if (typeof Notifications !== 'undefined') {
        Notifications.add('user_register', 'New User', (user.name || user.username) + ' registered.', userId);
      }
      return { success: true, user: user };
    },

    updateProfile: function(userId, updates) {
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === userId; });
      if (idx === -1) return { success: false, message: 'User not found.' };
      var user = users[idx];
      if (updates.name) user.name = updates.name;
      if (updates.email) {
        var emailTaken = users.some(function(u, i) { return i !== idx && u.email && u.email.toLowerCase() === updates.email.toLowerCase(); });
        if (emailTaken) return { success: false, message: 'Email is already in use.' };
        user.email = updates.email.toLowerCase();
      }
      if (updates.phone !== undefined) {
        if (updates.phone && updates.phone.trim() && !this.validatePhone(updates.phone)) {
          return { success: false, message: 'Please enter a valid phone number.' };
        }
        user.phone = updates.phone;
      }
      if (updates.username) {
        var usernameTaken = users.some(function(u, i) { return i !== idx && u.username && u.username.toLowerCase() === updates.username.toLowerCase(); });
        if (usernameTaken) return { success: false, message: 'Username is already taken.' };
        user.username = updates.username.toLowerCase();
      }
      if (updates.profilePhoto !== undefined) user.profilePhoto = updates.profilePhoto;
      user.lastActive = new Date().toISOString();
      users[idx] = user;
      this.saveAllUsers(users);
      if (typeof Notifications !== 'undefined') {
        Notifications.add('user_profile_update', 'Profile Updated', (user.name || user.username) + ' updated their profile.', userId);
      }
      return { success: true, user: user };
    },

    changePassword: async function(userId, currentPassword, newPassword) {
      if (!currentPassword || !newPassword) {
        return { success: false, message: 'Please fill in all fields.' };
      }
      if (newPassword.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === userId; });
      if (idx === -1) return { success: false, message: 'User not found.' };
      var user = users[idx];
      var result = await this.hashPassword(currentPassword, user.salt);
      if (result.hash !== user.passwordHash) {
        return { success: false, message: 'Current password is incorrect.' };
      }
      var newResult = await this.hashPassword(newPassword);
      user.passwordHash = newResult.hash;
      user.salt = newResult.salt;
      user.lastActive = new Date().toISOString();
      users[idx] = user;
      this.saveAllUsers(users);
      return { success: true };
    },

    deleteProfilePhoto: function(userId) {
      return this.updateProfile(userId, { profilePhoto: '' });
    },

    logout: function() {
      var token = localStorage.getItem('sl_session_token');
      if (token) {
        localStorage.removeItem('sl_sessions_' + token);
        localStorage.removeItem('sl_session_token');
      }
      window.location.href = getBasePath() + 'index.html';
    },

    deleteUser: function(userId) {
      var users = this.getAllUsers();
      users = users.filter(function(u) { return u.id !== userId; });
      this.saveAllUsers(users);
      var keys = Object.keys(localStorage);
      keys.forEach(function(key) {
        if (key.indexOf('sl_sessions_') === 0) {
          try {
            var session = JSON.parse(localStorage.getItem(key));
            if (session && session.userId === userId) {
              localStorage.removeItem(key);
            }
          } catch (e) {}
        }
      });
      keys.forEach(function(key) {
        if (key.indexOf('sl_reset_') === 0) {
          try {
            var data = JSON.parse(localStorage.getItem(key));
            if (data && data.userId === userId) {
              localStorage.removeItem(key);
            }
          } catch (e) {}
        }
      });
      return { success: true };
    },

    suspendUser: function(userId) {
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === userId; });
      if (idx === -1) return { success: false, message: 'User not found.' };
      if (users[idx].role === 'admin') return { success: false, message: 'Cannot suspend an admin account.' };
      users[idx].status = 'suspended';
      users[idx].lastActive = new Date().toISOString();
      this.saveAllUsers(users);
      var keys = Object.keys(localStorage);
      var uid = userId;
      keys.forEach(function(key) {
        if (key.indexOf('sl_sessions_') === 0) {
          try {
            var session = JSON.parse(localStorage.getItem(key));
            if (session && session.userId === uid) {
              localStorage.removeItem(key);
            }
          } catch (e) {}
        }
      });
      return { success: true };
    },

    activateUser: function(userId) {
      var users = this.getAllUsers();
      var idx = users.findIndex(function(u) { return u.id === userId; });
      if (idx === -1) return { success: false, message: 'User not found.' };
      users[idx].status = 'active';
      users[idx].lastActive = new Date().toISOString();
      this.saveAllUsers(users);
      return { success: true };
    },

    _createAdminUser: function() {
      var users = this.getAllUsers();
      var existing = users.find(function(u) { return u.role === 'admin'; });
      if (existing) return existing;
      var userId = 'admin_' + Date.now();
      var admin = {
        id: userId,
        name: 'Head Admin',
        email: 'kunjanvhandari9@gmail.com',
        username: 'admin',
        phone: '+9779743962189',
        role: 'admin',
        status: 'active',
        passwordHash: ADMIN_PASSWORD_HASH.hash,
        salt: ADMIN_PASSWORD_HASH.salt,
        profilePhoto: '',
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        loginCount: 1,
        borrowedBooks: [],
        reservedBooks: [],
        readingHistory: [],
        downloadedBooks: [],
        activities: []
      };
      users.push(admin);
      this.saveAllUsers(users);
      return admin;
    },

    ensureAdminExists: async function() {
      await this.init();
      var users = this.getAllUsers();
      var admin = users.find(function(u) { return u.role === 'admin'; });
      if (!admin) {
        this._createAdminUser();
      }
    }
  };

  Auth.ensureAdminExists();
}
