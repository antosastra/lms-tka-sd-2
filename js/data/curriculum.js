/**
 * Konfigurasi Kurikulum & Mata Pelajaran LMS TKA SD
 */
export const DAFTAR_MATA_PELAJARAN = [
  // Kelompok A — Persiapan TKA
  {
    id: "matematika",
    nama: "Matematika",
    kelompok: "A",
    deskripsi: "Bilangan, Geometri & Pengukuran, serta Analisis Data.",
    ikon: "calculator",
    warna: "blue",
    topik: [
      { id: "mat-bilangan", nama: "Bilangan & Operasi Hitung" },
      { id: "mat-geometri", nama: "Geometri & Pengukuran" },
      { id: "mat-data", nama: "Pengolahan & Penyajian Data" }
    ]
  },
  {
    id: "bahasa-indonesia",
    nama: "Bahasa Indonesia",
    kelompok: "A",
    deskripsi: "Teks Informasi Faktual, Sastra Fiksi, dan Struktur Kebahasaan.",
    ikon: "book-open",
    warna: "indigo",
    topik: [
      { id: "ind-informasi", nama: "Teks Informasi (Literasi Membaca)" },
      { id: "ind-fiksi", nama: "Teks Fiksi & Nilai Moral" },
      { id: "ind-bahasa", nama: "Tata Bahasa & Kalimat Efektif" }
    ]
  },

  // Kelompok B — Persiapan Ujian Akhir Sekolah
  {
    id: "ipas",
    nama: "IPAS",
    kelompok: "B",
    deskripsi: "Ekosistem Lingkungan, Gejala Alam, dan Kehidupan Sosial.",
    ikon: "compass",
    warna: "emerald",
    topik: [
      { id: "ipas-ekosistem", nama: "Ekosistem & Keseimbangan Lingkungan" },
      { id: "ipas-energi", nama: "Energi & Perubahannya" }
    ]
  },
  {
    id: "pendidikan-pancasila",
    nama: "Pendidikan Pancasila",
    kelompok: "B",
    deskripsi: "Penerapan Nilai Pancasila, Norma, Hak, dan Kewajiban Warga Negara.",
    ikon: "shield-check",
    warna: "amber",
    topik: [
      { id: "pan-nilai", nama: "Penerapan Sila Pancasila" },
      { id: "pan-norma", nama: "Norma & Hukum di Masyarakat" }
    ]
  },
  {
    id: "bahasa-inggris",
    nama: "Bahasa Inggris",
    kelompok: "B",
    deskripsi: "Reading Comprehension, Vocabulary, and Basic Contextual Grammar.",
    ikon: "languages",
    warna: "sky",
    topik: [
      { id: "ing-reading", nama: "Reading Comprehension" }
    ]
  },
  {
    id: "pendidikan-agama",
    nama: "Pendidikan Agama & Budi Pekerti",
    kelompok: "B",
    deskripsi: "Nilai Spiritual, Akhlak Mulia, dan Toleransi Beragama.",
    ikon: "heart-handshake",
    warna: "teal",
    topik: [
      { id: "agm-akhlak", nama: "Budi Pekerti & Akhlak Mulia" }
    ]
  },
  {
    id: "pjok",
    nama: "PJOK",
    kelompok: "B",
    deskripsi: "Pola Hidup Sehat, Kebugaran Jasmani, dan Keselamatan Diri.",
    ikon: "activity",
    warna: "orange",
    topik: [
      { id: "pjk-kesehatan", nama: "Pola Hidup Sehat & Kebugaran" }
    ]
  },
  {
    id: "seni-budaya",
    nama: "Seni Budaya",
    kelompok: "B",
    deskripsi: "Apresiasi Karya Seni Rupa, Musik, dan Ragam Budaya Daerah.",
    ikon: "palette",
    warna: "rose",
    topik: [
      { id: "sni-karya", nama: "Apresiasi Ragam Budaya" }
    ]
  },
  {
    id: "muatan-lokal",
    nama: "Muatan Lokal",
    kelompok: "B",
    deskripsi: "Bahasa Daerah dan Pengetahuan Kebudayaan Daerah Setempat.",
    ikon: "map-pin",
    warna: "purple",
    topik: [
      { id: "mulok-daerah", nama: "Kearifan Lokal" }
    ]
  }
];
