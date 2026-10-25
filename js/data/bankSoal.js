/**
 * Bank Soal Standar Pembelajaran Internal LMS TKA SD
 * Format: Schema Version 1
 * Catatan Kepatuhan: Bukan soal resmi kementerian. Status bawaan: 'needs_review' / 'draft'.
 */
export const INITIAL_BANK_SOAL = [
  // --- KELOMPOK A: MATEMATIKA ---
  {
    id: "MAT-BIL-001",
    subjectId: "matematika",
    topicId: "mat-bilangan",
    competencyId: "Operasi Hitung Campuran Bilangan Cacah",
    grade: "6 SD",
    questionType: "PG",
    stimulus: "Sebuah koperasi sekolah memiliki persediaan 8 kotak buku tulis. Setiap kotak berisi 24 buku. Pada hari Senin, koperasi tersebut menjual 45 buku. Sisa buku yang belum terjual kemudian dibagikan secara merata kepada 3 ruang kelas untuk kegiatan literasi.",
    question: "Berapa banyak buku yang diterima oleh masing-masing ruang kelas?",
    options: [
      { id: "A", text: "49 buku" },
      { id: "B", text: "53 buku" },
      { id: "C", text: "63 buku" },
      { id: "D", text: "147 buku" }
    ],
    correctAnswer: "A",
    alternatives: [],
    explanation: "Total buku = 8 × 24 = 192 buku. Sisa buku setelah terjual = 192 - 45 = 147 buku. Bagian per kelas = 147 ÷ 3 = 49 buku.",
    difficulty: "Dasar",
    source: "Kurasi Tim Pengembang Internal LMS",
    verificationStatus: "needs_review",
    reviewNotes: "Perlu diverifikasi kecukupan alokasi waktu pengerjaan.",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },
  {
    id: "MAT-BIL-002",
    subjectId: "matematika",
    topicId: "mat-bilangan",
    competencyId: "Aritmetika Sosial Berbasis Transaksi",
    grade: "6 SD",
    questionType: "PG",
    stimulus: "Tabel Belanja Perlengkapan:\n• 4 buah Pensil 2B: @ Rp2.500\n• 2 buah Penghapus: @ Rp3.000\n• 1 buah Penggaris: @ Rp5.000\nDimas membayar total belanjaan dengan uang Rp50.000.",
    question: "Berapakah uang kembalian yang harus diterima Dimas?",
    options: [
      { id: "A", text: "Rp21.000" },
      { id: "B", text: "Rp29.000" },
      { id: "C", text: "Rp31.000" },
      { id: "D", text: "Rp39.500" }
    ],
    correctAnswer: "B",
    alternatives: [],
    explanation: "Biaya: (4×2.500) + (2×3.000) + (1×5.000) = 10.000 + 6.000 + 5.000 = Rp21.000. Kembalian: 50.000 - 21.000 = Rp29.000.",
    difficulty: "Dasar",
    source: "Kurasi Tim Pengembang Internal LMS",
    verificationStatus: "needs_review",
    reviewNotes: "",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },
  {
    id: "MAT-BIL-003",
    subjectId: "matematika",
    topicId: "mat-bilangan",
    competencyId: "Pecahan dan Desimal Kontekstual",
    grade: "6 SD",
    questionType: "ISIAN",
    stimulus: "Ibu memiliki persediaan 2,5 kg tepung terigu. Sebanyak 3/5 bagian dari tepung tersebut digunakan untuk membuat kue bolu.",
    question: "Berapa kilogram tepung terigu yang digunakan Ibu? (Tulis dalam desimal, misal: 1.5 atau 1,5)",
    options: [],
    correctAnswer: "1.5",
    alternatives: ["1,5", "1.5 kg", "1,5 kg"],
    explanation: "Tepung yang digunakan = 2,5 kg × (3/5) = 2,5 × 0,6 = 1,5 kg.",
    difficulty: "Menengah",
    source: "Kurasi Tim Pengembang Internal LMS",
    verificationStatus: "needs_review",
    reviewNotes: "Dukungan desimal titik dan koma wajib diuji.",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },

  // --- KELOMPOK A: BAHASA INDONESIA ---
  {
    id: "IND-INF-001",
    subjectId: "bahasa-indonesia",
    topicId: "ind-informasi",
    competencyId: "Informasi Tersurat Teks Faktual",
    grade: "6 SD",
    questionType: "PG",
    stimulus: "Hutan Mangrove: Benteng Alami Pesisir Indonesia\nAkar mangrove yang rapat berfungsi sebagai pemecah gelombang alami. Keberadaan jalinan akar ini mampu memperlambat arus ombak sehingga mencegah terjadinya abrasi atau pengikisan daratan oleh air laut.",
    question: "Berdasarkan kutipan teks di atas, apa fungsi fisik jalinan akar mangrove bagi daratan pesisir?",
    options: [
      { id: "A", text: "Menjadi tempat perkembangbiakan udang" },
      { id: "B", text: "Memperlambat arus gelombang untuk mencegah abrasi" },
      { id: "C", text: "Menyerap limbah plastik di permukaan laut" },
      { id: "D", text: "Menjadi habitat utama burung pesisir" }
    ],
    correctAnswer: "B",
    alternatives: [],
    explanation: "Tersurat jelas pada kalimat: jalinan akar memperlambat arus ombak sehingga mencegah terjadinya abrasi atau pengikisan daratan.",
    difficulty: "Dasar",
    source: "Kurasi Tim Pengembang Internal LMS",
    verificationStatus: "needs_review",
    reviewNotes: "",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },
  {
    id: "IND-FIK-002",
    subjectId: "bahasa-indonesia",
    topicId: "ind-fiksi",
    competencyId: "Amanat Cerita Narasi Fiksi",
    grade: "6 SD",
    questionType: "ISIAN",
    stimulus: "Kancil tergesa-gesa melompat ke seberang parit tanpa memperhatikan peringatan Kura-kura bahwa titian kayu tersebut sudah lapuk. Akibatnya, kayu patah dan kaki Kancil terperosok ke dalam lumpur.",
    question: "Sebutkan satu kata sifat (nasihat keselamatan) yang diabaikan oleh Kancil sehingga celaka: (Contoh: waspada / hati-hati)",
    options: [],
    correctAnswer: "waspada",
    alternatives: ["waspada", "kewaspadaan", "hati-hati", "berhati-hati", "kehati-hatian", "sabar"],
    explanation: "Kancil tergesa-gesa dan mengabaikan peringatan kondisi jembatan lapuk, yang mencerminkan kurangnya sikap waspada atau kehati-hatian.",
    difficulty: "Menengah",
    source: "Kurasi Tim Pengembang Internal LMS",
    verificationStatus: "needs_review",
    reviewNotes: "",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },

  // --- KELOMPOK B: CONTOH DEMO IPAS & PENDIDIKAN PANCASILA ---
  {
    id: "IPAS-EKO-001",
    subjectId: "ipas",
    topicId: "ipas-ekosistem",
    competencyId: "Keseimbangan Ekosistem Sawah",
    grade: "6 SD",
    questionType: "PG",
    stimulus: "Pada sebuah ekosistem sawah, populasi ular sawah menurun drastis akibat perburuan liar oleh manusia. Ular merupakan predator alami tikus pemakan padi.",
    question: "Apa akibat langsung yang kemungkinan besar terjadi pada ekosistem tersebut?",
    options: [
      { id: "A", text: "Populasi burung elang meningkat pesat" },
      { id: "B", text: "Populasi tikus meningkat sehingga merusak tanaman padi" },
      { id: "C", text: "Tanaman padi tumbuh lebih subur dan panen melimpah" },
      { id: "D", text: "Jumlah air di sawah berkurang drastis" }
    ],
    correctAnswer: "B",
    alternatives: [],
    explanation: "Penurunan populasi pemangsa alami (ular) menyebabkan populasi hama tikus melonjak tanpa kendali, mengakibatkan kerusakan pada tanaman padi.",
    difficulty: "Dasar",
    source: "Rancangan Demonstrasi Multi-Mapel Fase 2",
    verificationStatus: "draft",
    reviewNotes: "Contoh draf representatif untuk verifikasi alur kurasi.",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  },
  {
    id: "PAN-SIL-001",
    subjectId: "pendidikan-pancasila",
    topicId: "pan-nilai",
    competencyId: "Pengamalan Sila Kedua Pancasila",
    grade: "6 SD",
    questionType: "PG",
    stimulus: "Saat jam istirahat sekolah, seorang siswa melihat temannya terjatuh di tangga dan bukunya berserakan di lantai. Siswa tersebut segera menghampiri dan menolong temannya berdiri serta merapikan bukunya.",
    question: "Tindakan tolong-menolong tanpa membeda-bedakan teman mencerminkan pengamalan Pancasila, khususnya sila...",
    options: [
      { id: "A", text: "Pertama (Ketuhanan Yang Maha Esa)" },
      { id: "B", text: "Kedua (Kemanusiaan yang Adil dan Beradab)" },
      { id: "C", text: "Ketiga (Persatuan Indonesia)" },
      { id: "D", text: "Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan)" }
    ],
    correctAnswer: "B",
    alternatives: [],
    explanation: "Sikap kepedulian sosial, menjunjung tinggi nilai kemanusiaan, dan gemar menolong sesama merupakan perwujudan nilai-nilai Sila Kedua Pancasila.",
    difficulty: "Dasar",
    source: "Rancangan Demonstrasi Multi-Mapel Fase 2",
    verificationStatus: "draft",
    reviewNotes: "Periksa redaksi opsi agar seragam.",
    createdAt: "2026-10-25T08:00:00.000Z",
    updatedAt: "2026-10-25T08:00:00.000Z"
  }
];
