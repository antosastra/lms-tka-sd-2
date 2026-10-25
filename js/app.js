/**
 * Kontroler Utama Aplikasi LMS TKA SD — Fase 2
 */
import { getStore, saveStore } from './store/localStore.js';
import { renderAdminKonten } from './views/adminView.js';
import { escapeHtml, periksaJawaban, validasiImporMassal, DAFTAR_CHECKLIST_VERIFIKASI } from './utils/validator.js';

let adminFilters = {
  search: "",
  subject: "all",
  status: "all",
  difficulty: "all"
};

function navigate(hash) {
  window.location.hash = hash;
}

function renderApp() {
  const hash = window.location.hash || "#/anak/dashboard";
  const app = document.getElementById("app-root");
  const nav = document.getElementById("nav-actions");
  const store = getStore();

  // Render Navigasi Header Sesuai Peran
  if (store.role === "anak") {
    nav.innerHTML = `
      <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Dashboard</button>
      <button onclick="window.LMS.navigate('#/asesmen')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Jadwal Asesmen</button>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 ml-2">Peran: Siswa</span>
      <button onclick="window.LMS.navigate('#/masuk')" class="text-slate-400 hover:text-slate-600 ml-1" title="Ganti Peran"><i data-lucide="log-out" class="w-4 h-4"></i></button>
    `;
  } else if (store.role === "ortu") {
    nav.innerHTML = `
      <button onclick="window.LMS.navigate('#/ortu/dashboard')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Pantauan Anak</button>
      <button onclick="window.LMS.navigate('#/asesmen')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Jadwal Ujian</button>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 ml-2">Peran: Orang Tua</span>
      <button onclick="window.LMS.navigate('#/masuk')" class="text-slate-400 hover:text-slate-600 ml-1" title="Ganti Peran"><i data-lucide="log-out" class="w-4 h-4"></i></button>
    `;
  } else {
    nav.innerHTML = `
      <button onclick="window.LMS.navigate('#/admin')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Bank Soal</button>
      <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Pratinjau Siswa</button>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 ml-2">Peran: Penelaah</span>
      <button onclick="window.LMS.navigate('#/masuk')" class="text-slate-400 hover:text-slate-600 ml-1" title="Ganti Peran"><i data-lucide="log-out" class="w-4 h-4"></i></button>
    `;
  }

  // Routing Tampilan
  if (hash.startsWith("#/masuk")) app.innerHTML = viewLogin(store);
  else if (hash.startsWith("#/anak/dashboard")) app.innerHTML = viewDashboardAnak(store);
  else if (hash.startsWith("#/anak/latihan")) app.innerHTML = viewHalamanLatihan(store);
  else if (hash.startsWith("#/anak/pembahasan")) app.innerHTML = viewHalamanPembahasan(store);
  else if (hash.startsWith("#/anak/hasil")) app.innerHTML = viewHasilSesi(store);
  else if (hash.startsWith("#/ortu/dashboard")) app.innerHTML = viewDashboardOrtu(store);
  else if (hash.startsWith("#/asesmen")) app.innerHTML = viewJadwalAsesmen();
  else if (hash.startsWith("#/admin")) app.innerHTML = renderAdminKonten(store, adminFilters);
  else app.innerHTML = `<div class="text-center py-12"><button onclick="window.LMS.navigate('#/masuk')" class="px-4 py-2 bg-blue-600 text-white rounded-xl">Ke Beranda</button></div>`;

  if (window.lucide) lucide.createIcons();
  window.scrollTo(0, 0);
}

