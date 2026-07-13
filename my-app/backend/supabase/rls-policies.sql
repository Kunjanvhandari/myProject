-- ============================================
-- Librivista - Supabase Row-Level Security Policies
-- For authenticated user access via Supabase client
-- ============================================

-- USERS: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- BOOKS: Anyone can read, only admins can modify
CREATE POLICY "Anyone can view books" ON books
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert books" ON books
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

CREATE POLICY "Admins can update books" ON books
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

CREATE POLICY "Admins can delete books" ON books
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- BORROWINGS
CREATE POLICY "Users can view own borrowings" ON borrowings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all borrowings" ON borrowings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- RESERVATIONS
CREATE POLICY "Users can view own reservations" ON reservations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations" ON reservations
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- FINES
CREATE POLICY "Users can view own fines" ON fines
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all fines" ON fines
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON notifications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- CONTACTS: Anyone can insert
CREATE POLICY "Anyone can submit contact" ON contacts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view contacts" ON contacts
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
    );

-- WISHLIST
CREATE POLICY "Users can view own wishlist" ON wishlist
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own wishlist" ON wishlist
    FOR ALL USING (auth.uid() = user_id);
