# Seeding Database dengan API

## Prasyarat

Sebelum menjalankan seeding, pastikan:

1. **Server API sudah berjalan**:
   ```bash
   npm run dev
   ```

2. **Ada user dengan role admin**: Seeding memerlukan autentikasi sebagai admin.

## Cara Setup Admin User

### Opsi 1: Buat Admin User Baru (Recommended)

1. Tambahkan credentials di `.env`:
   ```env
   ADMIN_EMAIL=admin@berita.com
   ADMIN_PASSWORD=admin123
   ```

2. Jalankan script untuk membuat admin:
   ```bash
   node src/scripts/createAdmin.js
   ```

3. **PENTING**: Update role menjadi admin di Supabase Dashboard:
   - Buka Supabase Dashboard → Table Editor → `users`
   - Cari user dengan email `admin@berita.com`
   - Edit kolom `role` menjadi `admin`
   
   Atau jalankan SQL query ini:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@berita.com';
   ```

### Opsi 2: Gunakan User Admin yang Sudah Ada

Jika sudah punya user admin, tambahkan credentials di `.env`:
```env
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-password
```

## Menjalankan Seeding

Setelah admin user siap, jalankan:

```bash
npm run seed
```

Atau:

```bash
node src/scripts/seedBerita.js
```

## Output yang Diharapkan

Jika berhasil, Anda akan melihat output seperti:

```
🚀 Starting API-based seeder...

📡 API URL: http://localhost:3000
👤 Admin Email: admin@berita.com

🔐 Logging in as admin...
✅ Admin login successful

🌱 Seeding categories via API...
✅ Created category: Teknologi
✅ Created category: Olahraga
✅ Created category: Politik
✅ Created category: Hiburan
✅ Created category: Bisnis
✅ Created category: Kesehatan
✅ Successfully created 6 new categories

🌱 Seeding berita via API...
✅ Created berita: Smartphone Terbaru dengan Teknologi AI Canggih Dil...
✅ Created berita: Startup Indonesia Raih Pendanaan Rp 100 Miliar u...
...
✅ Successfully created 15 berita articles

✨ Seeding completed successfully!
💡 Tip: You can verify the data by checking your database or visiting the API endpoints.
```

## Troubleshooting

### Error: Invalid admin credentials

- Pastikan email dan password di `.env` benar
- Pastikan user dengan email tersebut ada di database
- Pastikan role user adalah `admin` (bukan `user`)

### Error: Cannot connect to API server

- Pastikan server API sudah running: `npm run dev`
- Pastikan server berjalan di `http://localhost:3000`
- Jika menggunakan port lain, update `API_URL` di `.env`

### Error: Failed to create berita/category

- Cek log error untuk detail
- Pastikan database connection bekerja
- Pastikan token admin valid

## Verifikasi Data

Setelah seeding berhasil, verifikasi dengan:

1. **Via Supabase Dashboard**:
   - Cek table `kategori` (harus ada 6 kategori)
   - Cek table `berita` (harus ada 15+ berita)

2. **Via API**:
   ```bash
   curl http://localhost:3000/api/kategori
   curl http://localhost:3000/api/berita
   ```

3. **Via Web App**:
   - Buka web app Anda
   - Pastikan berita tampil dengan gambar dari Unsplash
