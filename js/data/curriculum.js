/**
 * Master Data Kurikulum & Mata Pelajaran LMS TKA SD
 * Mendukung konfigurasi multi-mapel untuk Persiapan TKA dan Ujian Sekolah.
 */
export const DAFTAR_MATA_PELAJARAN = [
  // Kelompok A: Persiapan TKA
  {
    id: "matematika",
    nama: "Matematika",
    kelompok: "tka",
    kelompokLabel: "Persiapan TKA",
    deskripsi: "Domain Bilangan, Geometri, Pengukuran, dan Penalaran Data.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka / Standar TKA",
    aktif: true,
    topik: [
      { id: "mat-bilangan", nama: "Bilangan & Operasi Hitung", kompetensiId: "KOMP-MAT-01" },
      { id: "mat-geometri", nama: "Geometri & Pengukuran", kompetensiId: "KOMP-MAT-02" },
      { id: "mat-data", nama: "Data & Analisis", kompetensiId: "KOMP-MAT-03" }
    ]
  },
  {
    id: "bahasa-indonesia",
    nama: "Bahasa Indonesia",
    kelompok: "tka",
    kelompokLabel: "Persiapan TKA",
    deskripsi: "Literasi Membaca: Teks Informasi faktual dan Teks Fiksi naratif.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka / Standar TKA",
    aktif: true,
    topik: [
      { id: "ind-informasi", nama: "Teks Informasi (Faktual)", kompetensiId: "KOMP-IND-01" },
      { id: "ind-fiksi", nama: "Teks Sastra & Fiksi", kompetensiId: "KOMP-IND-02" }
    ]
  },

  // Kelompok B: Persiapan Ujian Sekolah
  {
    id: "ipas",
    nama: "IPAS",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Ilmu Pengetahuan Alam dan Sosial tingkat dasar.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "ipas-alam", nama: "Sistem Tubuh & Ekosistem", kompetensiId: "KOMP-IPAS-01" },
      { id: "ipas-sosial", nama: "Geografi & Sejarah Lokal", kompetensiId: "KOMP-IPAS-02" }
    ]
  },
  {
    id: "pendidikan-pancasila",
    nama: "Pendidikan Pancasila",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Nilai Pancasila, Norma, Hak, Kewajiban, dan Keberagaman.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "pancasila-dasar", nama: "Penerapan Sila Pancasila", kompetensiId: "KOMP-PAN-01" },
      { id: "pancasila-hukum", nama: "Aturan & Norma Kehidupan", kompetensiId: "KOMP-PAN-02" }
    ]
  },
  {
    id: "bahasa-inggris",
    nama: "Bahasa Inggris",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Kosakata fungsional, percakapan sederhana, dan deskripsi teks pendek.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "ing-vocab", nama: "Vocabulary & Daily Life", kompetensiId: "KOMP-ENG-01" },
      { id: "ing-reading", nama: "Short Functional Reading", kompetensiId: "KOMP-ENG-02" }
    ]
  },
  {
    id: "pendidikan-agama",
    nama: "Pendidikan Agama & Budi Pekerti",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Ajaran agama, akhlak terpuji, dan moderasi beragama.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "agm-akhlak", nama: "Budi Pekerti & Karakter", kompetensiId: "KOMP-AGM-01" }
    ]
  },
  {
    id: "pjok",
    nama: "PJOK",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Kebugaran jasmani, gerak manipulatif, dan pola hidup sehat.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "pjok-kebugaran", nama: "Aktivitas Kebugaran & Senam", kompetensiId: "KOMP-PJK-01" },
      { id: "pjok-kesehatan", nama: "Kesehatan Pribadi & Nutrisi", kompetensiId: "KOMP-PJK-02" }
    ]
  },
  {
    id: "seni-budaya",
    nama: "Seni Budaya",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Seni rupa, musik, tari, dan kerajinan berbasis kearifan lokal.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Merdeka",
    aktif: true,
    topik: [
      { id: "seni-rupa", nama: "Unsur Seni Rupa & Pola Hias", kompetensiId: "KOMP-SNI-01" },
      { id: "seni-musik", nama: "Tangga Nada & Alat Musik Daerah", kompetensiId: "KOMP-SNI-02" }
    ]
  },
  {
    id: "muatan-lokal",
    nama: "Muatan Lokal",
    kelompok: "ujian_sekolah",
    kelompokLabel: "Ujian Akhir Sekolah",
    deskripsi: "Bahasa daerah dan kebudayaan sesuai kurikulum satuan pendidikan.",
    kelas: "6 SD",
    kurikulum: "Kurikulum Sekolah",
    aktif: true,
    topik: [
      { id: "mulok-bahasa", nama: "Bahasa & Sastra Daerah", kompetensiId: "KOMP-MLK-01" }
    ]
  }
];
