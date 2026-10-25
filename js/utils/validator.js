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

  const tipe = soal.questionType || soal.tipe;
  const kunci = soal.correctAnswer || soal.kunci;

  if (tipe === "PG") {
    const isBenar = (raw.toUpperCase() === String(kunci).toUpperCase());
    return { status: isBenar ? "BENAR" : "SALAH", isBenar };
  }

  const normInput = raw.toLowerCase().replace(/\.$/, "").replace(/,/g, ".");
  const normKunci = String(kunci).toLowerCase().replace(/\.$/, "").replace(/,/g, ".");

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

export function validasiSkemaBankSoal(jsonArray, validSubjectIds = []) {
  if (!Array.isArray(jsonArray)) {
    return { valid: false, message: "Struktur root JSON harus berupa Array." };
  }

  const validStatuses = ["draft", "needs_review", "verified", "archived"];
  const validTypes = ["PG", "ISIAN"];
  const seenIds = new Set();
  const errors = [];
  const validItems = [];

  jsonArray.forEach((item, index) => {
    const baris = index + 1;
    if (!item || typeof item !== "object") {
      errors.push(`Baris #${baris}: Format item bukan objek valid.`);
      return;
    }

    const id = String(item.id || "").trim();
    if (!id) {
      errors.push(`Baris #${baris}: Kolom 'id' wajib diisi.`);
      return;
    }

    if (seenIds.has(id)) {
      errors.push(`Baris #${baris}: Duplikasi ID '${id}'.`);
      return;
    }
    seenIds.add(id);

    const subjectId = String(item.subjectId || "").trim();
    if (!subjectId) {
      errors.push(`Soal ${id}: 'subjectId' wajib diisi.`);
      return;
    }

    const questionType = String(item.questionType || item.tipe || "").toUpperCase();
    if (!validTypes.includes(questionType)) {
      errors.push(`Soal ${id}: 'questionType' harus 'PG' atau 'ISIAN'.`);
      return;
    }

    const question = String(item.question || item.tanya || "").trim();
    if (!question) {
      errors.push(`Soal ${id}: Pertanyaan tidak boleh kosong.`);
      return;
    }

    const correctAnswer = String(item.correctAnswer || item.kunci || "").trim();
    if (!correctAnswer) {
      errors.push(`Soal ${id}: Kunci jawaban wajib diisi.`);
      return;
    }

    validItems.push({
      id,
      subjectId,
      topicId: String(item.topicId || "umum").trim(),
      competencyId: String(item.competencyId || item.kompetensi || "Umum").trim(),
      grade: String(item.grade || "6 SD").trim(),
      questionType,
      stimulus: String(item.stimulus || "").trim(),
      question,
      options: Array.isArray(item.options) ? item.options : (Array.isArray(item.opsi) ? item.opsi : []),
      correctAnswer,
      alternatives: Array.isArray(item.alternatives) ? item.alternatives : (Array.isArray(item.alternatifKunci) ? item.alternatifKunci : []),
      explanation: String(item.explanation || item.pembahasan || "").trim(),
      difficulty: String(item.difficulty || item.kesulitan || "Dasar").trim(),
      source: String(item.source || "Impor Eksternal").trim(),
      verificationStatus: String(item.verificationStatus || "draft").toLowerCase(),
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  return {
    valid: errors.length === 0,
    errors,
    validItems,
    totalDiterima: validItems.length,
    totalGagal: errors.length
  };
}
