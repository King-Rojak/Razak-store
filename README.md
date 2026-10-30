# RAZAK STORE — Testing MVP

Prototype toko digital dengan dashboard admin, katalog, keranjang, checkout simulasi, lookup pesanan, dan endpoint webhook awal.

## Jalankan di Android (Acode)

1. Ekstrak `razak-store-test.zip`.
2. Buka folder hasil ekstrak di Acode.
3. Buka `index.html` lalu gunakan Preview/browser.
4. Klik **Admin** untuk mengelola produk, pesanan, pengaturan, dan integrasi.
5. Tambahkan produk ke keranjang, checkout, lalu uji status pesanan melalui menu **Pesanan**.

Prototype frontend menyimpan data di `localStorage` browser. Data hanya ada di browser/perangkat tersebut dan dapat hilang jika data situs dihapus.

## Deploy frontend + API ke Vercel

1. Upload folder ini ke repository GitHub.
2. Import repository ke Vercel.
3. Tambahkan environment variables berdasarkan `.env.example`.
4. Deploy ulang setelah menambahkan environment variables.
5. Endpoint webhook akan tersedia di `https://DOMAIN-KAMU/api/webhook`.

Untuk uji endpoint manual:
- `POST https://DOMAIN-KAMU/api/test-webhook`
- Header `x-test-key: nilai TEST_ENDPOINT_KEY`
- Body JSON bebas.

## Hubungkan webhook SociaBuzz

Di SociaBuzz SHOP > Page Settings > Integrations > Webhook:
- Webhook URL: `https://DOMAIN-KAMU/api/webhook`
- Webhook Token: samakan dengan `SOCIABUZZ_WEBHOOK_TOKEN` hanya setelah memastikan cara SociaBuzz mengirim token.
- Gunakan tombol Test Notification.

**PENTING:** dokumentasi publik SociaBuzz yang ditemukan menjelaskan cara mengaktifkan webhook, tetapi belum memaparkan secara lengkap nama header autentikasi dan skema payload SHOP. Karena itu, endpoint ini adalah kerangka awal yang perlu disesuaikan setelah kita menerima test notification asli. Jangan mengaktifkan pengiriman produk atau menandai pesanan lunas berdasarkan payload yang belum diverifikasi.

## Supabase (opsional pada tahap awal)

1. Buat project Supabase.
2. Buka SQL Editor, jalankan isi `schema.sql`.
3. Isi `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di Vercel.
4. Jangan pernah menaruh service role key di `index.html` atau `app.js`.
5. Sebelum menyimpan data pelanggan sungguhan, aktifkan RLS dan buat policy yang sesuai.

## Batasan versi testing

- Checkout hanya simulasi; tidak ada uang yang ditagihkan.
- Admin belum memakai autentikasi server. Jangan gunakan sebagai dashboard publik.
- Produk dan pesanan frontend masih lokal di browser.
- Webhook hanya menyimpan event mentah dan tidak otomatis mengubah status order.
- Checkout SociaBuzz yang tertanam di website eksternal belum terkonfirmasi tersedia. Webhook bukan API untuk membuat pembayaran.
- Gunakan akun dan layanan pembayaran sesuai ketentuan penyedia. Jangan memasukkan data identitas atau pembayaran asli untuk pengujian ini.
