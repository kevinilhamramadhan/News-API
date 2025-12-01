// src/scripts/seedBerita.js
const axios = require('axios');
require('dotenv').config();

// API Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@berita.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Sample Categories Data
 */
const categories = [
    {
        nama: 'Teknologi',
        slug: 'teknologi',
        deskripsi: 'Berita seputar teknologi, gadget, dan inovasi digital'
    },
    {
        nama: 'Olahraga',
        slug: 'olahraga',
        deskripsi: 'Berita olahraga, kompetisi, dan atlet'
    },
    {
        nama: 'Politik',
        slug: 'politik',
        deskripsi: 'Berita politik, pemerintahan, dan kebijakan publik'
    },
    {
        nama: 'Hiburan',
        slug: 'hiburan',
        deskripsi: 'Berita hiburan, selebriti, dan industri kreatif'
    },
    {
        nama: 'Bisnis',
        slug: 'bisnis',
        deskripsi: 'Berita bisnis, ekonomi, dan keuangan'
    },
    {
        nama: 'Kesehatan',
        slug: 'kesehatan',
        deskripsi: 'Berita kesehatan, medis, dan gaya hidup sehat'
    }
];

/**
 * Sample News Data with Unsplash Images
 */
const newsArticles = [
    // Teknologi
    {
        judul: 'Smartphone Terbaru dengan Teknologi AI Canggih Diluncurkan di Indonesia',
        slug: 'smartphone-terbaru-dengan-teknologi-ai-canggih-diluncurkan-di-indonesia',
        ringkasan: 'Perusahaan teknologi global meluncurkan smartphone flagship terbaru dengan fitur AI yang revolusioner, menawarkan pengalaman pengguna yang lebih pintar dan efisien.',
        konten: 'Jakarta - Sebuah perusahaan teknologi terkemuka telah resmi meluncurkan smartphone flagship terbarunya di Indonesia. Perangkat ini dilengkapi dengan chip AI generasi terbaru yang mampu melakukan pemrosesan on-device untuk berbagai tugas kompleks. Fitur unggulan termasuk kamera dengan AI computational photography yang dapat menghasilkan foto berkualitas DSLR, asisten virtual yang lebih responsif, dan sistem manajemen baterai pintar yang dapat memperpanjang daya tahan hingga 2 hari. Harga dipatok mulai dari 8 juta rupiah untuk varian dasar. Para ahli teknologi menyambut positif inovasi ini sebagai langkah maju dalam industri smartphone.',
        kategori: 'Teknologi',
        gambar_url: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        views: 156
    },
    {
        judul: 'Startup Indonesia Raih Pendanaan Rp 100 Miliar untuk Ekspansi Teknologi Fintech',
        slug: 'startup-indonesia-raih-pendanaan-rp-100-miliar-untuk-ekspansi-teknologi-fintech',
        ringkasan: 'Startup fintech lokal berhasil mengamankan pendanaan Series B senilai 100 miliar rupiah dari investor global untuk memperluas layanan digital payment.',
        konten: 'Jakarta - Sebuah startup fintech Indonesia berhasil menutup putaran pendanaan Series B dengan total dana mencapai 100 miliar rupiah. Pendanaan ini dipimpin oleh venture capital ternama dari Singapura dan Jepang. Dana tersebut akan digunakan untuk mengembangkan infrastruktur teknologi, memperluas jangkauan pasar ke kota-kota tier 2 dan 3, serta merekrut lebih banyak talenta teknologi. CEO startup tersebut menyatakan bahwa mereka menargetkan pertumbuhan pengguna hingga 300% dalam 18 bulan ke depan. Saat ini platform mereka telah memiliki lebih dari 5 juta pengguna aktif bulanan dengan volume transaksi mencapai triliunan rupiah per bulan.',
        kategori: 'Teknologi',
        gambar_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 89
    },
    {
        judul: 'Inovasi Teknologi 5G Mulai Meluas ke Berbagai Kota di Indonesia',
        slug: 'inovasi-teknologi-5g-mulai-meluas-ke-berbagai-kota-di-indonesia',
        ringkasan: 'Operator telekomunikasi besar mempercepat pembangunan infrastruktur 5G di Indonesia, menargetkan 50 kota pada akhir tahun ini.',
        konten: 'Jakarta - Teknologi 5G terus berkembang di Indonesia dengan operator telekomunikasi utama mengumumkan rencana ekspansi ambisius mereka. Hingga saat ini, jaringan 5G telah tersedia di 25 kota besar dan akan diperluas ke 50 kota pada akhir tahun. Kecepatan internet yang ditawarkan mencapai 1 Gbps, 10 kali lebih cepat dari 4G. Teknologi ini diprediksi akan mendorong transformasi digital di berbagai sektor seperti kesehatan, pendidikan, dan industri manufaktur. Pemerintah juga mendukung penuh pengembangan infrastruktur 5G sebagai bagian dari visi Indonesia Digital 2030.',
        kategori: 'Teknologi',
        gambar_url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 67
    },

    // Olahraga
    {
        judul: 'Tim Nasional Indonesia Lolos ke Putaran Final Piala Dunia U-20',
        slug: 'tim-nasional-indonesia-lolos-ke-putaran-final-piala-dunia-u-20',
        ringkasan: 'Timnas U-20 Indonesia berhasil meraih tiket ke putaran final setelah mengalahkan rivalnya dengan skor 2-1 dalam pertandingan dramatis.',
        konten: 'Jakarta - Dalam pertandingan yang penuh drama, Timnas U-20 Indonesia berhasil mengamankan tempat di putaran final Piala Dunia U-20. Gol kemenangan dicetak pada menit ke-89 oleh striker muda berbakat yang baru berusia 18 tahun. Pelatih tim menyatakan bangga dengan pencapaian ini dan berjanji akan mempersiapkan tim dengan maksimal untuk menghadapi kompetisi tingkat dunia. Ribuan suporter yang memadati stadion merayakan kemenangan bersejarah ini dengan antusias. Para pemain akan menjalani TC intensif selama 2 bulan untuk mengasah kemampuan sebelum turnamen dimulai.',
        kategori: 'Olahraga',
        gambar_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        views: 234
    },
    {
        judul: 'Atlet Bulu Tangkis Indonesia Raih Medali Emas di Kejuaraan Internasional',
        slug: 'atlet-bulu-tangkis-indonesia-raih-medali-emas-di-kejuaraan-internasional',
        ringkasan: 'Ganda putra Indonesia berhasil merebut gelar juara setelah pertandingan seru melawan pasangan dari China di final.',
        konten: 'Bangkok - Pasangan ganda putra Indonesia berhasil meraih medali emas di kejuaraan internasional bergengsi setelah mengalahkan unggulan pertama dari China dengan skor 21-19, 18-21, 21-17. Pertandingan berlangsung selama 75 menit dengan permainan yang sangat kompetitif dari kedua pasangan. Ini merupakan gelar ketiga mereka tahun ini dan mengukuhkan posisi mereka sebagai salah satu pasangan terkuat di dunia. PBSI menyatakan prestasi ini menjadi modal bagus menjelang Olimpiade tahun depan.',
        kategori: 'Olahraga',
        gambar_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 112
    },
    {
        judul: 'Liga 1 Indonesia: Persebaya Juara Setelah Drama di Pertandingan Terakhir',
        slug: 'liga-1-indonesia-persebaya-juara-setelah-drama-di-pertandingan-terakhir',
        ringkasan: 'Persebaya Surabaya mengamankan gelar juara Liga 1 setelah mengalahkan kompetitor terdekat pada laga pekan terakhir.',
        konten: 'Surabaya - Persebaya Surabaya resmi menjadi juara Liga 1 musim ini setelah meraih kemenangan 3-1 atas tim tamu pada pertandingan pekan terakhir. Ribuan Bonek memadati stadion untuk menyaksikan momen bersejarah ini. Pelatih dan pemain merayakan gelar pertama mereka dalam 10 tahun terakhir dengan penuh emosi. Presiden klub berjanji akan memberikan bonus besar untuk seluruh tim sebagai apresiasi atas kerja keras mereka sepanjang musim. Persebaya akan mewakili Indonesia di kompetisi klub Asia tahun depan.',
        kategori: 'Olahraga',
        gambar_url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 178
    },

    // Politik
    {
        judul: 'Pemerintah Luncurkan Program Kartu Sakti untuk Kesejahteraan Rakyat',
        slug: 'pemerintah-luncurkan-program-kartu-sakti-untuk-kesejahteraan-rakyat',
        ringkasan: 'Program bantuan sosial terintegrasi diluncurkan untuk membantu 20 juta keluarga kurang mampu di seluruh Indonesia.',
        konten: 'Jakarta - Presiden resmi meluncurkan Program Kartu Sakti yang mengintegrasikan berbagai bantuan sosial dalam satu kartu. Program ini menargetkan 20 juta keluarga penerima manfaat dengan total anggaran mencapai 80 triliun rupiah per tahun. Kartu ini dapat digunakan untuk membeli sembako, membayar listrik, dan mengakses layanan kesehatan gratis. Pemerintah berharap program ini dapat mengurangi angka kemiskinan hingga 2% dalam 3 tahun ke depan. Distribusi kartu akan dimulai di Jawa dan bertahap ke seluruh Indonesia dalam 6 bulan.',
        kategori: 'Politik',
        gambar_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 145
    },
    {
        judul: 'DPR Setujui Revisi UU Pendidikan untuk Tingkatkan Kualitas SDM',
        slug: 'dpr-setujui-revisi-uu-pendidikan-untuk-tingkatkan-kualitas-sdm',
        ringkasan: 'Revisi Undang-Undang Pendidikan disahkan dengan fokus pada peningkatan kualitas guru dan infrastruktur sekolah.',
        konten: 'Jakarta - DPR RI resmi menyetujui revisi Undang-Undang Pendidikan dalam Rapat Paripurna dengan suara mayoritas. Revisi ini mencakup peningkatan tunjangan guru, pembangunan 10,000 sekolah baru di daerah terpencil, dan digitalisasi sistem pembelajaran. Anggaran pendidikan ditingkatkan menjadi 22% dari APBN untuk mendukung implementasi kebijakan baru. Menteri Pendidikan menyatakan bahwa fokus utama adalah meningkatkan kompetensi guru melalui pelatihan berkelanjutan dan sertifikasi internasional. Program beasiswa untuk mahasiswa berprestasi juga diperluas hingga 500,000 penerima per tahun.',
        kategori: 'Politik',
        gambar_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        views: 98
    },

    // Hiburan
    {
        judul: 'Film Indonesia Raih Penghargaan Bergengsi di Festival Film Internasional',
        slug: 'film-indonesia-raih-penghargaan-bergengsi-di-festival-film-internasional',
        ringkasan: 'Film drama karya sutradara muda Indonesia berhasil memenangkan Best Film di festival film bergengsi di Eropa.',
        konten: 'Cannes - Film Indonesia "Cahaya di Ujung Jalan" berhasil meraih penghargaan Best Film di Festival Film Cannes. Film yang disutradarai oleh filmmaker muda berbakat ini mengangkat cerita tentang perjuangan keluarga nelayan di pesisir Indonesia. Juri internasional memberikan pujian tinggi terhadap sinematografi yang menakjubkan dan akting para pemeran yang natural. Sutradara film berusia 32 tahun ini menjadi yang termuda yang pernah meraih penghargaan tersebut. Film akan mulai tayang di bioskop Indonesia bulan depan setelah kesuksesan di kancah internasional.',
        kategori: 'Hiburan',
        gambar_url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        views: 201
    },
    {
        judul: 'Konser Musik Internasional Terbesar Tahun Ini Akan Digelar di Jakarta',
        slug: 'konser-musik-internasional-terbesar-tahun-ini-akan-digelar-di-jakarta',
        ringkasan: 'Festival musik dengan lineup artis papan atas dunia dijadwalkan akan menggebrak Jakarta pada bulan depan.',
        konten: 'Jakarta - Promotor musik mengumumkan akan menggelar festival musik internasional terbesar di Indonesia dengan menghadirkan lebih dari 50 artis dari berbagai negara. Festival ini akan berlangsung selama 3 hari di Jakarta International Stadium dengan kapasitas 100,000 penonton per hari. Tiket akan dijual mulai minggu depan dengan harga mulai dari 1.5 juta rupiah. Sejumlah headliner termasuk band rock legendaris dan DJ terkenal dunia. Ini akan menjadi festival musik terbesar yang pernah diadakan di Asia Tenggara.',
        kategori: 'Hiburan',
        gambar_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 267
    },
    {
        judul: 'Serial Drama Indonesia Trending di Platform Streaming Global',
        slug: 'serial-drama-indonesia-trending-di-platform-streaming-global',
        ringkasan: 'Serial televisi Indonesia menduduki peringkat teratas di platform streaming internasional, ditonton jutaan orang di 50 negara.',
        konten: 'Jakarta - Serial drama "Kisah Nusantara" yang diproduksi oleh rumah produksi lokal berhasil menembus pasar global dengan menduduki Top 10 di platform streaming terbesar dunia. Serial yang terdiri dari 12 episode ini mengangkat kearifan lokal Indonesia dengan cinematography berkelas internasional. Ditonton oleh lebih dari 20 juta penonton dalam 2 minggu pertama, serial ini mendapat rating 8.9/10. Platform streaming tersebut telah memesan season kedua dengan budget yang lebih besar. Para aktor dan kru produksi menyatakan bangga bisa mengharumkan nama Indonesia di kancah internasional.',
        kategori: 'Hiburan',
        gambar_url: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 189
    },

    // Bisnis
    {
        judul: 'Bursa Saham Indonesia Cetak Rekor Tertinggi dalam Sejarah',
        slug: 'bursa-saham-indonesia-cetak-rekor-tertinggi-dalam-sejarah',
        ringkasan: 'Indeks Harga Saham Gabungan (IHSG) mencatatkan level tertinggi sepanjang masa didukung sentimen positif investor asing.',
        konten: 'Jakarta - Bursa Efek Indonesia (BEI) mencatat pencapaian bersejarah dengan IHSG menembus level 8,000 untuk pertama kalinya. Penguatan ini didorong oleh masuknya modal asing dan kinerja emiten yang solid. Kapitalisasi pasar mencapai 10,000 triliun rupiah, meningkat 25% dibanding tahun lalu. Analis pasar modal menyatakan outlook positif akan berlanjut hingga akhir tahun didukung pertumbuhan ekonomi yang kuat dan stabilitas politik. Investor retail juga semakin aktif dengan jumlah investor mencapai 12 juta orang, naik signifikan dari tahun sebelumnya.',
        kategori: 'Bisnis',
        gambar_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 134
    },
    {
        judul: 'E-Commerce Indonesia Raih Transaksi Rp 500 Triliun di Kuartal Pertama',
        slug: 'e-commerce-indonesia-raih-transaksi-rp-500-triliun-di-kuartal-pertama',
        ringkasan: 'Industri e-commerce Indonesia mencatatkan pertumbuhan fantastis dengan nilai transaksi mencapai setengah kuadriliun rupiah.',
        konten: 'Jakarta - Asosiasi E-Commerce Indonesia merilis data bahwa total transaksi e-commerce mencapai 500 triliun rupiah di kuartal pertama tahun ini, naik 40% year-on-year. Pertumbuhan ini didorong oleh penetrasi internet yang meningkat dan perubahan perilaku konsumen yang lebih suka berbelanja online. Kategori produk fashion, elektronik, dan kebutuhan sehari-hari mendominasi transaksi. Asosiasi memproyeksikan total transaksi tahun ini bisa mencapai 2.5 kuadriliun rupiah. Platform e-commerce lokal dan global bersaing ketat untuk merebut pangsa pasar dengan berbagai strategi promosi dan inovasi layanan.',
        kategori: 'Bisnis',
        gambar_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 167
    },

    // Kesehatan
    {
        judul: 'Terobosan Baru: Vaksin Malaria Buatan Indonesia Lulus Uji Klinis',
        slug: 'terobosan-baru-vaksin-malaria-buatan-indonesia-lulus-uji-klinis',
        ringkasan: 'Peneliti Indonesia berhasil mengembangkan vaksin malaria dengan efektivitas 95%, siap diproduksi massal tahun depan.',
        konten: 'Jakarta - Tim peneliti dari universitas terkemuka Indonesia berhasil mengembangkan vaksin malaria yang menunjukkan efektivitas mencapai 95% dalam uji klinis fase III. Vaksin ini dikembangkan selama 8 tahun dengan melibatkan 5,000 partisipan di berbagai wilayah endemis malaria. Kementerian Kesehatan merencanakan produksi massal mulai tahun depan dengan target 10 juta dosis untuk wilayah Indonesia Timur. WHO telah memberikan apresiasi tinggi atas inovasi ini dan mempertimbangkan untuk merekomendasikan vaksin tersebut untuk negara-negara lain. Vaksin ini diprediksi akan menurunkan kasus malaria hingga 80% dalam 5 tahun.',
        kategori: 'Kesehatan',
        gambar_url: 'https://images.unsplash.com/photo-1583912086296-be5c4b0e9b7d?auto=format&fit=crop&w=1200&q=80',
        is_featured: true,
        views: 245
    },
    {
        judul: 'Rumah Sakit di Indonesia Terapkan Teknologi AI untuk Diagnosis Penyakit',
        slug: 'rumah-sakit-di-indonesia-terapkan-teknologi-ai-untuk-diagnosis-penyakit',
        ringkasan: 'Sistem kecerdasan buatan digunakan untuk membantu dokter mendiagnosis penyakit dengan akurasi hingga 98%.',
        konten: 'Jakarta - Sejumlah rumah sakit besar di Indonesia mulai mengimplementasikan teknologi artificial intelligence untuk membantu diagnosis penyakit. Sistem AI ini dapat menganalisis hasil rontgen, CT scan, dan MRI dengan akurasi mencapai 98% dan waktu pemrosesan yang jauh lebih cepat. Dokter dapat menggunakan rekomendasi AI sebagai second opinion untuk meningkatkan ketepatan diagnosis. Teknologi ini terbukti sangat membantu dalam mendeteksi kanker stadium awal, penyakit jantung, dan stroke. Kementerian Kesehatan berencana memperluas penggunaan teknologi ini ke 100 rumah sakit di seluruh Indonesia dalam 2 tahun ke depan.',
        kategori: 'Kesehatan',
        gambar_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 156
    },
    {
        judul: 'Program Diet Sehat Gratis untuk Cegah Diabetes Diluncurkan Pemerintah',
        slug: 'program-diet-sehat-gratis-untuk-cegah-diabetes-diluncurkan-pemerintah',
        ringkasan: 'Kementerian Kesehatan meluncurkan program edukasi dan konsultasi gizi gratis untuk mencegah meningkatnya kasus diabetes.',
        konten: 'Jakarta - Menghadapi peningkatan kasus diabetes yang mencapai 12 juta orang di Indonesia, Kementerian Kesehatan meluncurkan program nasional "Indonesia Sehat". Program ini menyediakan konsultasi gizi gratis di 10,000 puskesmas, aplikasi mobile untuk monitoring kesehatan, dan kelas edukasi diet sehat. Target program adalah menurunkan angka diabetes 30% dalam 5 tahun. Masyarakat dapat mengakses layanan melalui aplikasi atau datang langsung ke puskesmas terdekat. Para ahli gizi akan membantu menyusun menu makanan sehat yang disesuaikan dengan kondisi masing-masing individu.',
        kategori: 'Kesehatan',
        gambar_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
        is_featured: false,
        views: 123
    }
];

