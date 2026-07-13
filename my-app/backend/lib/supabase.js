/**
 * Supabase Query Helpers
 * Provides Mongoose-like query interface for Supabase
 */

const { supabase } = require('../config/supabase');

// ============================================
// GENERIC HELPERS
// ============================================

class SupabaseQuery {
    constructor(table) {
        this.table = table;
        this.query = null;
        this._select = '*';
        this._filters = [];
        this._orderBy = null;
        this._limit = null;
        this._offset = null;
        this._single = false;
        this._count = false;
    }

    select(fields = '*', options = {}) {
        this._select = fields;
        return this;
    }

    where(field, operator, value) {
        if (operator === '=' || operator === '==') {
            this._filters.push({ field, op: 'eq', value });
        } else if (operator === '!=' || operator === '$ne') {
            this._filters.push({ field, op: 'neq', value });
        } else if (operator === '>' || operator === '$gt') {
            this._filters.push({ field, op: 'gt', value });
        } else if (operator === '>=' || operator === '$gte') {
            this._filters.push({ field, op: 'gte', value });
        } else if (operator === '<' || operator === '$lt') {
            this._filters.push({ field, op: 'lt', value });
        } else if (operator === '<=' || operator === '$lte') {
            this._filters.push({ field, op: 'lte', value });
        } else if (operator === 'in' || operator === '$in') {
            this._filters.push({ field, op: 'in', value });
        } else if (operator === 'like' || operator === '$like') {
            this._filters.push({ field, op: 'like', value });
        } else if (operator === 'ilike' || operator === '$ilike') {
            this._filters.push({ field, op: 'ilike', value });
        } else if (operator === 'contains' || operator === '$contains') {
            this._filters.push({ field, op: 'cs', value });
        } else if (operator === 'contained' || operator === '$in') {
            this._filters.push({ field, op: 'cd', value });
        } else if (operator === 'is' && value === null) {
            this._filters.push({ field, op: 'is', value: null });
        } else if (operator === 'not' && value === null) {
            this._filters.push({ field, op: 'not.is', value: null });
        }
        return this;
    }

    orderBy(field, direction = 'asc') {
        this._orderBy = { field, ascending: direction === 'asc' };
        return this;
    }

    limit(n) {
        this._limit = n;
        return this;
    }

    skip(n) {
        this._offset = n;
        return this;
    }

    populate(field, table, localField, foreignField) {
        // Supabase doesn't have populate - we handle this in the application layer
        return this;
    }

    lean() {
        return this;
    }

    count() {
        this._count = true;
        return this;
    }

    async exec() {
        let q = supabase.from(this.table).select(this._select, { count: this._count ? 'exact' : undefined });

        for (const filter of this._filters) {
            q = q.filter(filter.field, filter.op, filter.value);
        }

        if (this._orderBy) {
            q = q.order(this._orderBy.field, { ascending: this._orderBy.ascending });
        }

        if (this._limit !== null) {
            q = q.limit(this._limit);
        }

        if (this._offset !== null) {
            q = q.range(this._offset, this._offset + (this._limit || 1000) - 1);
        }

        const { data, error, count } = await q;

        if (error) throw error;

        if (this._count) {
            return { count: count || 0 };
        }

        if (this._single) {
            return data && data.length > 0 ? data[0] : null;
        }

        return data || [];
    }

    then(resolve, reject) {
        return this.exec().then(resolve, reject);
    }

    catch(fn) {
        return this.exec().catch(fn);
    }
}

// ============================================
// TABLE-SPECIFIC QUERY BUILDERS
// ============================================

function queryUsers() {
    return new SupabaseQuery('users');
}

function queryBooks() {
    return new SupabaseQuery('books');
}

function queryBorrowings() {
    return new SupabaseQuery('borrowings');
}

function queryReservations() {
    return new SupabaseQuery('reservations');
}

function queryFines() {
    return new SupabaseQuery('fines');
}

function queryNotifications() {
    return new SupabaseQuery('notifications');
}

function queryContacts() {
    return new SupabaseQuery('contacts');
}

function queryWishlist() {
    return new SupabaseQuery('wishlist');
}

// ============================================
// CRUD HELPERS
// ============================================

async function findById(table, id) {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

async function findByIdAndUpdate(table, id, update, options = {}) {
    const { data, error } = await supabase
        .from(table)
        .update(update)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function findByIdAndDelete(table, id) {
    const { data, error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function create(table, record) {
    const { data, error } = await supabase
        .from(table)
        .insert(record)
        .select()
        .single();
    if (error) throw error;
    return data;
}

async function createMany(table, records) {
    const { data, error } = await supabase
        .from(table)
        .insert(records)
        .select();
    if (error) throw error;
    return data;
}

async function find(table, filters = {}, options = {}) {
    let q = supabase.from(table).select(options.select || '*');

    for (const [field, value] of Object.entries(filters)) {
        if (value !== null && value !== undefined) {
            q = q.eq(field, value);
        } else {
            q = q.filter(field, 'is', null);
        }
    }

    if (options.orderBy) {
        q = q.order(options.orderBy.field, { ascending: options.orderBy.ascending !== false });
    }

    if (options.limit) {
        q = q.limit(options.limit);
    }

    if (options.offset) {
        q = q.range(options.offset, options.offset + (options.limit || 1000) - 1);
    }

    const { data, error, count } = await q;
    if (error) throw error;

    if (options.count) {
        const { count: total } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
        return { data: data || [], count: total };
    }

    return data || [];
}

async function count(table, filters = {}) {
    let q = supabase.from(table).select('*', { count: 'exact', head: true });

    for (const [field, value] of Object.entries(filters)) {
        q = q.eq(field, value);
    }

    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
}

async function update(table, filters, update) {
    let q = supabase.from(table).update(update);

    for (const [field, value] of Object.entries(filters)) {
        q = q.eq(field, value);
    }

    const { data, error } = await q.select();
    if (error) throw error;
    return data;
}

async function remove(table, filters) {
    let q = supabase.from(table).delete();

    for (const [field, value] of Object.entries(filters)) {
        q = q.eq(field, value);
    }

    const { data, error } = await q.select();
    if (error) throw error;
    return data;
}

// ============================================
// TEXT SEARCH (for Books)
// ============================================

async function searchBooks(searchTerm, options = {}) {
    let q = supabase
        .from('books')
        .select(options.select || '*')
        .textSearch('search', searchTerm, { type: 'websearch' });

    if (options.category) {
        q = q.eq('category', options.category);
    }

    if (options.status) {
        q = q.eq('status', options.status);
    }

    if (options.limit) {
        q = q.limit(options.limit);
    }

    if (options.offset) {
        q = q.range(options.offset, options.offset + (options.limit || 1000) - 1);
    }

    const { data, error } = await q;
    if (error) throw error;
    return data || [];
}

module.exports = {
    supabase,
    SupabaseQuery,
    queryUsers,
    queryBooks,
    queryBorrowings,
    queryReservations,
    queryFines,
    queryNotifications,
    queryContacts,
    queryWishlist,
    findById,
    findByIdAndUpdate,
    findByIdAndDelete,
    create,
    createMany,
    find,
    count,
    update,
    remove,
    searchBooks,
};
