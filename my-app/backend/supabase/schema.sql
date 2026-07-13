-- ============================================
-- Librivista - Supabase PostgreSQL Schema
-- Migrated from Mongoose/MongoDB
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(60) NOT NULL,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) DEFAULT '',
    address TEXT DEFAULT '',
    membership_type VARCHAR(20) DEFAULT 'Free' CHECK (membership_type IN ('Free', 'Basic', 'Premium')),
    membership_id VARCHAR(255) UNIQUE,
    membership_expiry TIMESTAMPTZ,
    student_id VARCHAR(255) DEFAULT '',
    profile_image TEXT DEFAULT '',
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    books_borrowed INTEGER DEFAULT 0,
    books_returned INTEGER DEFAULT 0,
    currently_borrowed INTEGER DEFAULT 0,
    reservations INTEGER DEFAULT 0,
    notifications_embed JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_membership_id ON users(membership_id);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- 2. BOOKS TABLE
-- ============================================
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) UNIQUE,
    description TEXT DEFAULT '',
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255) DEFAULT '',
    publisher VARCHAR(255) DEFAULT '',
    publish_year INTEGER,
    edition VARCHAR(255) DEFAULT '',
    language VARCHAR(100) DEFAULT 'English',
    pages INTEGER DEFAULT 0,
    price NUMERIC(10, 2) DEFAULT 0,
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    cover_image TEXT DEFAULT '/images/footer/book22.png',
    tags TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    borrow_count INTEGER DEFAULT 0,
    badge VARCHAR(20) DEFAULT '' CHECK (badge IN ('New', 'Popular', 'Trending', 'Featured', '')),
    is_featured BOOLEAN DEFAULT false,
    is_new_release BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'checkedOut', 'unavailable', 'maintenance')),
    source_url TEXT DEFAULT '',
    source VARCHAR(255) DEFAULT '',
    chapters JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_category ON books(category);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_tags ON books USING GIN(tags);

-- Full text search column (immutable, computed at insert/update)
ALTER TABLE books ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, '') || ' ' || coalesce(array_to_string(tags, ' '), ''))
    ) STORED;

CREATE INDEX idx_books_search ON books USING GIN(search_vector);

-- ============================================
-- 3. BORROWINGS TABLE
-- ============================================
CREATE TABLE borrowings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    borrow_date TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ NOT NULL,
    return_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
    late_fee NUMERIC(10, 2) DEFAULT 0,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_borrowings_user_status ON borrowings(user_id, status);
CREATE INDEX idx_borrowings_book_status ON borrowings(book_id, status);
CREATE INDEX idx_borrowings_status ON borrowings(status);
CREATE INDEX idx_borrowings_due_date ON borrowings(due_date);

-- ============================================
-- 4. RESERVATIONS TABLE
-- ============================================
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    reserved_on TIMESTAMPTZ DEFAULT NOW(),
    reserve_expiry TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
    payment_method VARCHAR(30) DEFAULT '' CHECK (payment_method IN ('eSewa', 'Khalti', 'Cash on Pickup', '')),
    total_price NUMERIC(10, 2) DEFAULT 0,
    delivery_fee NUMERIC(10, 2) DEFAULT 0,
    discount NUMERIC(10, 2) DEFAULT 0,
    delivery_address TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reservations_user_status ON reservations(user_id, status);
CREATE INDEX idx_reservations_book_status ON reservations(book_id, status);
CREATE INDEX idx_reservations_status ON reservations(status);

-- ============================================
-- 5. FINES TABLE
-- ============================================
CREATE TABLE fines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    borrowing_id UUID NOT NULL REFERENCES borrowings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    days_late INTEGER DEFAULT 0,
    rate_per_day NUMERIC(10, 2) DEFAULT 10,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'waived')),
    paid_date TIMESTAMPTZ,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fines_user_status ON fines(user_id, status);
CREATE INDEX idx_fines_borrowing ON fines(borrowing_id);

-- ============================================
-- 6. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_role VARCHAR(10) DEFAULT 'admin' CHECK (target_role IN ('admin', 'user', 'all')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    related_book_id UUID REFERENCES books(id) ON DELETE SET NULL,
    action VARCHAR(50) CHECK (action IN (
        'user_registered', 'profile_updated', 'password_changed',
        'book_reserved', 'reservation_cancelled', 'book_borrowed',
        'book_returned', 'due_date_approaching', 'book_overdue', 'fine_generated'
    )),
    is_read BOOLEAN DEFAULT false,
    is_global BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_target_read ON notifications(target_role, is_read, created_at DESC);
CREATE INDEX idx_notifications_global ON notifications(is_global, created_at DESC);

-- ============================================
-- 7. CONTACTS TABLE
-- ============================================
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WISHLIST TABLE (join table for User<->Book many-to-many)
-- ============================================
CREATE TABLE wishlist (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, book_id)
);

-- ============================================
-- TRIGGERS: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_borrowings_updated_at BEFORE UPDATE ON borrowings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fines_updated_at BEFORE UPDATE ON fines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Disabled for backend access
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Allow full access for service role (backend API)
CREATE POLICY "Service role full access" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON borrowings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON reservations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON fines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON wishlist FOR ALL USING (true) WITH CHECK (true);
