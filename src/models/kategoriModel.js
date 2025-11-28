// src/models/kategoriModel.js
const supabase = require('../config/supabaseClient');

/**
 * Kategori Model
 * Handles all kategori-related database operations
 */
const kategoriModel = {
    /**
     * Get all kategori
     */
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*, berita(count)')
                .order('nama', { ascending: true });

            if (error) throw error;

            // Transform data to include count
            const kategorWithCount = data.map(kat => ({
                ...kat,
                jumlah_berita: kat.berita[0]?.count || 0,
                berita: undefined // Remove berita array
            }));

            return kategorWithCount;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get kategori by ID
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*, berita(count)')
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                ...data,
                jumlah_berita: data.berita[0]?.count || 0,
                berita: undefined
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get kategori by slug
     */
    async getBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .select('*, berita(count)')
                .eq('slug', slug)
                .single();

            if (error) throw error;

            return {
                ...data,
                jumlah_berita: data.berita[0]?.count || 0,
                berita: undefined
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Create kategori
     */
    async create(kategoriData) {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .insert(kategoriData)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update kategori
     */
    async update(id, kategoriData) {
        try {
            const { data, error } = await supabase
                .from('kategori')
                .update(kategoriData)
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
     * Delete kategori
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('kategori')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = kategoriModel;
