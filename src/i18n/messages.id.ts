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
