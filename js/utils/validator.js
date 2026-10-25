/**
 * Utilitas Validator & Evaluator Butir Soal LMS TKA SD
 * Mendukung format: PG, ISIAN, PGK_MCMA (pilihan jamak), PGK_KATEGORI (Benar/Salah)
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

/**
 * Memeriksa kesesuaian jawaban siswa terhadap butir soal
 * @param {Object} soal - Objek data soal
 * @param {any} inputUser - Jawaban dari antarmuka
 * @returns {Object} { status: "BENAR"|"SALAH"|"KOSONG", isBenar: boolean, detailScore?: number }
 */
export function periksaJawaban(soal, inputUser) {
  if (inputUser === undefined || inputUser === null) {
    return { status: "KOSONG", isBenar: false };
  }

  const tipe = (soal.questionType || soal.tipe || "PG").toUpperCase();

  // 1. Tipe PG (Pilihan Ganda Sederhana 1 Opsi)
  if (tipe === "PG") {
    const raw = String(inputUser).trim();
    if (raw === "") return { status: "KOSONG", isBenar: false };

    const kunci = String(soal.correctAnswer || soal.kunci || "").trim().toUpperCase();
    const isBenar = (raw.toUpperCase() === kunci);
    return { status: isBenar ? "BENAR" : "SALAH", isBenar };
  }

  // 2. Tipe PGK_MCMA (Pilihan Ganda Kompleks - Pilihan Lebih dari Satu)
  if (tipe === "PGK_MCMA") {
    if (!Array.isArray(inputUser) || inputUser.length === 0) {
      return { status: "KOSONG", isBenar: false };
    }

    const kunciArray = (soal.correctAnswer || soal.kunci || []).map(x => String(x).trim().toUpperCase()).sort();
    const userArray = inputUser.map(x => String(x).trim().toUpperCase()).sort();

    if (kunciArray.length === 0) return { status: "SALAH", isBenar: false };

    const isMatch = (kunciArray.length === userArray.length) &&
      kunciArray.every((val, index) => val === userArray[index]);

    return { status: isMatch ? "BENAR" : "SALAH", isBenar: isMatch };
  }

  // 3. Tipe PGK_KATEGORI (Tabel Pernyataan: Benar/Salah atau Sesuai/Tidak Sesuai)
  if (tipe === "PGK_KATEGORI") {
    if (typeof inputUser !== "object" || Object.keys(inputUser).length === 0) {
      return { status: "KOSONG", isBenar: false };
    }

    const daftarPernyataan = soal.statements || soal.pernyataan || [];
    if (daftarPernyataan.length === 0) return { status: "SALAH", isBenar: false };

    let semuaTerjawab = true;
    let jumlahCocok = 0;

    for (let i = 0; i < daftarPernyataan.length; i++) {
      const kunciBaris = daftarPernyataan[i].correct ?? daftarPernyataan[i].kunci;
      const userBaris = inputUser[i];

      if (userBaris === undefined || userBaris === null) {
        semuaTerjawab = false;
      } else if (Boolean(userBaris) === Boolean(kunciBaris)) {
        jumlahCocok++;
      }
    }

    if (!semuaTerjawab && Object.keys(inputUser).length === 0) {
      return { status: "KOSONG", isBenar: false };
    }

    const isLengkapBenar = (jumlahCocok === daftarPernyataan.length);
    return {
      status: isLengkapBenar ? "BENAR" : "SALAH",
      isBenar: isLengkapBenar,
      akurasi: `${jumlahCocok}/${daftarPernyataan.length}`
    };
  }

  // 4. Tipe ISIAN (Jawaban Singkat: Angka Desimal atau Teks)
  const rawInput = String(inputUser).trim();
  if (rawInput === "") return { status: "KOSONG", isBenar: false };

  const normInput = rawInput.toLowerCase().replace(/\.$/, "").replace(/,/g, ".");
  const normKunci = String(soal.correctAnswer || soal.kunci || "").toLowerCase().replace(/\.$/, "").replace(/,/g, ".");

  // Uji desimal numerik aman
  const numInput = parseFloat(normInput);
  const numKunci = parseFloat(normKunci);
  if (!isNaN(numInput) && !isNaN(numKunci) && normInput.replace(/[a-z\s]/g, "") === String(numInput)) {
    if (Math.abs(numInput - numKunci) < 0.0001) {
      return { status: "BENAR", isBenar: true };
    }
  }

  // Uji teks langsung
  if (normInput === normKunci) return { status: "BENAR", isBenar: true };

  // Uji daftar sinonim alternatif yang disetujui
  const alts = soal.alternatives || soal.alternatifKunci;
  if (Array.isArray(alts)) {
    for (const alt of alts) {
      const normAlt = String(alt).toLowerCase().trim().replace(/\.$/, "").replace(/,/g, ".");
      if (normInput === normAlt) return { status: "BENAR", isBenar: true };
    }
  }

  return { status: "SALAH", isBenar: false };
}
