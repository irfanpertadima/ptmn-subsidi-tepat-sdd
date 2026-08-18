/**
 * Bahasa Indonesia message catalogue.
 *
 * Every user-facing string in the product lives here, so copy can be reviewed by people who do not
 * read TSX and a second language can be added without touching component code.
 *
 * Keys are dot-namespaced by journey step. Keep the copy at a general reading level — the audience
 * includes low-literacy users (see the Epic BRD).
 */
export const messagesId = {
  'app.name': 'Subsidi Tepat',
  'app.tagline': 'Pendaftaran Kendaraan',

  'nav.skipToContent': 'Lewati ke konten utama',
  'nav.back': 'Kembali',
  'nav.continue': 'Lanjutkan',

  // Registration journey
  'daftar.title': 'Pendaftaran Kendaraan',
  'daftar.intro':
    'Daftarkan kendaraan Anda untuk dapat membeli BBM bersubsidi. Proses ini memerlukan sekitar 8 menit.',
  'daftar.persetujuan.title': 'Persetujuan Data Pribadi',
  'daftar.identitas.title': 'Data Identitas',
  'daftar.kendaraan.title': 'Data Kendaraan',
  'daftar.dokumen.title': 'Unggah Dokumen',
  'daftar.ringkasan.title': 'Periksa Kembali',
  'daftar.selesai.title': 'Pendaftaran Terkirim',

  // Vehicle journey
  'kendaraan.title': 'Kendaraan Saya',
  'kendaraan.detail.title': 'Detail Pendaftaran',
  'kendaraan.qr.title': 'Kode QR',

  // Status labels — always paired with an icon, never colour alone.
  'status.menunggu': 'Menunggu Verifikasi',
  'status.terverifikasi': 'Terverifikasi',
  'status.ditolak': 'Ditolak',

  // Step counter — position is announced, never conveyed by styling alone.
  'langkah.dari': 'Langkah {current} dari {total}',

  // Program explainer (/daftar)
  'daftar.program.judul': 'Tentang Program Subsidi Tepat',
  'daftar.program.penjelasan':
    'Subsidi Tepat memastikan BBM bersubsidi diterima oleh yang berhak. Setelah kendaraan Anda terdaftar dan diverifikasi, Anda akan menerima kode QR untuk digunakan saat membeli BBM di SPBU.',
  'daftar.program.durasi': 'Verifikasi memerlukan waktu 3-5 hari kerja.',
  'daftar.program.hasil': 'Setelah disetujui, Anda menerima kode QR yang dapat diunduh dan dicetak.',

  'daftar.jenis.judul': 'Pilih Jenis Kendaraan',
  'daftar.jenis.roda2': 'Roda 2 (Sepeda Motor)',
  'daftar.jenis.roda4': 'Roda 4 (Mobil)',
  'daftar.jenis.wajib': 'Pilih jenis kendaraan terlebih dahulu',

  'daftar.dokumen.judul': 'Dokumen yang Perlu Disiapkan',
  'daftar.dokumen.ktp': 'KTP asli',
  'daftar.dokumen.stnk': 'STNK kendaraan',
  'daftar.dokumen.fotoKendaraan': 'Foto kendaraan (tampak depan dengan plat nomor terbaca, dan tampak samping)',

  // Consent gate (/daftar/persetujuan)
  'persetujuan.judul': 'Persetujuan Data Pribadi',
  'persetujuan.pengantar':
    'Sebelum melanjutkan, harap baca pemberitahuan privasi berikut dan berikan persetujuan Anda.',
  'persetujuan.notice.judul': 'Pemberitahuan Privasi',
  'persetujuan.notice.dasarJudul': 'Dasar Pemrosesan',
  'persetujuan.notice.dasar':
    'Data Anda diproses untuk kepentingan umum dalam pelaksanaan program subsidi BBM, sesuai UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Persetujuan Anda tetap kami minta secara tegas karena Anda menyerahkan data ini secara langsung.',
  'persetujuan.notice.dataJudul': 'Data yang Dikumpulkan',
  'persetujuan.notice.data':
    'Nomor Induk Kependudukan (NIK), nama lengkap, tanggal lahir, alamat, nomor telepon, foto KTP, data dan foto STNK, nomor polisi, serta foto kendaraan.',
  'persetujuan.notice.retensiJudul': 'Jangka Waktu Penyimpanan',
  // Mirrors the DPIA's retention table exactly. The backend period is deliberately unquantified
  // there ("life of the registration plus the statutory audit period"), so this must not invent a
  // number — see the open item raised against the DPO in tasks.md 7.2.
  'persetujuan.notice.retensi':
    'Data pendaftaran yang Anda kirim disimpan selama kendaraan terdaftar dalam program, ditambah periode audit sesuai ketentuan yang berlaku. Data yang Anda isi di peramban dihapus saat pendaftaran dikirim, saat Anda keluar, dan paling lama setelah 7 hari.',
  'persetujuan.notice.hakJudul': 'Hak Anda',
  'persetujuan.notice.hak':
    'Anda berhak mengakses, memperbaiki, dan menghapus data Anda, menarik persetujuan, mengajukan keberatan atas pemrosesan, serta meminta salinan data Anda. Permintaan dapat diajukan melalui pusat bantuan MyPertamina.',
  'persetujuan.notice.penarikanJudul': 'Menarik Persetujuan',
  'persetujuan.notice.penarikan':
    'Anda dapat menarik persetujuan kapan saja melalui pusat bantuan MyPertamina. Jika persetujuan ditarik, pendaftaran yang sedang berjalan dihentikan dan kode QR yang sudah diterbitkan tidak lagi berlaku.',

  'persetujuan.registrasi.label':
    'Saya setuju data pribadi saya diproses untuk keperluan pendaftaran kendaraan program Subsidi Tepat.',
  'persetujuan.analitik.label':
    'Saya setuju data penggunaan anonim dikumpulkan untuk membantu perbaikan layanan. (opsional)',
  'persetujuan.wajib': 'Persetujuan diperlukan untuk melanjutkan pendaftaran',
  'persetujuan.setuju': 'Saya Setuju',
  'persetujuan.tolak': 'Tidak Setuju',

  'persetujuan.ditolak.judul': 'Pendaftaran Tidak Dapat Dilanjutkan',
  'persetujuan.ditolak.penjelasan':
    'Tanpa persetujuan pemrosesan data pribadi, pendaftaran kendaraan tidak dapat diproses. Anda dapat kembali dan meninjau ulang pemberitahuan privasi kapan saja.',
  'persetujuan.ditolak.kembali': 'Kembali ke Persetujuan',

  'consent.checking': 'Memeriksa persetujuan',

  // System states
  'error.title': 'Terjadi Kesalahan',
  'error.body': 'Maaf, terjadi kesalahan. Silakan coba lagi.',
  'error.retry': 'Coba Lagi',
  'notFound.title': 'Halaman Tidak Ditemukan',
  'notFound.body': 'Halaman yang Anda cari tidak tersedia.',
  'notFound.home': 'Kembali ke Beranda',
  'offline.title': 'Tidak Ada Koneksi',
  'offline.body': 'Data yang sudah Anda isi tetap tersimpan.',
} as const;

export type MessageKey = keyof typeof messagesId;