// --- VIEW: LOGIN / ROLE ---
function viewLogin(store) {
  return `
    <div class="max-w-xl mx-auto py-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">LMS TKA SD — Fase 2</h1>
        <p class="text-xs text-slate-600 mt-2">Pilih simulasi peran untuk memeriksa integrasi konten bank soal.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onclick="window.LMS.pilihRole('anak')" class="bg-white p-6 rounded-2xl border-2 ${store.role === 'anak' ? 'border-blue-600 shadow-md' : 'border-slate-200'} hover:border-blue-500 cursor-pointer text-center flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><i data-lucide="book-open" class="w-8 h-8"></i></div>
          <h2 class="font-bold text-lg text-slate-900">Siswa (Kelas 6)</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">Hanya mengerjakan soal yang sudah terverifikasi.</p>
          <span class="mt-auto inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Masuk Sebagai Siswa</span>
        </div>
        <div onclick="window.LMS.pilihRole('ortu')" class="bg-white p-6 rounded-2xl border-2 ${store.role === 'ortu' ? 'border-purple-600 shadow-md' : 'border-slate-200'} hover:border-purple-500 cursor-pointer text-center flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4"><i data-lucide="users" class="w-8 h-8"></i></div>
          <h2 class="font-bold text-lg text-slate-900">Orang Tua</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">Pantau riwayat hasil belajar dan evaluasi.</p>
          <span class="mt-auto inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">Masuk Sebagai Orang Tua</span>
        </div>
      </div>
      <div class="mt-6 text-center">
        <button onclick="window.LMS.pilihRole('admin')" class="text-xs text-slate-600 hover:text-slate-900 font-bold underline">
          Masuk ke Panel Pengelolaan & Kurasi Bank Soal
        </button>
      </div>
    </div>
  `;
}

