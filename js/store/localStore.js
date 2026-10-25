/**
 * LocalStore LMS TKA SD — Skema Kompatibel Fase 2
 */
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

function migrasiKeFase2(state) {
  let changed = false;

  // Pastikan daftar mata pelajaran sinkron dengan master kurikulum
  if (!Array.isArray(state.mataPelajaran) || state.mataPelajaran.length < DAFTAR_MATA_PELAJARAN.length) {
    state.mataPelajaran = DAFTAR_MATA_PELAJARAN;
    changed = true;
  }

  // Normalisasi bank soal ke Schema Version 1
  if (Array.isArray(state.bankSoal)) {
    state.bankSoal = state.bankSoal.map(item => {
      let subjectId = item.subjectId;
      if (!subjectId) {
        if (item.mapel === "Matematika") subjectId = "matematika";
        else if (item.mapel === "Bahasa Indonesia") subjectId = "bahasa-indonesia";
        else subjectId = "matematika";
      }

      let verificationStatus = item.verificationStatus;
      if (!verificationStatus || verificationStatus.includes("Draf AI")) {
        verificationStatus = "needs_review";
      }

      // Standarisasi opsi PG menjadi objek [{id, text}]
      let options = item.options || [];
      if ((!options || options.length === 0) && Array.isArray(item.opsi)) {
        options = item.opsi.map((txt, idx) => {
          const letter = String.fromCharCode(65 + idx);
          return { id: letter, text: String(txt).replace(/^[A-D]\.\s*/, "") };
        });
      }

      return {
        id: String(item.id).trim().toUpperCase(),
        subjectId,
        topicId: item.topicId || (subjectId === "matematika" ? "mat-bilangan" : "ind-informasi"),
        competencyId: item.competencyId || item.kompetensi || "Kompetensi Inti",
        grade: item.grade || "6 SD",
        questionType: (item.questionType || item.tipe || "PG").toUpperCase(),
        stimulus: item.stimulus || "",
        question: item.question || item.tanya || "",
        options,
        correctAnswer: item.correctAnswer || item.kunci || "",
        alternatives: item.alternatives || item.alternatifKunci || [],
        explanation: item.explanation || item.pembahasan || "",
        difficulty: item.difficulty || item.kesulitan || "Dasar",
        source: item.source || item.sumber || "Draf Pembelajaran Internal LMS",
        verificationStatus,
        reviewNotes: item.reviewNotes || item.catatanReviewer || "",
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString()
      };
    });
    changed = true;
  }

  return { state, changed };
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
    if (!parsed || typeof parsed !== "object") throw new Error("Data korup");

    const { state, changed } = migrasiKeFase2(parsed);
    if (changed) {
      saveStore(state);
    }
    return state;
  } catch (e) {
    console.warn("Gagal membaca LocalStorage. Menggunakan fallback bersih.", e);
    const fallback = getDefaultState();
    saveStore(fallback);
    return fallback;
  }
}

export function saveStore(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Gagal menyimpan state ke LocalStorage:", e);
  }
}
