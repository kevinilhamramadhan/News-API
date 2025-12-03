// src/scripts/createAdmin.js
const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.API_URL;

/**
 * Create admin user for seeding
 */
async function createAdmin() {
    const adminEmail = 'admin@berita.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrator';

    console.log('🔧 Creating admin user...\n');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}\n`);

    try {
        // Try to register admin
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email: adminEmail,
            password: adminPassword,
            full_name: adminName
        });

        if (response.data.success) {
            console.log('✅ Admin user created successfully!');
            console.log(`👤 User ID: ${response.data.data.user.id}`);
            console.log(`📧 Email: ${response.data.data.user.email}`);
            console.log(`👑 Role: ${response.data.data.user.role}`);

            console.log('\n💡 Note: New users are created with "user" role by default.');
            console.log('   You need to manually update the role to "admin" in the database.');
            console.log('   Run this SQL in Supabase:');
            console.log(`   UPDATE users SET role = 'admin' WHERE email = '${adminEmail}';`);

            return true;
        }
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.message?.includes('sudah terdaftar')) {
            console.log('ℹ️  Admin user already exists!');
            console.log('   You can now run the seeding script.');
            return true;
        } else if (error.code === 'ECONNREFUSED') {
            console.error('❌ Cannot connect to API server.');
            console.error('   Make sure the server is running: npm run dev');
        } else {
            console.error('❌ Error creating admin:', error.response?.data?.message || error.message);
        }
        return false;
    }
}

// Run
createAdmin()
    .then(success => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
