import { INITIAL_BANK_SOAL } from '../data/bankSoal.js';
import { DAFTAR_MATA_PELAJARAN } from '../data/curriculum.js';

const STORE_KEY = "LMS_TKA_SD_STATE_V1_1";

export function getDefaultState() {
  return {
    role: "anak",
    anak: {
      nama: "Rian (Siswa Uji)",
      kelas: "6 SD",
      targetMenit: 60
    },
    ortu: {
      nama: "Bpk. Hendra",
      catatanRekomendasi: "Fokuskan pendampingan pada ketelitian membaca petunjuk soal dan pemahaman konsep dasar."
    },
    mataPelajaran: DAFTAR_MATA_PELAJARAN,
    bankSoal: INITIAL_BANK_SOAL,
    riwayatSoal: {},
    riwayatSesi: [],
    sesiAktif: null,
    jawabanSesiAktif: {},
    sesiSudahDisimpan: false
  };
}

function migrasiDataLama(parsed) {
  let migrated = false;

  if (!Array.isArray(parsed.mataPelajaran) || parsed.mataPelajaran.length === 0) {
    parsed.mataPelajaran = DAFTAR_MATA_PELAJARAN;
    migrated = true;
  }

  if (Array.isArray(parsed.bankSoal)) {
    parsed.bankSoal = parsed.bankSoal.map(item => {
      const subjectId = item.subjectId || (item.mapel === "Matematika" ? "matematika" : "bahasa-indonesia");
      const questionType = item.questionType || item.tipe || "PG";
      const question = item.question || item.tanya || "";
      const correctAnswer = item.correctAnswer || item.kunci || "";
      const explanation = item.explanation || item.pembahasan || "";
      const difficulty = item.difficulty || item.kesulitan || "Dasar";
      const competencyId = item.competencyId || item.kompetensi || "Umum";
      const topicId = item.topicId || (subjectId === "matematika" ? "mat-bilangan" : "ind-informasi");
      
      let verificationStatus = item.verificationStatus;
      if (!verificationStatus || verificationStatus.includes("Draf AI")) {
        verificationStatus = "needs_review";
      }

      return {
        id: item.id,
        subjectId,
        topicId,
        competencyId,
        grade: item.grade || "6 SD",
        questionType,
        stimulus: item.stimulus || "",
        question,
        options: item.options || item.opsi || [],
        correctAnswer,
        alternatives: item.alternatives || item.alternatifKunci || [],
        explanation,
        difficulty,
        source: item.source || "Draf Pembelajaran Internal LMS",
        verificationStatus,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      };
    });
    migrated = true;
  }

  return { data: parsed, migrated };
}

export function getStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const fresh = getDefaultState();
      saveStore(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Format state lokal tidak valid");
    }

    const { data, migrated } = migrasiDataLama(parsed);
    if (migrated) {
      saveStore(data);
    }
    return data;
  } catch (e) {
    console.warn("Gagal membaca LocalStorage. Menggunakan state default.", e);
    const fallback = getDefaultState();
    saveStore(fallback);
    return fallback;
  }
}

export function saveStore(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Gagal menyimpan ke LocalStorage:", e);
  }
}
