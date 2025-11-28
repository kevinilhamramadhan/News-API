// src/models/bookmarkModel.js
const supabase = require('../config/supabaseClient');

/**
 * Bookmark Model
 * Handles all bookmark-related database operations
 */
const bookmarkModel = {
    /**
     * Get user's bookmarks
     */
    async getUserBookmarks(userId) {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select(`
          *,
          berita:berita_id (
            id,
            judul,
            slug,
            ringkasan,
            gambar_url,
            views,
            created_at,
            kategori_berita:kategori_id (
              id,
              nama,
              slug
            )
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Return array of berita with bookmark info
            return data.map(bookmark => ({
                ...bookmark.berita,
                bookmarked_at: bookmark.created_at
            }));
        } catch (error) {
            throw error;
        }
    },

    /**
     * Add bookmark
     */
    async addBookmark(userId, beritaId) {
        try {
            // Check if already bookmarked
            const { data: existing } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', userId)
                .eq('berita_id', beritaId)
                .single();

            if (existing) {
                return { message: 'Already bookmarked', bookmark: existing };
            }

            const { data, error } = await supabase
                .from('bookmarks')
                .insert({
                    user_id: userId,
                    berita_id: beritaId
                })
                .select()
                .single();

            if (error) throw error;
            return { message: 'Bookmark added', bookmark: data };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Remove bookmark
     */
    async removeBookmark(userId, beritaId) {
        try {
            const { error } = await supabase
                .from('bookmarks')
                .delete()
                .eq('user_id', userId)
                .eq('berita_id', beritaId);

            if (error) throw error;
            return { message: 'Bookmark removed' };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check if berita is bookmarked
     */
    async isBookmarked(userId, beritaId) {
        try {
            const { data, error } = await supabase
                .from('bookmarks')
                .select('id')
                .eq('user_id', userId)
                .eq('berita_id', beritaId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return !!data;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = bookmarkModel;
