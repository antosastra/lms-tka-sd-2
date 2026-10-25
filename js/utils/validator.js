/**
 * Modul Evaluasi Jawaban, Sanitasi, dan Validasi Bank Soal Fase 2
 */

export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function periksaJawaban(soal, inputUser) {
  if (inputUser === undefined || inputUser === null) {
    return { status: "KOSONG", isBenar: false };
  }
  const raw = String(inputUser).trim();
  if (raw === "") {
    return { status: "KOSONG", isBenar: false };
  }

  const tipe = (soal.questionType || soal.tipe || "PG").toUpperCase();
  const kunci = String(soal.correctAnswer || soal.kunci || "").trim();

  if (tipe === "PG") {
    const isBenar = (raw.toUpperCase() === kunci.toUpperCase());
    return { status: isBenar ? "BENAR" : "SALAH", isBenar };
  }

  // Normalisasi Isian: Titik desimal & koma
  const normInput = raw.toLowerCase().replace(/\.$/, "").replace(/,/g, ".");
  const normKunci = kunci.toLowerCase().replace(/\.$/, "").replace(/,/g, ".");

  const numInput = parseFloat(normInput);
  const numKunci = parseFloat(normKunci);

  if (!isNaN(numInput) && !isNaN(numKunci) && normInput.replace(/[a-z\s]/g, "") === String(numInput)) {
    if (Math.abs(numInput - numKunci) < 0.0001) {
      return { status: "BENAR", isBenar: true };
    }
  }

  if (normInput === normKunci) {
    return { status: "BENAR", isBenar: true };
  }

  const alts = soal.alternatives || soal.alternatifKunci;
  if (Array.isArray(alts)) {
    for (const alt of alts) {
      const normAlt = String(alt).toLowerCase().trim().replace(/\.$/, "").replace(/,/g, ".");
      if (normInput === normAlt) {
        return { status: "BENAR", isBenar: true };
      }
    }
  }

  return { status: "SALAH", isBenar: false };
}

/**
 * Validasi Skema Impor Massal JSON dengan Kebijakan Duplikasi
 * Kebijakan opsi 'policy':
 * - 'skip': Lewati butir jika ID sudah ada di bank soal eksisting
 * - 'update': Perbarui butir lama jika ID cocok
 * - 'reject_all': Batalkan seluruh berkas jika terdapat duplikasi ID
 */
