// src/scripts/updateRelevantImages.js
const supabase = require('../config/supabaseClient');
require('dotenv').config();

/**
 * Mapping of berita slugs to relevant Unsplash images
 * Each image is carefully selected to match the article topic
 */
const imageMapping = {
    // Teknologi
    'smartphone-terbaru-dengan-teknologi-ai-canggih-diluncurkan-di-indonesia':
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1200&h=800&fit=crop', // Modern smartphone
    'startup-indonesia-raih-pendanaan-rp-100-miliar-untuk-ekspansi-teknologi-fintech':
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop', // Fintech/startup office
    'inovasi-teknologi-5g-mulai-meluas-ke-berbagai-kota-di-indonesia':
        'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=1200&h=800&fit=crop', // 5G technology/network
    'teknologi-ai-terbaru-mengubah-industri':
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop', // AI technology

    // Olahraga
    'tim-nasional-indonesia-lolos-ke-putaran-final-piala-dunia-u-20':
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&h=800&fit=crop', // Soccer/football celebration
    'atlet-bulu-tangkis-indonesia-raih-medali-emas-di-kejuaraan-internasional':
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&h=800&fit=crop', // Badminton
    'liga-1-indonesia-persebaya-juara-setelah-drama-di-pertandingan-terakhir':
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&h=800&fit=crop', // Soccer stadium celebration

    // Politik
    'pemerintah-luncurkan-program-kartu-sakti-untuk-kesejahteraan-rakyat':
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&h=800&fit=crop', // Government/policy
    'dpr-setujui-revisi-uu-pendidikan-untuk-tingkatkan-kualitas-sdm':
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop', // Education/classroom

    // Hiburan
    'film-indonesia-raih-penghargaan-bergengsi-di-festival-film-internasional':
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=800&fit=crop', // Cinema/film award
    'konser-musik-internasional-terbesar-tahun-ini-akan-digelar-di-jakarta':
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=800&fit=crop', // Concert/music festival
    'serial-drama-indonesia-trending-di-platform-streaming-global':
        'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=1200&h=800&fit=crop', // Streaming/TV series

    // Bisnis
    'bursa-saham-indonesia-cetak-rekor-tertinggi-dalam-sejarah':
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=800&fit=crop', // Stock market/trading
    'e-commerce-indonesia-raih-transaksi-rp-500-triliun-di-kuartal-pertama':
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop', // E-commerce/online shopping
    '19-juta-lapangan-pekerjaan-batal':
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop', // Business/office

    // Kesehatan
    'terobosan-baru-vaksin-malaria-buatan-indonesia-lulus-uji-klinis':
        'https://images.unsplash.com/photo-1583912086296-be5c4b0e9b7d?w=1200&h=800&fit=crop', // Medical research/vaccine
    'rumah-sakit-di-indonesia-terapkan-teknologi-ai-untuk-diagnosis-penyakit':
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop', // Medical technology/hospital
    'program-diet-sehat-gratis-untuk-cegah-diabetes-diluncurkan-pemerintah':
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&h=800&fit=crop', // Healthy food/nutrition
};

/**
 * Update berita with relevant Unsplash images
 */
async function updateRelevantImages() {
    console.log('🎨 Updating berita with relevant Unsplash images...\n');

    try {
        let updated = 0;
        let notFound = 0;

        // Iterate through the image mapping
        for (const [slug, imageUrl] of Object.entries(imageMapping)) {
            // Find berita by slug
            const { data: berita, error: fetchError } = await supabase
                .from('berita')
                .select('id, judul')
                .eq('slug', slug)
                .single();

            if (fetchError || !berita) {
                console.log(`⚠️  Berita not found: ${slug}`);
                notFound++;
                continue;
            }

            // Update with relevant image
            const { error: updateError } = await supabase
                .from('berita')
                .update({ gambar_url: imageUrl })
                .eq('id', berita.id);

            if (updateError) {
                console.error(`❌ Error updating ${berita.judul}:`, updateError.message);
                continue;
            }

            updated++;
            console.log(`✅ Updated: ${berita.judul.substring(0, 60)}...`);
            console.log(`   Image: ${imageUrl.substring(0, 70)}...`);
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Updated: ${updated} berita`);
        console.log(`   ⚠️  Not found: ${notFound} berita`);
        console.log(`\n✨ All images updated with relevant Unsplash photos!`);

    } catch (error) {
        console.error('❌ Error updating images:', error.message);
        throw error;
    }
}

// Run the updater
updateRelevantImages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
