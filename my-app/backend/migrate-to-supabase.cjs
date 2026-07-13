/**
 * MongoDB to Supabase Migration Script
 * 
 * Run: node migrate-to-supabase.js
 * 
 * Prerequisites:
 * 1. Run the SQL schema in Supabase SQL Editor first
 * 2. npm install @supabase/supabase-js mongoose
 * 3. Set environment variables in .env.migrate
 */

const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.migrate' });

// ============================================
// CONFIGURATION
// ============================================
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/librivista';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env.migrate');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// MONGOOSE SCHEMAS (minimal, for reading data)
// ============================================
const userSchema = new mongoose.Schema({}, { strict: false, collection: 'users', timestamps: true });
const bookSchema = new mongoose.Schema({}, { strict: false, collection: 'books', timestamps: true });
const borrowingSchema = new mongoose.Schema({}, { strict: false, collection: 'borrowings', timestamps: true });
const reservationSchema = new mongoose.Schema({}, { strict: false, collection: 'reservations', timestamps: true });
const fineSchema = new mongoose.Schema({}, { strict: false, collection: 'fines', timestamps: true });
const notificationSchema = new mongoose.Schema({}, { strict: false, collection: 'notifications', timestamps: true });
const contactSchema = new mongoose.Schema({}, { strict: false, collection: 'contacts', timestamps: true });

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Borrowing = mongoose.model('Borrowing', borrowingSchema);
const Reservation = mongoose.model('Reservation', reservationSchema);
const Fine = mongoose.model('Fine', fineSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const Contact = mongoose.model('Contact', contactSchema);

// ============================================
// ID MAPPING
// ============================================
const idMap = {
    users: new Map(),
    books: new Map(),
    borrowings: new Map(),
    reservations: new Map(),
    fines: new Map(),
    notifications: new Map(),
    contacts: new Map(),
};

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function mapId(collection, mongoId) {
    const strId = mongoId.toString();
    if (!idMap[collection].has(strId)) {
        idMap[collection].set(strId, generateUUID());
    }
    return idMap[collection].get(strId);
}

// ============================================
// HELPERS
// ============================================
function formatDate(date) {
    if (!date) return null;
    return new Date(date).toISOString();
}

function safeString(val, defaultVal = '') {
    if (val === null || val === undefined) return defaultVal;
    return String(val);
}

function safeNumber(val, defaultVal = 0) {
    if (val === null || val === undefined) return defaultVal;
    const n = Number(val);
    return isNaN(n) ? defaultVal : n;
}

function safeBool(val, defaultVal = false) {
    if (val === null || val === undefined) return defaultVal;
    return Boolean(val);
}

function batchSplit(rows, batchSize = 500) {
    const batches = [];
    for (let i = 0; i < rows.length; i += batchSize) {
        batches.push(rows.slice(i, i + batchSize));
    }
    return batches;
}

async function insertBatches(table, rows) {
    const batches = batchSplit(rows);
    let totalInserted = 0;
    
    for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        const { data, error } = await supabase.from(table).insert(batch);
        
        if (error) {
            console.error(`  ERROR inserting batch ${i + 1}/${batches.length} into ${table}:`, error.message);
            // Try inserting one by one to find the problematic record
            for (const row of batch) {
                const { error: singleError } = await supabase.from(table).insert([row]);
                if (singleError) {
                    console.error(`    Failed row:`, JSON.stringify(row).substring(0, 200));
                    console.error(`    Error:`, singleError.message);
                } else {
                    totalInserted++;
                }
            }
        } else {
            totalInserted += batch.length;
        }
        
        if (batches.length > 1) {
            process.stdout.write(`  Progress: ${totalInserted}/${rows.length}\r`);
        }
    }
    
    return totalInserted;
}

// ============================================
// MIGRATION FUNCTIONS
// ============================================

async function migrateUsers() {
    console.log('\n=== Migrating Users ===');
    const users = await User.find({}).lean();
    console.log(`  Found ${users.length} users`);

    const rows = users.map(u => {
        const newId = mapId('users', u._id);
        
        // Handle wishlist (array of ObjectIds -> array of UUIDs)
        const wishlist = (u.wishlist || []).map(bookId => mapId('books', bookId));
        
        // Handle embedded notifications
        const notificationsEmbed = (u.notifications || []).map(n => ({
            title: n.title || '',
            message: n.message || '',
            type: n.type || 'info',
            isRead: n.isRead || false,
            createdAt: formatDate(n.createdAt),
        }));

        return {
            id: newId,
            name: safeString(u.name),
            username: u.username || null,
            email: safeString(u.email).toLowerCase(),
            password: safeString(u.password),
            phone: safeString(u.phone),
            address: safeString(u.address),
            membership_type: safeString(u.membershipType, 'Free'),
            membership_id: u.membershipId || null,
            membership_expiry: formatDate(u.membershipExpiry),
            student_id: safeString(u.studentId),
            profile_image: safeString(u.profileImage),
            role: safeString(u.role, 'user'),
            is_active: safeBool(u.isActive, true),
            books_borrowed: safeNumber(u.booksBorrowed),
            books_returned: safeNumber(u.booksReturned),
            currently_borrowed: safeNumber(u.currentlyBorrowed),
            reservations: safeNumber(u.reservations),
            notifications_embed: notificationsEmbed,
            created_at: formatDate(u.createdAt),
            updated_at: formatDate(u.updatedAt),
        };
    });

    const inserted = await insertBatches('users', rows);
    console.log(`  Migrated ${inserted} users`);
    return rows;
}

