/**
 * Master Kurikulum & Taksonomi Kompetensi LMS TKA SD
 * Mengacu pada kerangka asesmen Perkaban BSKAP No. 047/H/AN/2025 & SPM Plus TKA 2026
 */
export const DAFTAR_MATA_PELAJARAN = [
  // ==========================================
  // KELOMPOK A — TES KEMAMPUAN AKADEMIK (TKA)
  // ==========================================
  {
    id: "bahasa-indonesia",
    nama: "Bahasa Indonesia",
    kelompok: "tka",
    deskripsi: "Literasi membaca wacana nonfiksi, analisis teks sastra fiksi, dan tata kebahasaan.",
    kurikulum: "Standar TKA Kemendikdasmen",
    aktif: true,
    topik: [
      {
        id: "ind-informasi",
        nama: "Teks Informasi & Literasi Visual",
        deskripsi: "Membaca teks laporan, eksplanasi, instruksi/prosedur, serta membaca infografik dan brosur.",
        kompetensiId: "KOMP-IND-01"
      },
      {
        id: "ind-fiksi",
        nama: "Teks Sastra & Fiksi",
        deskripsi: "Memahami watak tokoh, latar, amanat cerita fabel/cerpen, pantun nasehat, serta puisi anak.",
        kompetensiId: "KOMP-IND-02"
      },
      {
        id: "ind-kebahasaan",
        nama: "Tata Bahasa & Gaya Bahasa",
        deskripsi: "Makna kata, bentukan imbuhan, majas (personifikasi/metafora), peribahasa, dan tanda baca.",
        kompetensiId: "KOMP-IND-03"
      }
    ]
  },
  {
    id: "matematika",
    nama: "Matematika",
    kelompok: "tka",
    deskripsi: "Penalaran bilangan cacah & pecahan, geometri ruang, serta interpretasi diagram data.",
    kurikulum: "Standar TKA Kemendikdasmen",
    aktif: true,
    topik: [
      {
        id: "mat-bilangan",
        nama: "Bilangan & Operasi Hitung",
        deskripsi: "Operasi hitung campuran bilangan cacah, pecahan biasa/campuran, desimal, dan persentase.",
        kompetensiId: "KOMP-MAT-01"
      },
      {
        id: "mat-geometri",
        nama: "Pengukuran & Geometri",
        deskripsi: "Keliling dan luas bangun datar, volume kubus/balok, serta penalaran waktu dan satuan debit.",
        kompetensiId: "KOMP-MAT-02"
      },
      {
        id: "mat-data",
        nama: "Data & Statistika Dasar",
        deskripsi: "Membaca tabel turus, diagram gambar (piktogram), diagram batang, dan perbandingan selisih nilai.",
        kompetensiId: "KOMP-MAT-03"
      }
    ]
  },

  // ==========================================
  // KELOMPOK B — UJIAN AKHIR SEKOLAH (UAS)
  // ==========================================
  {
    id: "ipas",
    nama: "IPAS",
    kelompok: "ujian_sekolah",
    deskripsi: "Sistem pernapasan, rantai makanan ekosistem, sifat energi, dan peristiwa alam.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "ipas-ekosistem", nama: "Sistem Tubuh & Ekosistem Lingkungan", kompetensiId: "KOMP-IPAS-01" },
      { id: "ipas-energi", nama: "Energi & Perubahannya", kompetensiId: "KOMP-IPAS-02" }
    ]
  },
  {
    id: "pendidikan-pancasila",
    nama: "Pendidikan Pancasila",
    kelompok: "ujian_sekolah",
    deskripsi: "Penerapan nilai sila Pancasila, norma sosial, hak dan kewajiban warga negara.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "pan-sila", nama: "Pengamalan Butir Sila Pancasila", kompetensiId: "KOMP-PAN-01" },
      { id: "pan-norma", nama: "Aturan, Hak, dan Kewajiban", kompetensiId: "KOMP-PAN-02" }
    ]
  },
  {
    id: "bahasa-inggris",
    nama: "Bahasa Inggris",
    kelompok: "ujian_sekolah",
    deskripsi: "Kosakata fungsional harian dan pemahaman teks instruksi pendek.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "ing-vocab", nama: "Vocabulary & Reading Comprehension", kompetensiId: "KOMP-ENG-01" }
    ]
  },
  {
    id: "pendidikan-agama",
    nama: "Pendidikan Agama & Budi Pekerti",
    kelompok: "ujian_sekolah",
    deskripsi: "Penanaman budi pekerti, nilai keimanan, dan moderasi beragama.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "agm-akhlak", nama: "Budi Pekerti Luhur & Toleransi", kompetensiId: "KOMP-AGM-01" }
    ]
  },
  {
    id: "pjok",
    nama: "PJOK",
    kelompok: "ujian_sekolah",
    deskripsi: "Kebugaran jasmani, pemeliharaan kebersihan diri, dan pola hidup sehat.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "pjok-kebugaran", nama: "Kebugaran Fisik & Pola Sehat", kompetensiId: "KOMP-PJK-01" }
    ]
  },
  {
    id: "seni-budaya",
    nama: "Seni Budaya",
    kelompok: "ujian_sekolah",
    deskripsi: "Unsur seni rupa, apresiasi ragam motif tradisional nusantara, dan irama nada.",
    kurikulum: "Kurikulum Merdeka (Sekolah)",
    aktif: true,
    topik: [
      { id: "seni-rupa", nama: "Apresiasi Seni & Kebudayaan Daerah", kompetensiId: "KOMP-SNI-01" }
    ]
  },
  {
    id: "muatan-lokal",
    nama: "Muatan Lokal",
    kelompok: "ujian_sekolah",
    deskripsi: "Bahasa daerah dan kearifan budaya daerah setempat.",
    kurikulum: "Kurikulum Sekolah",
    aktif: true,
    topik: [
      { id: "mulok-bahasa", nama: "Bahasa & Tradisi Lokal", kompetensiId: "KOMP-MLK-01" }
    ]
  }
];
