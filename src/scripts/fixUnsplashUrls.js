// src/scripts/fixUnsplashUrls.js
const supabase = require('../config/supabaseClient');
require('dotenv').config();

/**
 * Fix Unsplash URLs to use proper format
 * Old format with ?w=1200&h=800&fit=crop doesn't work properly
 * New format uses direct image URLs
 */
const imageMapping = {
    // Teknologi
    'smartphone-terbaru-dengan-teknologi-ai-canggih-diluncurkan-di-indonesia':
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80',
    'startup-indonesia-raih-pendanaan-rp-100-miliar-untuk-ekspansi-teknologi-fintech':
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    'inovasi-teknologi-5g-mulai-meluas-ke-berbagai-kota-di-indonesia':
        'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80',
    'teknologi-ai-terbaru-mengubah-industri':
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',

    // Olahraga
    'tim-nasional-indonesia-lolos-ke-putaran-final-piala-dunia-u-20':
        'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
    'atlet-bulu-tangkis-indonesia-raih-medali-emas-di-kejuaraan-internasional':
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
    'liga-1-indonesia-persebaya-juara-setelah-drama-di-pertandingan-terakhir':
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',

    // Politik
    'pemerintah-luncurkan-program-kartu-sakti-untuk-kesejahteraan-rakyat':
        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'dpr-setujui-revisi-uu-pendidikan-untuk-tingkatkan-kualitas-sdm':
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',

    // Hiburan
    'film-indonesia-raih-penghargaan-bergengsi-di-festival-film-internasional':
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    'konser-musik-internasional-terbesar-tahun-ini-akan-digelar-di-jakarta':
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    'serial-drama-indonesia-trending-di-platform-streaming-global':
        'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',

    // Bisnis
    'bursa-saham-indonesia-cetak-rekor-tertinggi-dalam-sejarah':
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    'e-commerce-indonesia-raih-transaksi-rp-500-triliun-di-kuartal-pertama':
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    '19-juta-lapangan-pekerjaan-batal':
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',

    // Kesehatan
    'terobosan-baru-vaksin-malaria-buatan-indonesia-lulus-uji-klinis':
        'https://images.unsplash.com/photo-1583912086296-be5c4b0e9b7d?auto=format&fit=crop&w=1200&q=80',
    'rumah-sakit-di-indonesiaterapkan-teknologi-ai-untuk-diagnosis-penyakit':
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    'program-diet-sehat-gratis-untuk-cegah-diabetes-diluncurkan-pemerintah':
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Update berita with fixed Unsplash URLs
 */
async function fixUnsplashUrls() {
    console.log('🔧 Fixing Unsplash image URLs...\n');

    try {
        let updated = 0;
        let notFound = 0;

        for (const [slug, imageUrl] of Object.entries(imageMapping)) {
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

            const { error: updateError } = await supabase
                .from('berita')
                .update({ gambar_url: imageUrl })
                .eq('id', berita.id);

            if (updateError) {
                console.error(`❌ Error updating ${berita.judul}:`, updateError.message);
                continue;
            }

            updated++;
            console.log(`✅ Updated: ${berita.judul.substring(0, 50)}...`);
        }

        console.log(`\n📊 Summary:`);
        console.log(`   ✅ Updated: ${updated} berita`);
        console.log(`   ⚠️  Not found: ${notFound} berita`);
        console.log(`\n✨ All Unsplash URLs fixed!`);

    } catch (error) {
        console.error('❌ Error fixing URLs:', error.message);
        throw error;
    }
}

fixUnsplashUrls()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
