// src/scripts/updateBeritaImages.js
const supabase = require('../config/supabaseClient');
require('dotenv').config();

/**
 * Helper function to get Lorem Picsum image URL
 */
function getPlaceholderImage(id, width = 1200, height = 800) {
    return `https://picsum.photos/id/${id}/${width}/${height}`;
}

/**
 * Update existing berita images
 */
async function updateBeritaImages() {
    console.log('🔄 Updating berita images...');

    try {
        // Get all berita
        const { data: allBerita, error: fetchError } = await supabase
            .from('berita')
            .select('id, slug, judul')
            .order('created_at', { ascending: true });

        if (fetchError) throw fetchError;

        if (!allBerita || allBerita.length === 0) {
            console.log('⚠️  No berita found');
            return;
        }

        console.log(`📝 Found ${allBerita.length} berita to update`);

        // Unique image IDs for variety
        const imageIds = [237, 1015, 180, 367, 64, 429, 47, 119, 152, 201, 292, 326, 365, 431, 453, 488, 500, 550, 600, 650];

        // Update each berita with a new image
        let updated = 0;
        for (let i = 0; i < allBerita.length; i++) {
            const berita = allBerita[i];
            const imageId = imageIds[i] || (100 + i);
            const newImageUrl = getPlaceholderImage(imageId);

            const { error: updateError } = await supabase
                .from('berita')
                .update({ gambar_url: newImageUrl })
                .eq('id', berita.id);

            if (updateError) {
                console.error(`❌ Error updating ${berita.judul}:`, updateError.message);
                continue;
            }

            updated++;
            console.log(`✅ Updated ${i + 1}/${allBerita.length}: ${berita.judul.substring(0, 50)}...`);
        }

        console.log(`\n✨ Successfully updated ${updated} berita images!`);
    } catch (error) {
        console.error('❌ Error updating berita images:', error.message);
        throw error;
    }
}

// Run the updater
updateBeritaImages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