export function validasiImporMassal(jsonContent, existingQuestions = [], validSubjectIds = [], policy = "skip") {
  let parsed = null;

  try {
    parsed = typeof jsonContent === "string" ? JSON.parse(jsonContent) : jsonContent;
  } catch (e) {
    return {
      isValid: false,
      message: "Format JSON berkas tidak valid atau korup: " + e.message,
      records: [],
      stats: { total: 0, valid: 0, invalid: 0, baru: 0, update: 0, skip: 0 }
    };
  }

  let rawList = [];
  if (Array.isArray(parsed)) {
    rawList = parsed;
  } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.questions)) {
    rawList = parsed.questions;
  } else {
    return {
      isValid: false,
      message: "Struktur root JSON wajib berupa Array atau objek { questions: [...] }",
      records: [],
      stats: { total: 0, valid: 0, invalid: 0, baru: 0, update: 0, skip: 0 }
    };
  }

  const existingMap = new Map();
  existingQuestions.forEach(q => existingMap.set(String(q.id).trim().toUpperCase(), q));

  const seenInFile = new Set();
  const errors = [];
  const processedItems = [];
  let statBaru = 0;
  let statUpdate = 0;
  let statSkip = 0;

  const validStatuses = ["draft", "needs_review", "verified", "archived"];
  const validTypes = ["PG", "ISIAN"];

  rawList.forEach((item, index) => {
    const row = index + 1;
    if (!item || typeof item !== "object") {
      errors.push(`Baris #${row}: Data bukan merupakan objek.`);
      return;
    }

    const id = String(item.id || "").trim().toUpperCase();
    if (!id) {
      errors.push(`Baris #${row}: Field 'id' wajib diisi.`);
      return;
    }

    if (seenInFile.has(id)) {
      errors.push(`Baris #${row}: ID '${id}' muncul ganda di dalam berkas impor.`);
      return;
    }
    seenInFile.add(id);

    const subjectId = String(item.subjectId || item.mapelId || "").toLowerCase().trim();
    if (!subjectId) {
      errors.push(`Soal ${id}: 'subjectId' wajib diisi.`);
      return;
    }
    if (validSubjectIds.length > 0 && !validSubjectIds.includes(subjectId)) {
      errors.push(`Soal ${id}: 'subjectId' ('${subjectId}') tidak terdaftar dalam kurikulum.`);
      return;
    }

    const questionType = String(item.questionType || item.tipe || "PG").toUpperCase();
    if (!validTypes.includes(questionType)) {
      errors.push(`Soal ${id}: 'questionType' harus 'PG' atau 'ISIAN'.`);
      return;
    }

    const question = String(item.question || item.tanya || "").trim();
    if (!question) {
      errors.push(`Soal ${id}: Teks pertanyaan tidak boleh kosong.`);
      return;
    }

    const correctAnswer = String(item.correctAnswer || item.kunci || "").trim();
    if (!correctAnswer) {
      errors.push(`Soal ${id}: Kunci jawaban wajib diisi.`);
      return;
    }

    // Normalisasi opsi PG
    let options = [];
    if (questionType === "PG") {
      const rawOpts = item.options || item.opsi;
      if (Array.isArray(rawOpts)) {
        options = rawOpts.map((o, optIdx) => {
          if (typeof o === "string") {
            const letter = String.fromCharCode(65 + optIdx);
            return { id: letter, text: o };
          }
          return { id: String(o.id || String.fromCharCode(65 + optIdx)), text: String(o.text || "") };
        });
      }
      if (options.length < 2) {
        errors.push(`Soal ${id}: Soal PG minimal memiliki 2 pilihan jawaban.`);
        return;
      }
    }

    // Validasi penanganan konflik dengan data lama
    const isExisting = existingMap.has(id);
    if (isExisting) {
      if (policy === "reject_all") {
        errors.push(`Soal ${id}: ID duplikat dengan bank soal sistem (Kebijakan Batalkan Aktif).`);
        return;
      } else if (policy === "skip") {
        statSkip++;
        return; // Tidak ditambahkan
      } else if (policy === "update") {
        statUpdate++;
      }
    } else {
      statBaru++;
    }

    // Kebijakan status: Impor baru tidak boleh otomatis verified tanpa reviu
    let status = String(item.verificationStatus || item.statusVerifikasi || "draft").toLowerCase();
    if (!validStatuses.includes(status)) status = "draft";
    if (status === "verified" && !isExisting) {
      // Keamanan: Paksa butir eksternal baru ke needs_review
      status = "needs_review";
    }

    processedItems.push({
      id,
      subjectId,
      topicId: String(item.topicId || "umum").trim(),
      competencyId: String(item.competencyId || item.kompetensi || "Umum").trim(),
      grade: String(item.grade || "6 SD").trim(),
      questionType,
      stimulus: String(item.stimulus || "").trim(),
      question,
      options,
      correctAnswer,
      alternatives: Array.isArray(item.alternatives) ? item.alternatives : (Array.isArray(item.alternatifKunci) ? item.alternatifKunci : []),
      explanation: String(item.explanation || item.pembahasan || "").trim(),
      difficulty: String(item.difficulty || item.kesulitan || "Dasar").trim(),
      source: String(item.source || item.sumber || "Impor Berkas JSON").trim(),
      verificationStatus: status,
      reviewNotes: String(item.reviewNotes || item.catatanReviewer || "").trim(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  const isValid = errors.length === 0;

  return {
    isValid,
    message: isValid ? "Semua butir soal valid dan siap diproses." : `Terdapat ${errors.length} kesalahan validasi.`,
    errors,
    itemsToCommit: isValid ? processedItems : [],
    stats: {
      total: rawList.length,
      valid: processedItems.length,
      invalid: errors.length,
      baru: statBaru,
      update: statUpdate,
      skip: statSkip
    }
  };
}

/**
 * 12 Checklist Penelaahan Butir Soal (Quality Assurance)
 */
export const DAFTAR_CHECKLIST_VERIFIKASI = [
  "Pertanyaan jelas, tidak ambigu, dan sesuai untuk kelas 6 SD.",
  "Kunci jawaban tepat dan kebenarannya dapat dibuktikan.",
  "Langkah pembahasan logis, runtut, dan menjelaskan alasan jawaban.",
  "Pilihan jawaban homogen dan pengecoh berfungsi masuk akal.",
  "Hanya ada satu pilihan jawaban yang benar (pada tipe pilihan ganda tunggal).",
  "Stimulus/bacaan relevan langsung dengan pertanyaan yang diajukan.",
  "Kesesuaian pemetaan mata pelajaran, topik, dan kompetensi terjamin.",
  "Tingkat kesulitan (Dasar, Menengah, Lanjut) sesuai proporsi nalar anak.",
  "Bukan merupakan salinan duplikat dari soal lain di bank soal.",
  "Sumber materi, buku referensi, atau acuan perumusan tercatat jelas.",
  "Bebas dari kesalahan tata bahasa, ejaan, angka, atau salah penulisan satuan.",
  "Tidak mengandung unsur bias SARA atau konten yang tidak mendidik."
];