/**
 * Get random number between min and max
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Login as admin to get auth token
 */
async function loginAsAdmin() {
    console.log('🔐 Logging in as admin...');

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        if (response.data.success && response.data.data.token) {
            console.log('✅ Admin login successful');
            return response.data.data.token;
        } else {
            throw new Error('Failed to get auth token');
        }
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('❌ Invalid admin credentials. Please check ADMIN_EMAIL and ADMIN_PASSWORD in .env');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('❌ Cannot connect to API server. Make sure the server is running at', API_URL);
        } else {
            console.error('❌ Login error:', error.message);
        }
        throw error;
    }
}

/**
 * Seed Categories via API
 */
async function seedCategories(token) {
    console.log('🌱 Seeding categories via API...');

    try {
        // Get existing categories
        const response = await axios.get(`${API_URL}/api/kategori`);
        const existingCategories = response.data.data || [];
        const existingSlugs = existingCategories.map(cat => cat.slug);

        // Filter out categories that already exist
        const newCategories = categories.filter(cat => !existingSlugs.includes(cat.slug));

        if (newCategories.length === 0) {
            console.log('✅ All categories already exist, skipping...');
            return existingCategories;
        }

        // Insert new categories one by one
        const createdCategories = [];
        for (const kategori of newCategories) {
            try {
                const createResponse = await axios.post(
                    `${API_URL}/api/kategori`,
                    kategori,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (createResponse.data.success) {
                    createdCategories.push(createResponse.data.data);
                    console.log(`✅ Created category: ${kategori.nama}`);
                }
            } catch (error) {
                console.error(`❌ Failed to create category ${kategori.nama}:`, error.response?.data?.message || error.message);
            }
        }

        console.log(`✅ Successfully created ${createdCategories.length} new categories`);

        // Return all categories (existing + new)
        const allCategoriesResponse = await axios.get(`${API_URL}/api/kategori`);
        return allCategoriesResponse.data.data || [];
    } catch (error) {
        console.error('❌ Error seeding categories:', error.message);
        throw error;
    }
}

/**
 * Seed News Articles via API
 */
async function seedBerita(token, kategoris) {
    console.log('🌱 Seeding berita via API...');

    try {
        // Create a map of kategori name to ID
        const kategoriMap = {};
        kategoris.forEach(kat => {
            kategoriMap[kat.nama] = kat.id;
        });

        // Get existing berita
        const response = await axios.get(`${API_URL}/api/berita?status=all&limit=100`);
        const existingBerita = response.data.data || [];
        const existingSlugs = existingBerita.map(b => b.slug);

        // Filter out berita that already exist
        const newBerita = newsArticles.filter(article => !existingSlugs.includes(article.slug));

        if (newBerita.length === 0) {
            console.log('✅ All berita already exist, skipping...');
            return;
        }

        // Insert berita one by one
        let totalInserted = 0;
        for (const article of newBerita) {
            try {
                const beritaData = {
                    judul: article.judul,
                    slug: article.slug,
                    konten: article.konten,
                    ringkasan: article.ringkasan,
                    gambar_url: article.gambar_url,
                    kategori_id: kategoriMap[article.kategori],
                    status: 'published',
                    is_featured: article.is_featured,
                    views: article.views || getRandomInt(10, 200)
                };

                const createResponse = await axios.post(
                    `${API_URL}/api/berita`,
                    beritaData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (createResponse.data.success) {
                    totalInserted++;
                    console.log(`✅ Created berita: ${article.judul.substring(0, 50)}...`);
                }
            } catch (error) {
                console.error(`❌ Failed to create berita "${article.judul.substring(0, 30)}...":`,
                    error.response?.data?.message || error.message);
            }
        }

        console.log(`✅ Successfully created ${totalInserted} berita articles`);
    } catch (error) {
        console.error('❌ Error seeding berita:', error.message);
        throw error;
    }
}

/**
 * Main seeder function
 */
async function main() {
    console.log('🚀 Starting API-based seeder...\n');
    console.log(`📡 API URL: ${API_URL}`);
    console.log(`👤 Admin Email: ${ADMIN_EMAIL}\n`);

    try {
        // Step 1: Login as admin
        const token = await loginAsAdmin();

        console.log(''); // Empty line for readability

        // Step 2: Seed categories
        const kategoris = await seedCategories(token);

        console.log(''); // Empty line for readability

        // Step 3: Seed berita
        await seedBerita(token, kategoris);

        console.log('\n✨ Seeding completed successfully!');
        console.log('💡 Tip: You can verify the data by checking your database or visiting the API endpoints.');
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Seeding failed:', error.message);
        console.error('\n⚠️  Make sure:');
        console.error('   1. API server is running (npm run dev)');
        console.error('   2. Admin credentials are correct in .env');
        console.error('   3. Database connection is working');
        process.exit(1);
    }
}

// Run the seeder
main();
