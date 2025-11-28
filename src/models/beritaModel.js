// src/models/beritaModel.js
const supabase = require('../config/supabaseClient');

/**
 * Berita Model
 * Handles all berita-related database operations
 */
const beritaModel = {
    /**
     * Get all published berita with filters
     */
    async getAll(filters = {}) {
        try {
            let query = supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)', { count: 'exact' })
                .eq('status', 'published');

            // Apply filters
            if (filters.kategori_id) {
                query = query.eq('kategori_id', filters.kategori_id);
            }

            if (filters.search) {
                query = query.ilike('judul', `% ${filters.search}% `);
            }

            // Sorting
            if (filters.sort === 'popular') {
                query = query.order('views', { ascending: false });
            } else if (filters.sort === 'oldest') {
                query = query.order('created_at', { ascending: true });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 10;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;

            return { data, count, page, limit };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get berita by ID
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)')
                .eq('id', id)
                .eq('status', 'published')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get berita by slug
     */
    async getBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get popular berita
     */
    async getPopular(limit = 6) {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)')
                .eq('status', 'published')
                .order('views', { ascending: false })
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get featured berita
     */
    async getFeatured() {
        try {
            const { data, error } = await supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)')
                .eq('status', 'published')
                .eq('is_featured', true)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get berita by kategori
     */
    async getByKategori(kategoriId, filters = {}) {
        try {
            let query = supabase
                .from('berita')
                .select('*, kategori_berita:kategori_id(*), users:author_id(*)', { count: 'exact' })
                .eq('kategori_id', kategoriId)
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            // Pagination
            const page = filters.page || 1;
            const limit = filters.limit || 9;
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query.range(from, to);

            const { data, error, count } = await query;

            if (error) throw error;
            return { data, count, page, limit };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create new berita
     */
    async create(beritaData) {
        try {
            const { data, error } = await supabase
                .from('berita')
                .insert(beritaData)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update berita
     */
    async update(id, beritaData) {
        try {
            const { data, error } = await supabase
                .from('berita')
                .update(beritaData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Delete berita
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('berita')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Increment views
     */
    async incrementViews(id) {
        try {
            const { error } = await supabase
                .rpc('increment_berita_views', { berita_id: id });

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = beritaModel;