async function migrateBooks() {
    console.log('\n=== Migrating Books ===');
    const books = await Book.find({}).lean();
    console.log(`  Found ${books.length} books`);

    const rows = books.map(b => {
        const newId = mapId('books', b._id);
        
        return {
            id: newId,
            title: safeString(b.title),
            author: safeString(b.author),
            isbn: b.isbn || null,
            description: safeString(b.description),
            category: safeString(b.category),
            subcategory: safeString(b.subcategory),
            publisher: safeString(b.publisher),
            publish_year: b.publishYear || null,
            edition: safeString(b.edition),
            language: safeString(b.language, 'English'),
            pages: safeNumber(b.pages),
            price: safeNumber(b.price),
            total_copies: safeNumber(b.totalCopies, 1),
            available_copies: safeNumber(b.availableCopies, 1),
            cover_image: safeString(b.coverImage, '/images/footer/book22.png'),
            tags: b.tags || [],
            rating: safeNumber(b.rating),
            rating_count: safeNumber(b.ratingCount),
            borrow_count: safeNumber(b.borrowCount),
            badge: safeString(b.badge),
            is_featured: safeBool(b.isFeatured),
            is_new_release: safeBool(b.isNewRelease),
            status: safeString(b.status, 'available'),
            source_url: safeString(b.sourceUrl),
            source: safeString(b.source),
            chapters: b.chapters || [],
            created_at: formatDate(b.createdAt),
            updated_at: formatDate(b.updatedAt),
        };
    });

    const inserted = await insertBatches('books', rows);
    console.log(`  Migrated ${inserted} books`);
    return rows;
}

async function migrateBorrowings() {
    console.log('\n=== Migrating Borrowings ===');
    const borrowings = await Borrowing.find({}).lean();
    console.log(`  Found ${borrowings.length} borrowings`);

    if (borrowings.length === 0) return [];

    const rows = borrowings.map(b => {
        return {
            id: mapId('borrowings', b._id),
            user_id: mapId('users', b.user),
            book_id: mapId('books', b.book),
            borrow_date: formatDate(b.borrowDate),
            due_date: formatDate(b.dueDate),
            return_date: formatDate(b.returnDate),
            status: safeString(b.status, 'active'),
            late_fee: safeNumber(b.lateFee),
            notes: safeString(b.notes),
            created_at: formatDate(b.createdAt),
            updated_at: formatDate(b.updatedAt),
        };
    });

    const inserted = await insertBatches('borrowings', rows);
    console.log(`  Migrated ${inserted} borrowings`);
    return rows;
}

async function migrateReservations() {
    console.log('\n=== Migrating Reservations ===');
    const reservations = await Reservation.find({}).lean();
    console.log(`  Found ${reservations.length} reservations`);

    if (reservations.length === 0) return [];

    const rows = reservations.map(r => {
        return {
            id: mapId('reservations', r._id),
            user_id: mapId('users', r.user),
            book_id: mapId('books', r.book),
            reserved_on: formatDate(r.reservedOn),
            reserve_expiry: formatDate(r.reserveExpiry),
            status: safeString(r.status, 'pending'),
            payment_method: safeString(r.paymentMethod),
            total_price: safeNumber(r.totalPrice),
            delivery_fee: safeNumber(r.deliveryFee),
            discount: safeNumber(r.discount),
            delivery_address: safeString(r.deliveryAddress),
            notes: safeString(r.notes),
            created_at: formatDate(r.createdAt),
            updated_at: formatDate(r.updatedAt),
        };
    });

    const inserted = await insertBatches('reservations', rows);
    console.log(`  Migrated ${inserted} reservations`);
    return rows;
}

async function migrateFines() {
    console.log('\n=== Migrating Fines ===');
    const fines = await Fine.find({}).lean();
    console.log(`  Found ${fines.length} fines`);

    if (fines.length === 0) return [];

    const rows = fines.map(f => {
        return {
            id: mapId('fines', f._id),
            borrowing_id: mapId('borrowings', f.borrowing),
            user_id: mapId('users', f.user),
            book_id: mapId('books', f.book),
            amount: safeNumber(f.amount),
            days_late: safeNumber(f.daysLate),
            rate_per_day: safeNumber(f.ratePerDay, 10),
            status: safeString(f.status, 'unpaid'),
            paid_date: formatDate(f.paidDate),
            notes: safeString(f.notes),
            created_at: formatDate(f.createdAt),
            updated_at: formatDate(f.updatedAt),
        };
    });

    const inserted = await insertBatches('fines', rows);
    console.log(`  Migrated ${inserted} fines`);
    return rows;
}