// --- VIEW: DASHBOARD SISWA (PROTEKSI SOAL VERIFIED) ---
function viewDashboardAnak(store) {
  const bank = store.bankSoal || [];
  const mapelList = store.mataPelajaran || [];

  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <h1 class="text-2xl md:text-3xl font-extrabold">Halo, ${escapeHtml(store.anak.nama)}! 👋</h1>
        <p class="text-blue-100 text-xs mt-1">Pilih mata pelajaran untuk memulai latihan mandiri berstandar.</p>
      </div>

      <div class="space-y-4">
        <h2 class="text-base font-bold text-slate-900">Kelompok A — Persiapan Tes Kemampuan Akademik (TKA)</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          ${mapelList.filter(m => m.kelompok === "A").map(m => {
            const verifiedItems = bank.filter(q => q.subjectId === m.id && q.verificationStatus === "verified");
            const canStart = verifiedItems.length > 0;
            return `
              <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start">
                    <h3 class="font-bold text-sm text-slate-900">${escapeHtml(m.nama)}</h3>
                    <span class="text-[10px] font-bold px-2 py-0.5 rounded ${canStart ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                      ${verifiedItems.length} Soal Siap
                    </span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">${escapeHtml(m.deskripsi)}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-[11px] text-slate-400">${verifiedItems.length} butir terverifikasi</span>
                  <button onclick="window.LMS.mulaiLatihanMapel('${m.id}')" ${canStart ? 'class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"' : 'disabled class="px-4 py-1.5 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed"'}>
                    ${canStart ? 'Mulai Latihan' : 'Materi Belum Tersedia'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-base font-bold text-slate-900">Kelompok B — Persiapan Ujian Akhir Sekolah</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          ${mapelList.filter(m => m.kelompok === "B").map(m => {
            const verifiedItems = bank.filter(q => q.subjectId === m.id && q.verificationStatus === "verified");
            const canStart = verifiedItems.length > 0;
            return `
              <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 class="font-bold text-xs text-slate-900">${escapeHtml(m.nama)}</h3>
                  <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">${escapeHtml(m.deskripsi)}</p>
                </div>
                <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-[10px] text-slate-400">${verifiedItems.length} butir aktif</span>
                  <button onclick="window.LMS.mulaiLatihanMapel('${m.id}')" ${canStart ? 'class="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded-lg"' : 'disabled class="px-2.5 py-1 bg-slate-100 text-slate-400 font-bold text-[11px] rounded-lg cursor-not-allowed"'}>
                    ${canStart ? 'Latihan' : 'Belum Ada'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: HALAMAN LATIHAN ---
function viewHalamanLatihan(store) {
  if (!store.sesiAktif?.soalList?.length) {
    return `
      <div class="max-w-md mx-auto text-center py-16 space-y-4">
        <p class="text-xs text-slate-600">Tidak ada sesi latihan aktif. Silakan pilih mata pelajaran di Dashboard.</p>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Kembali ke Dashboard</button>
      </div>
    `;
  }

  const { soalList, indeksAktif, mapelNama } = store.sesiAktif;
  const soal = soalList[indeksAktif];
  const ans = store.jawabanSesiAktif[soal.id] || "";

  return `
    <div class="max-w-2xl mx-auto space-y-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
        <div>
          <span class="font-bold text-slate-900">${escapeHtml(mapelNama)}</span>
          <span class="text-slate-400 ml-2">• Soal ${indeksAktif + 1} dari ${soalList.length}</span>
        </div>
        <span class="px-2 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 text-[10px]">Tingkat ${escapeHtml(soal.difficulty)}</span>
      </div>

      <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div class="text-[11px] text-slate-500 font-semibold">${escapeHtml(soal.competencyId)}</div>
        ${soal.stimulus ? `<div class="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-800 leading-relaxed border whitespace-pre-line">${escapeHtml(soal.stimulus)}</div>` : ""}
        <p class="text-sm font-bold text-slate-900 leading-snug">${escapeHtml(soal.question)}</p>

        <div class="space-y-2 pt-2">
          ${soal.questionType === "PG" ? (soal.options || []).map(opt => {
            const isSel = (ans === opt.id);
            return `
              <label onclick="window.LMS.pilihJawaban('${soal.id}', '${opt.id}')" class="flex items-center gap-3 p-3 rounded-xl border-2 ${isSel ? 'border-blue-600 bg-blue-50/60 font-semibold' : 'border-slate-200 hover:border-slate-300'} cursor-pointer text-xs transition-colors">
                <input type="radio" name="soal_rad" ${isSel ? 'checked' : ''} class="text-blue-600">
                <span><strong>${opt.id}.</strong> ${escapeHtml(opt.text)}</span>
              </label>
            `;
          }).join('') : `
            <div>
              <label class="block text-slate-600 text-[11px] mb-1 font-semibold">Ketikkan jawaban singkat Anda:</label>
              <input type="text" value="${escapeHtml(ans)}" oninput="window.LMS.simpanIsian('${soal.id}', this.value)" placeholder="Tulis angka atau kata..." class="w-full px-3.5 py-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
            </div>
          `}
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-slate-100">
          <button onclick="window.LMS.pindahSoal(${indeksAktif - 1})" ${indeksAktif === 0 ? 'disabled class="opacity-30 text-xs font-bold text-slate-400 cursor-not-allowed"' : 'class="text-xs font-bold text-slate-700 hover:underline"'}>
            ← Sebelumnya
          </button>
          ${indeksAktif < soalList.length - 1 ? `
            <button onclick="window.LMS.pindahSoal(${indeksAktif + 1})" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">
              Berikutnya →
            </button>
          ` : `
            <button onclick="window.LMS.selesaikanSesi()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm">
              Kirim & Selesaikan Sesi
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: HASIL SESI ---
function viewHasilSesi(store) {
  const latest = store.riwayatSesi[store.riwayatSesi.length - 1];
  if (!latest) return `<div class="text-center py-12"><button onclick="window.LMS.navigate('#/anak/dashboard')">Kembali</button></div>`;

  return `
    <div class="max-w-md mx-auto bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
      <span class="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">Hasil Latihan</span>
      <h1 class="text-5xl font-black text-blue-600">${latest.skor}</h1>
      <p class="text-xs text-slate-500 font-medium">${latest.jumlahBenar} dari ${latest.totalSoal} Soal Dijawab Benar</p>
      
      <div class="pt-4 flex gap-2">
        <button onclick="window.LMS.navigate('#/anak/pembahasan')" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold">
          Lihat Pembahasan
        </button>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">
          Ke Dashboard
        </button>
      </div>
    </div>
  `;
}

// --- VIEW: PEMBAHASAN SOAL ---
function viewHalamanPembahasan(store) {
  const soalList = store.sesiAktif?.soalList || [];
  return `
    <div class="max-w-2xl mx-auto space-y-4 pb-12">
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-bold text-slate-900">Pembahasan & Penjelasan Konsep</h1>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="text-xs font-bold text-blue-600 hover:underline">Selesai</button>
      </div>
      ${soalList.map((s, idx) => {
        const userAns = store.jawabanSesiAktif[s.id];
        const res = periksaJawaban(s, userAns);
        return `
          <div class="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs shadow-sm">
            <div class="flex justify-between font-bold">
              <span>#${idx + 1} • ${escapeHtml(s.competencyId)}</span>
              <span class="${res.status === 'BENAR' ? 'text-emerald-600' : (res.status === 'KOSONG' ? 'text-slate-400' : 'text-rose-600')}">
                ${res.status}
              </span>
            </div>
            <p class="text-slate-800 font-medium">${escapeHtml(s.question)}</p>
            <div class="p-3 bg-slate-50 rounded-xl text-slate-700 space-y-1 border border-slate-100">
              <div>Jawaban Anda: <strong class="font-mono">${escapeHtml(userAns || 'Tidak diisi')}</strong> | Kunci Sahih: <strong class="text-emerald-700 font-mono">${escapeHtml(s.correctAnswer)}</strong></div>
              <p class="text-slate-600 pt-1 leading-relaxed"><strong>Langkah Solusi:</strong> ${escapeHtml(s.explanation)}</p>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// --- VIEW: DASHBOARD ORANG TUA ---
function viewDashboardOrtu(store) {
  return `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
      <h1 class="text-lg font-bold text-purple-900">Pantauan Orang Tua: ${escapeHtml(store.anak.nama)}</h1>
      <p class="text-xs text-slate-600">Total sesi latihan selesai: <strong>${store.riwayatSesi.length} Sesi</strong></p>
      <div class="p-4 bg-purple-50 rounded-xl text-xs text-purple-900 border border-purple-200">
        <strong>Catatan Rekomendasi:</strong> ${escapeHtml(store.ortu.catatanRekomendasi)}
      </div>
    </div>
  `;
}

// --- VIEW: JADWAL ASESMEN ---
function viewJadwalAsesmen() {
  return `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-xs">
      <h1 class="text-base font-bold text-slate-900">Perkiraan Jadwal Asesmen Kelas 6 SD (Tahun Ajaran 2026/2027)</h1>
      <p class="text-slate-600">• Asesmen Akhir Sekolah (ASAJ): <strong>Mei 2027</strong></p>
      <p class="text-slate-600">• TKA SD Pusat: Mengikuti petunjuk teknis resmi penyelenggara asesmen.</p>
    </div>
  `;
}

// --- CONTROLLER WINDOW.LMS ---
window.LMS = {
  navigate,
  pilihRole(role) {
    const s = getStore();
    s.role = role;
    saveStore(s);
    if (role === "anak") navigate("#/anak/dashboard");
    else if (role === "ortu") navigate("#/ortu/dashboard");
    else navigate("#/admin");
  },

  // Filter Admin Reaktif
  applyAdminFilter() {
    adminFilters.search = document.getElementById("admin-filter-search")?.value || "";
    adminFilters.subject = document.getElementById("admin-filter-subject")?.value || "all";
    adminFilters.status = document.getElementById("admin-filter-status")?.value || "all";
    adminFilters.difficulty = document.getElementById("admin-filter-diff")?.value || "all";
    renderApp();
  },

  resetAdminFilter() {
    adminFilters = { search: "", subject: "all", status: "all", difficulty: "all" };
    renderApp();
  },

  // Alur Latihan Siswa
  mulaiLatihanMapel(subjectId) {
    const s = getStore();
    const mapelObj = (s.mataPelajaran || []).find(m => m.id === subjectId);
    // Hanya ambil soal yang berstatus verified
    const eligible = (s.bankSoal || []).filter(q => q.subjectId === subjectId && q.verificationStatus === "verified");

    if (eligible.length === 0) {
      alert("Belum ada butir soal terverifikasi pada mata pelajaran ini.");
      return;
    }

    s.sesiAktif = {
      subjectId,
      mapelNama: mapelObj ? mapelObj.nama : subjectId,
      indeksAktif: 0,
      soalList: eligible.slice(0, 5) // Maks 5 butir per sesi latihan
    };
    s.jawabanSesiAktif = {};
    s.sesiSudahDisimpan = false;
    saveStore(s);
    navigate("#/anak/latihan");
  },

  pilihJawaban(id, optId) {
    const s = getStore();
    s.jawabanSesiAktif[id] = optId;
    saveStore(s);
    renderApp();
  },

  simpanIsian(id, val) {
    const s = getStore();
    s.jawabanSesiAktif[id] = val.trim();
    saveStore(s);
  },

  pindahSoal(idx) {
    const s = getStore();
    if (s.sesiAktif && idx >= 0 && idx < s.sesiAktif.soalList.length) {
      s.sesiAktif.indeksAktif = idx;
      saveStore(s);
      renderApp();
    }
  },

  selesaikanSesi() {
    const s = getStore();
    if (!s.sesiAktif || s.sesiSudahDisimpan) return navigate("#/anak/hasil");

    let benar = 0;
    s.sesiAktif.soalList.forEach(q => {
      const res = periksaJawaban(q, s.jawabanSesiAktif[q.id]);
      if (res.isBenar) benar++;
    });

    s.riwayatSesi.push({
      id: "SESI-" + Date.now(),
      tanggal: new Date().toLocaleDateString("id-ID"),
      mapelId: s.sesiAktif.subjectId,
      totalSoal: s.sesiAktif.soalList.length,
      jumlahBenar: benar,
      skor: Math.round((benar / s.sesiAktif.soalList.length) * 100),
      estimasiMenit: 15
    });
    s.sesiSudahDisimpan = true;
    saveStore(s);
    navigate("#/anak/hasil");
  },

  // Modal Tambah/Edit Soal
  openAdminModal(soal = null) {
    const modal = document.getElementById("admin-modal");
    const s = getStore();
    document.getElementById("modal-error").classList.add("hidden");

    // Populate select mata pelajaran
    const mapelSelect = document.getElementById("soal-mapel");
    mapelSelect.innerHTML = (s.mataPelajaran || []).map(m => `<option value="${m.id}">[${m.kelompok}] ${m.nama}</option>`).join('');

    if (soal) {
      document.getElementById("modal-title").textContent = "Edit Soal (" + soal.id + ")";
      document.getElementById("edit-original-id").value = soal.id;
      document.getElementById("soal-id").value = soal.id;
      document.getElementById("soal-id").disabled = true;
      document.getElementById("soal-mapel").value = soal.subjectId;
      document.getElementById("soal-kompetensi").value = soal.competencyId;
      document.getElementById("soal-kesulitan").value = soal.difficulty;
      document.getElementById("soal-tipe").value = soal.questionType;
      document.getElementById("soal-status").value = soal.verificationStatus;
      document.getElementById("soal-sumber").value = soal.source || "";
      document.getElementById("soal-catatan").value = soal.reviewNotes || "";
      document.getElementById("soal-stimulus").value = soal.stimulus || "";
      document.getElementById("soal-tanya").value = soal.question;
      document.getElementById("soal-pembahasan").value = soal.explanation;

      window.LMS.toggleFormTipe(soal.questionType);
      if (soal.questionType === "PG") {
        const opts = soal.options || [];
        document.getElementById("soal-opsi-a").value = opts[0]?.text || "";
        document.getElementById("soal-opsi-b").value = opts[1]?.text || "";
        document.getElementById("soal-opsi-c").value = opts[2]?.text || "";
        document.getElementById("soal-opsi-d").value = opts[3]?.text || "";
        document.getElementById("soal-kunci-pg").value = soal.correctAnswer;
      } else {
        document.getElementById("soal-kunci-isian").value = soal.correctAnswer;
        document.getElementById("soal-alt-isian").value = (soal.alternatives || []).join(", ");
      }
    } else {
      document.getElementById("modal-title").textContent = "Tambah Soal Baru";
      document.getElementById("edit-original-id").value = "";
      document.getElementById("soal-id").value = "";
      document.getElementById("soal-id").disabled = false;
      document.getElementById("form-soal").reset();
      document.getElementById("soal-status").value = "draft";
      window.LMS.toggleFormTipe("PG");
    }
    modal.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  closeAdminModal() {
    document.getElementById("admin-modal").classList.add("hidden");
  },

  toggleFormTipe(t) {
    if (t === "PG") {
      document.getElementById("pg-fields").classList.remove("hidden");
      document.getElementById("isian-fields").classList.add("hidden");
    } else {
      document.getElementById("pg-fields").classList.add("hidden");
      document.getElementById("isian-fields").classList.remove("hidden");
    }
  },

  handleSaveSoal(e) {
    e.preventDefault();
    const s = getStore();
    const origId = document.getElementById("edit-original-id").value;
    const id = document.getElementById("soal-id").value.trim().toUpperCase();
    const tipe = document.getElementById("soal-tipe").value;

    if (!origId && s.bankSoal.some(x => x.id === id)) {
      alert("ID soal '" + id + "' sudah digunakan. Harap gunakan ID yang unik.");
      return;
    }

    let options = [], correctAnswer = "", alternatives = [];
    if (tipe === "PG") {
      options = [
        { id: "A", text: document.getElementById("soal-opsi-a").value.trim() },
        { id: "B", text: document.getElementById("soal-opsi-b").value.trim() },
        { id: "C", text: document.getElementById("soal-opsi-c").value.trim() },
        { id: "D", text: document.getElementById("soal-opsi-d").value.trim() }
      ];
      correctAnswer = document.getElementById("soal-kunci-pg").value;
    } else {
      correctAnswer = document.getElementById("soal-kunci-isian").value.trim();
      alternatives = document.getElementById("soal-alt-isian").value.split(",").map(x => x.trim()).filter(Boolean);
    }

    const item = {
      id,
      subjectId: document.getElementById("soal-mapel").value,
      topicId: "umum",
      competencyId: document.getElementById("soal-kompetensi").value.trim(),
      grade: "6 SD",
      questionType: tipe,
      stimulus: document.getElementById("soal-stimulus").value.trim(),
      question: document.getElementById("soal-tanya").value.trim(),
      options,
      correctAnswer,
      alternatives,
      explanation: document.getElementById("soal-pembahasan").value.trim(),
      difficulty: document.getElementById("soal-kesulitan").value,
      source: document.getElementById("soal-sumber").value.trim() || "Draf Pengembang Internal",
      verificationStatus: document.getElementById("soal-status").value,
      reviewNotes: document.getElementById("soal-catatan").value.trim(),
      updatedAt: new Date().toISOString()
    };

    if (origId) {
      const idx = s.bankSoal.findIndex(x => x.id === origId);
      if (idx !== -1) {
        item.createdAt = s.bankSoal[idx].createdAt;
        s.bankSoal[idx] = item;
      }
    } else {
      item.createdAt = new Date().toISOString();
      s.bankSoal.push(item);
    }

    saveStore(s);
    window.LMS.closeAdminModal();
    renderApp();
  },

  editSoal(id) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) window.LMS.openAdminModal(item);
  },

  quickVerify(id) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) {
      item.verificationStatus = "verified";
      item.updatedAt = new Date().toISOString();
      saveStore(s);
      renderApp();
    }
  },

  quickArchive(id) {
    if (confirm("Arsipkan butir soal ini? Soal tidak akan ditampilkan dalam latihan siswa.")) {
      const s = getStore();
      const item = s.bankSoal.find(x => x.id === id);
      if (item) {
        item.verificationStatus = "archived";
        item.updatedAt = new Date().toISOString();
        saveStore(s);
        renderApp();
      }
    }
  },

  quickDraft(id) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) {
      item.verificationStatus = "draft";
      item.updatedAt = new Date().toISOString();
      saveStore(s);
      renderApp();
    }
  },

  // Modal Checklist Review Kualitas
  openReviewModal(id) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (!item) return;

    const modal = document.getElementById("review-modal");
    document.getElementById("review-soal-id").textContent = item.id;
    document.getElementById("review-soal-target-id").value = item.id;
    document.getElementById("review-soal-pertanyaan").textContent = item.question;
    document.getElementById("review-soal-kunci").textContent = item.correctAnswer;
    document.getElementById("review-soal-pembahasan").textContent = item.explanation;
    document.getElementById("review-input-catatan").value = item.reviewNotes || "";

    const checkListContainer = document.getElementById("review-checklist-items");
    checkListContainer.innerHTML = DAFTAR_CHECKLIST_VERIFIKASI.map((txt, idx) => `
      <label class="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
        <input type="checkbox" id="chk_${idx}" class="review-chk mt-0.5 rounded text-blue-600">
        <span>${txt}</span>
      </label>
    `).join('');

    modal.classList.remove("hidden");
    if (window.lucide) lucide.createIcons();
  },

  closeReviewModal() {
    document.getElementById("review-modal").classList.add("hidden");
  },

  handleApproveReview() {
    const allChecked = Array.from(document.querySelectorAll(".review-chk")).every(c => c.checked);
    if (!allChecked) {
      if (!confirm("Beberapa poin checklist kualitas belum dicentang. Tetap setujui butir soal ini sebagai TERVERIFIKASI?")) {
        return;
      }
    }
    const id = document.getElementById("review-soal-target-id").value;
    const notes = document.getElementById("review-input-catatan").value.trim();

    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) {
      item.verificationStatus = "verified";
      item.reviewNotes = notes;
      item.updatedAt = new Date().toISOString();
      saveStore(s);
    }
    window.LMS.closeReviewModal();
    renderApp();
  },

  // Modal Impor & Ekspor
  openImportModal() {
    document.getElementById("import-modal").classList.remove("hidden");
    document.getElementById("import-file-input").value = "";
    document.getElementById("import-preview-result").classList.add("hidden");
    document.getElementById("btn-commit-import").disabled = true;
  },

  closeImportModal() {
    document.getElementById("import-modal").classList.add("hidden");
  },

  handleImportFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      const s = getStore();
      const validMapelIds = (s.mataPelajaran || []).map(m => m.id);
      const policy = document.getElementById("import-policy").value;

      const report = validasiImporMassal(text, s.bankSoal, validMapelIds, policy);
      window.currentImportReport = report;

      const resBox = document.getElementById("import-preview-result");
      resBox.classList.remove("hidden");

      if (report.isValid) {
        resBox.innerHTML = `
          <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs space-y-1">
            <strong class="font-bold flex items-center gap-1.5"><i data-lucide="check-circle" class="w-4 h-4"></i> Berkas Valid</strong>
            <p>Total data: ${report.stats.total} | Baru: ${report.stats.baru} | Perbarui: ${report.stats.update} | Dilewati: ${report.stats.skip}</p>
          </div>
        `;
        document.getElementById("btn-commit-import").disabled = false;
      } else {
        resBox.innerHTML = `
          <div class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs space-y-1">
            <strong class="font-bold flex items-center gap-1.5"><i data-lucide="alert-circle" class="w-4 h-4"></i> Validasi Gagal (${report.stats.invalid} Kesalahan)</strong>
            <ul class="list-disc pl-4 text-[11px] max-h-32 overflow-y-auto space-y-0.5 mt-1">
              ${report.errors.map(err => `<li>${escapeHtml(err)}</li>`).join('')}
            </ul>
          </div>
        `;
        document.getElementById("btn-commit-import").disabled = true;
      }
      if (window.lucide) lucide.createIcons();
    };
    reader.readAsText(file);
  },

  commitImport() {
    if (!window.currentImportReport || !window.currentImportReport.isValid) return;
    const items = window.currentImportReport.itemsToCommit;
    const s = getStore();

    // Terapkan penambahan atau pembaruan
    items.forEach(newItem => {
      const idx = s.bankSoal.findIndex(x => x.id === newItem.id);
      if (idx !== -1) {
        s.bankSoal[idx] = newItem;
      } else {
        s.bankSoal.push(newItem);
      }
    });

    saveStore(s);
    window.LMS.closeImportModal();
    alert(`Berhasil mengimpor ${items.length} butir soal ke dalam bank soal.`);
    renderApp();
  },

  openExportModal() {
    const s = getStore();
    const mapelSelect = document.getElementById("export-filter-subject");
    mapelSelect.innerHTML = `<option value="all">Semua Mata Pelajaran</option>` + (s.mataPelajaran || []).map(m => `<option value="${m.id}">[${m.kelompok}] ${m.nama}</option>`).join('');
    document.getElementById("export-modal").classList.remove("hidden");
  },

  closeExportModal() {
    document.getElementById("export-modal").classList.add("hidden");
  },

  executeExport() {
    const s = getStore();
    const fSub = document.getElementById("export-filter-subject").value;
    const fStat = document.getElementById("export-filter-status").value;

    let result = s.bankSoal || [];
    if (fSub !== "all") result = result.filter(q => q.subjectId === fSub);
    if (fStat !== "all") result = result.filter(q => q.verificationStatus === fStat);

    const exportPayload = {
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      totalQuestions: result.length,
      questions: result
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank_soal_tka_sd_${fSub}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.LMS.closeExportModal();
  },

  resetData() {
    if (confirm("Reset seluruh data LocalStorage ke bawaan awal Fase 2? Data sesi dan draf buatan sendiri akan terhapus.")) {
      localStorage.removeItem("LMS_TKA_SD_STATE_V1_1");
      location.reload();
    }
  }
};

window.addEventListener("hashchange", renderApp);
window.addEventListener("DOMContentLoaded", () => {
  if (!window.location.hash) window.location.hash = "#/anak/dashboard";
  renderApp();
});
