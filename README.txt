TAUFIQ QUROHMAN — PORTFOLIO WEBSITE
===================================

MENJALANKAN WEBSITE
1. Extract folder Taufiq-Portfolio.
2. Buka folder tersebut di Visual Studio Code.
3. Install extension "Live Server".
4. Klik kanan index.html > Open with Live Server.
5. Website akan terbuka di browser.

TIDAK PERLU:
- Laragon
- Node.js / npm
- React
- Database

BAGIAN YANG WAJIB DIGANTI
1. assets/images/profile-placeholder.svg
   Ganti dengan foto profil kamu. Simpan dengan nama profile.jpg lalu ubah src
   pada index.html menjadi assets/images/profile.jpg.

2. assets/cv.pdf
   Letakkan CV PDF kamu dengan nama cv.pdf.

3. Project
   Ganti gambar di assets/projects/ dengan screenshot project asli kamu.
   Ubah judul, deskripsi, tahun, dan tag project di index.html.

4. Certificates
   Ganti assets/certificates/certificate-placeholder.svg dengan gambar sertifikat.
   Tambah/hapus kartu sertifikat sesuai jumlah sertifikat asli.

5. Kontak
   Cari emailkamu@example.com di index.html dan script.js, lalu ganti dengan email asli.
   Ganti juga tautan LinkedIn, Instagram, dan GitHub.

6. Pendidikan dan pengalaman
   Periksa bagian Education & Experience. Ganti placeholder dengan data yang benar.
   Jangan tampilkan pengalaman atau penghargaan yang belum kamu miliki.

STRUKTUR
index.html                  Struktur konten website
style.css                   Warna, layout, responsive, dan animasi
script.js                   Navigasi, reveal, tab, dan form kontak
assets/images/              Foto profil
assets/projects/            Gambar project
assets/certificates/        Gambar sertifikat
assets/cv.pdf               CV kamu

CATATAN
Form kontak memakai mailto, jadi aplikasi email pengunjung akan terbuka.
Agar pesan bisa dikirim langsung dari website, nantinya perlu layanan form/backend.
Opening cinematic memakai gambar latar dari Unsplash dan membutuhkan koneksi internet saat pertama kali dimuat. Kamu dapat mengganti URL gambar pada .intro-backdrop di style.css.

Website ini adalah template awal; isi profil, gambar, tautan, dan pengalaman perlu
diverifikasi dan diganti dengan informasi milikmu.
