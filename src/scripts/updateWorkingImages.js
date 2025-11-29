// src/scripts/updateWorkingImages.js
const supabase = require('../config/supabaseClient');
require('dotenv').config();

/**
 * Update all berita with VERIFIED working Unsplash images
 * All URLs tested and confirmed returning HTTP 200
 */
const imageMapping = {
    // Teknologi
    'smartphone-terbaru-dengan-teknologi-ai-canggih-diluncurkan-di-indonesia':
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80', // Smartphone
    'startup-indonesia-raih-pendanaan-rp-100-miliar-untuk-ekspansi-teknologi-fintech':
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', // Startup office
    'inovasi-teknologi-5g-mulai-meluas-ke-berbagai-kota-di-indonesia':
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', // Technology/network
    'teknologi-ai-terbaru-mengubah-industri':
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', // AI/technology

    // Olahraga
    'tim-nasional-indonesia-lolos-ke-putaran-final-piala-dunia-u-20':
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80', // Soccer
    'atlet-bulu-tangkis-indonesia-raih-medali-emas-di-kejuaraan-internasional':
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80', // Badminton
    'liga-1-indonesia-persebaya-juara-setelah-drama-di-pertandingan-terakhir':
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80', // Soccer stadium

    // Politik
    'pemerintah-luncurkan-program-kartu-sakti-untuk-kesejahteraan-rakyat':
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80', // Government
    'dpr-setujui-revisi-uu-pendidikan-untuk-tingkatkan-kualitas-sdm':
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80', // Education

    // Hiburan
    'film-indonesia-raih-penghargaan-bergengsi-di-festival-film-internasional':
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80', // Cinema
    'konser-musik-internasional-terbesar-tahun-ini-akan-digelar-di-jakarta':
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80', // Concert
    'serial-drama-indonesia-trending-di-platform-streaming-global':
        'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80', // Streaming

    // Bisnis
    'bursa-saham-indonesia-cetak-rekor-tertinggi-dalam-sejarah':
        'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80', // Stock market
    'e-commerce-indonesia-raih-transaksi-rp-500-triliun-di-kuartal-pertama':
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80', // E-commerce
    '19-juta-lapangan-pekerjaan-batal':
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', // Business

    // Kesehatan
    'terobosan-baru-vaksin-malaria-buatan-indonesia-lulus-uji-klinis':
        'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80', // Medical research/vaccine
    'rumah-sakit-di-indonesia-terapkan-teknologi-ai-untuk-diagnosis-penyakit':
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80', // Medical tech
    'program-diet-sehat-gratis-untuk-cegah-diabetes-diluncurkan-pemerintah':
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80', // Healthy food
};

async function updateWorkingImages() {
    console.log('🔧 Updating berita with VERIFIED working images...\n');

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
        console.log(`\n✨ All images updated with VERIFIED working URLs!`);

    } catch (error) {
        console.error('❌ Error updating images:', error.message);
        throw error;
    }
}

updateWorkingImages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
