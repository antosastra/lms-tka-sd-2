import { INITIAL_BANK_SOAL } from '../data/bankSoal.js';

const STORE_KEY = "LMS_TKA_SD_STATE_V1_1";

export function getDefaultState() {
  return {
    role: "anak",
    anak: { nama: "Rian (Siswa Uji)", kelas: "6 SD", targetMenit: 60 },
    ortu: { nama: "Bpk. Hendra", catatanRekomendasi: "Fokuskan pendampingan pada ketelitian membaca petunjuk soal dan konversi satuan debit." },
    bankSoal: INITIAL_BANK_SOAL,
    riwayatSoal: {
      "MAT-BIL-002": { totalAttempt: 1, totalCorrect: 0, isScheduledSpaced: true },
      "MAT-GEO-002": { totalAttempt: 1, totalCorrect: 1, isScheduledSpaced: true }
    },
    riwayatSesi: [],
    sesiAktif: null,
    jawabanSesiAktif: {},
    sesiSudahDisimpan: false
  };
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
    if (!parsed || !Array.isArray(parsed.bankSoal)) throw new Error("Data rusak");
    return parsed;
  } catch (e) {
    const fallback = getDefaultState();
    saveStore(fallback);
    return fallback;
  }
}

export function saveStore(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Gagal simpan ke storage:", e);
  }
}