async function migrateNotifications() {
    console.log('\n=== Migrating Notifications ===');
    const notifications = await Notification.find({}).lean();
    console.log(`  Found ${notifications.length} notifications`);

    if (notifications.length === 0) return [];

    const rows = notifications.map(n => {
        return {
            id: mapId('notifications', n._id),
            user_id: n.user ? mapId('users', n.user) : null,
            target_role: safeString(n.targetRole, 'admin'),
            title: safeString(n.title),
            message: safeString(n.message),
            type: safeString(n.type, 'info'),
            related_user_id: n.relatedUser ? mapId('users', n.relatedUser) : null,
            related_book_id: n.relatedBook ? mapId('books', n.relatedBook) : null,
            action: n.action || null,
            is_read: safeBool(n.isRead),
            is_global: safeBool(n.isGlobal),
            created_at: formatDate(n.createdAt),
            updated_at: formatDate(n.updatedAt),
        };
    });

    const inserted = await insertBatches('notifications', rows);
    console.log(`  Migrated ${inserted} notifications`);
    return rows;
}

async function migrateContacts() {
    console.log('\n=== Migrating Contacts ===');
    const contacts = await Contact.find({}).lean();
    console.log(`  Found ${contacts.length} contacts`);

    if (contacts.length === 0) return [];

    const rows = contacts.map(c => {
        return {
            id: mapId('contacts', c._id),
            first_name: safeString(c.firstName),
            last_name: safeString(c.lastName),
            email: safeString(c.email),
            phone: safeString(c.phone),
            subject: safeString(c.subject),
            message: safeString(c.message),
            created_at: formatDate(c.createdAt),
            updated_at: formatDate(c.updatedAt),
        };
    });

    const inserted = await insertBatches('contacts', rows);
    console.log(`  Migrated ${inserted} contacts`);
    return rows;
}

async function migrateWishlist() {
    console.log('\n=== Migrating Wishlist ===');
    const users = await User.find({ wishlist: { $exists: true, $ne: [] } }).lean();
    
    const rows = [];
    for (const u of users) {
        for (const bookId of (u.wishlist || [])) {
            rows.push({
                user_id: mapId('users', u._id),
                book_id: mapId('books', bookId),
                created_at: formatDate(u.updatedAt),
            });
        }
    }

    if (rows.length === 0) {
        console.log('  No wishlist entries found');
        return [];
    }

    const inserted = await insertBatches('wishlist', rows);
    console.log(`  Migrated ${inserted} wishlist entries`);
    return rows;
}

async function saveIdMap() {
    const fs = require('fs');
    const path = require('path');
    const mapPath = path.join(__dirname, 'id-map.json');
    
    const serializable = {};
    for (const [collection, map] of Object.entries(idMap)) {
        serializable[collection] = Object.fromEntries(map);
    }
    
    fs.writeFileSync(mapPath, JSON.stringify(serializable, null, 2));
    console.log(`\nID mapping saved to ${mapPath}`);
    console.log('Keep this file - you may need it for rollback or reference.');
}

// ============================================
// MAIN
// ============================================
async function main() {
    console.log('==========================================');
    console.log('  Librivista: MongoDB -> Supabase Migration');
    console.log('==========================================');
    
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('  Connected to:', MONGODB_URI);
    
    // Count documents
    const collections = {
        Users: await User.countDocuments(),
        Books: await Book.countDocuments(),
        Borrowings: await Borrowing.countDocuments(),
        Reservations: await Reservation.countDocuments(),
        Fines: await Fine.countDocuments(),
        Notifications: await Notification.countDocuments(),
        Contacts: await Contact.countDocuments(),
    };
    
    console.log('\nSource data:');
    for (const [name, count] of Object.entries(collections)) {
        console.log(`  ${name}: ${count}`);
    }
    
    const totalDocs = Object.values(collections).reduce((a, b) => a + b, 0);
    if (totalDocs === 0) {
        console.log('\nNo data found in MongoDB. Nothing to migrate.');
        await mongoose.disconnect();
        return;
    }
    
    // Migrate in order (respecting foreign key dependencies)
    await migrateUsers();
    await migrateBooks();
    await migrateBorrowings();
    await migrateReservations();
    await migrateFines();
    await migrateNotifications();
    await migrateContacts();
    await migrateWishlist();
    
    // Save ID mapping
    await saveIdMap();
    
    // Disconnect
    await mongoose.disconnect();
    
    console.log('\n==========================================');
    console.log('  Migration Complete!');
    console.log('==========================================');
    console.log('\nNext steps:');
    console.log('1. Update .env files with Supabase credentials');
    console.log('2. Replace Mongoose models with Supabase queries');
    console.log('3. Test all API endpoints');
}

main().catch(err => {
    console.error('\nMigration failed:', err);
    process.exit(1);
});
