// src/models/authModel.js
const supabase = require('../config/supabaseClient');

/**
 * Auth Model
 * Handles all authentication-related database operations
 */
const authModel = {
    /**
     * Register new user
     */
    async register(email, password, fullName) {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    full_name: fullName
                }
            });

            if (authError) throw authError;

            // Create or update profile in users table (UPSERT to handle triggers)
            // Service role key automatically bypasses RLS
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .upsert({
                    id: authData.user.id,
                    email: email,
                    full_name: fullName,
                    role: 'user'
                })
                .select()
                .single();

            if (profileError) {
                // Rollback - delete auth user if profile creation fails
                await supabase.auth.admin.deleteUser(authData.user.id);
                throw profileError;
            }

            return {
                user: authData.user,
                profile
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Get user profile
            const { data: profile, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', data.user.id)
                .single();

            if (profileError) throw profileError;

            return {
                user: data.user,
                session: data.session,
                profile
            };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get user by ID
     */
    async getUserById(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update user profile
     */
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify access token
     */
    async verifyToken(token) {
        try {
            const { data, error } = await supabase.auth.getUser(token);

            if (error) throw error;
            return data.user;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = authModel;
