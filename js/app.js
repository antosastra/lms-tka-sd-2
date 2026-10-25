/**
 * Kontroler Utama & Router LMS TKA SD
 * Mendukung Multiformat: PG, PGK MCMA, PGK Kategori, Isian
 * Mendukung Validasi & Impor Massal JSON
 */
import { getStore, saveStore } from './store/localStore.js';
import { DAFTAR_MATA_PELAJARAN } from './data/curriculum.js';
import { escapeHtml, periksaJawaban } from './utils/validator.js';

function navigate(hash) {
  window.location.hash = hash;
}

function safeLucide() {
  try {
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  } catch (err) {
    console.warn("Lucide deferred:", err);
  }
}

function renderApp() {
  const hash = window.location.hash || "#/anak/dashboard";
  const app = document.getElementById("app-root");
  const nav = document.getElementById("nav-actions");
  if (!app || !nav) return;

  const store = getStore();
  if (!store.mataPelajaran || store.mataPelajaran.length === 0) {
    store.mataPelajaran = DAFTAR_MATA_PELAJARAN;
    saveStore(store);
  }

  // Header Navigasi Peran
  if (store.role === "anak") {
    nav.innerHTML = `
      <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Dashboard</button>
      <button onclick="window.LMS.navigate('#/asesmen')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Simulasi</button>
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
      <button onclick="window.LMS.navigate('#/admin')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Manajemen Bank Soal</button>
      <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-3 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium">Pratinjau Siswa</button>
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 ml-2">Peran: Admin</span>
      <button onclick="window.LMS.navigate('#/masuk')" class="text-slate-400 hover:text-slate-600 ml-1" title="Ganti Peran"><i data-lucide="log-out" class="w-4 h-4"></i></button>
    `;
  }

  // Routing Halaman
  if (hash.startsWith("#/masuk")) app.innerHTML = viewLogin(store);
  else if (hash.startsWith("#/anak/dashboard")) app.innerHTML = viewDashboardAnak(store);
  else if (hash.startsWith("#/anak/latihan")) app.innerHTML = viewHalamanLatihan(store);
  else if (hash.startsWith("#/anak/pembahasan")) app.innerHTML = viewHalamanPembahasan(store);
  else if (hash.startsWith("#/anak/hasil")) app.innerHTML = viewHasilSesi(store);
  else if (hash.startsWith("#/ortu/dashboard")) app.innerHTML = viewDashboardOrtu(store);
  else if (hash.startsWith("#/asesmen")) app.innerHTML = viewEvaluasiSimulasi();
  else if (hash.startsWith("#/admin")) app.innerHTML = viewAdminKonten(store);
  else app.innerHTML = `<div class="text-center py-12"><button onclick="window.LMS.navigate('#/masuk')" class="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">Ke Beranda</button></div>`;

  safeLucide();
  window.scrollTo(0, 0);
}

// ---------------- Komponen Halaman ----------------
function viewLogin(store) {
  return `
    <div class="max-w-xl mx-auto py-8">
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-extrabold text-slate-900">LMS TKA SD — Mode Uji Coba</h1>
        <p class="text-sm text-slate-600 mt-2">Pilih simulasi peran pengguna untuk eksplorasi antarmuka asesmen.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onclick="window.LMS.pilihRole('anak')" class="bg-white p-6 rounded-2xl border-2 ${store.role === 'anak' ? 'border-blue-600 shadow-md' : 'border-slate-200'} hover:border-blue-500 cursor-pointer text-center flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4"><i data-lucide="book-open" class="w-8 h-8"></i></div>
          <h2 class="font-bold text-lg text-slate-900">Siswa (Kelas 6)</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">Latihan mandiri format PG, PGK Pilihan Jamak, dan PGK Tabel.</p>
          <span class="mt-auto inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">Masuk Sebagai Siswa</span>
        </div>
        <div onclick="window.LMS.pilihRole('ortu')" class="bg-white p-6 rounded-2xl border-2 ${store.role === 'ortu' ? 'border-purple-600 shadow-md' : 'border-slate-200'} hover:border-purple-500 cursor-pointer text-center flex flex-col items-center">
          <div class="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4"><i data-lucide="users" class="w-8 h-8"></i></div>
          <h2 class="font-bold text-lg text-slate-900">Orang Tua</h2>
          <p class="text-xs text-slate-500 mt-1 mb-4">Pantau riwayat hasil latihan dan analisis kesulitan anak.</p>
          <span class="mt-auto inline-block text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg">Masuk Sebagai Orang Tua</span>
        </div>
      </div>
      <div class="mt-6 text-center">
        <button onclick="window.LMS.pilihRole('admin')" class="text-xs text-slate-500 hover:text-slate-800 underline">Masuk ke Panel Manajemen Bank Soal</button>
      </div>
    </div>
  `;
}

function viewDashboardAnak(store) {
  const riwayat = store.riwayatSesi || [];
  let menitTotal = 0, benarTotal = 0;
  riwayat.forEach(s => {
    menitTotal += (s.estimasiMenit || 15);
    benarTotal += s.jumlahBenar;
  });
  const targetMenit = store.anak.targetMenit || 60;
  const persen = Math.min(100, Math.round((menitTotal / targetMenit) * 100));

  const mapelList = store.mataPelajaran || DAFTAR_MATA_PELAJARAN;
  const mapelTKA = mapelList.filter(m => (m.kelompok === "A" || m.kelompok === "tka"));
  const mapelUAS = mapelList.filter(m => (m.kelompok === "B" || m.kelompok === "ujian_sekolah"));

  const hitungSoal = (subjectId) => {
    const list = (store.bankSoal || []).filter(q => (q.subjectId || (q.mapel === "Matematika" ? "matematika" : "bahasa-indonesia")) === subjectId);
    const verified = list.filter(q => q.verificationStatus === "verified").length;
    const draft = list.length - verified;
    return { total: list.length, verified, draft };
  };

  return `
    <div class="space-y-6">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 md:p-8 shadow-lg">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-wider font-semibold bg-white/20 px-3 py-1 rounded-full">Persiapan Ujian TKA 2026/2027</span>
            <h1 class="text-2xl md:text-3xl font-extrabold mt-2">Halo, ${escapeHtml(store.anak.nama)}! 👋</h1>
            <p class="text-blue-100 text-sm mt-1">Pilih mata pelajaran atau topik wacana untuk mulai berlatih.</p>
          </div>
          <div class="flex items-center gap-3">
            <div class="bg-white/10 backdrop-blur border border-white/20 px-4 py-3 rounded-2xl text-center">
              <div class="text-amber-300 font-extrabold text-lg flex items-center justify-center gap-1"><i data-lucide="check-circle" class="w-5 h-5"></i> ${riwayat.length}</div>
              <span class="text-[11px] text-blue-100">Sesi Selesai</span>
            </div>
            <div class="bg-white/10 backdrop-blur border border-white/20 px-4 py-3 rounded-2xl text-center">
              <div class="text-emerald-300 font-extrabold text-lg flex items-center justify-center gap-1"><i data-lucide="award" class="w-5 h-5"></i> ${benarTotal}</div>
              <span class="text-[11px] text-blue-100">Jawaban Benar</span>
            </div>
          </div>
        </div>
        <div class="mt-6 bg-white/10 rounded-2xl p-4 border border-white/15">
          <div class="flex justify-between text-xs mb-2 font-medium">
            <span>Waktu Belajar: <strong>${menitTotal} dari ${targetMenit} Menit</strong></span>
            <span>${persen}%</span>
          </div>
          <div class="w-full bg-black/20 rounded-full h-3 overflow-hidden">
            <div class="bg-amber-400 h-3 rounded-full" style="width: ${persen}%"></div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <i data-lucide="target" class="w-5 h-5 text-blue-600"></i> Kelompok A — Tes Kemampuan Akademik (TKA)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${mapelTKA.map(m => {
            const stat = hitungSoal(m.id);
            return `
              <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">${m.nama}</span>
                    <span class="text-xs font-semibold ${stat.verified > 0 ? 'text-emerald-600' : 'text-slate-400'}">
                      ${stat.verified} Soal Terverifikasi ${stat.draft > 0 ? `<span class="text-slate-400 text-[10px]">(${stat.draft} draf)</span>` : ''}
                    </span>
                  </div>
                  <h3 class="font-bold text-base text-slate-900">${escapeHtml(m.nama)}</h3>
                  <p class="text-xs text-slate-500 mt-1">${escapeHtml(m.deskripsi)}</p>

                  <div class="mt-3 pt-3 border-t space-y-1.5">
                    <span class="text-[11px] font-bold text-slate-600 block">Pilih Topik Pembelajaran:</span>
                    <div class="flex flex-wrap gap-1.5">
                      ${(m.topik || []).map(t => `
                        <button onclick="window.LMS.siapkanSesiTopik('${m.id}', '${t.id}')" class="text-[11px] px-2.5 py-1 rounded-lg border bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-medium text-left">
                          ${escapeHtml(t.nama)}
                        </button>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t">
                  ${stat.verified > 0 ? `
                    <button onclick="window.LMS.siapkanSesiMapel('${m.id}')" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm">
                      Mulai Latihan Mandiri ${escapeHtml(m.nama)}
                    </button>
                  ` : `
                    <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-xs text-center font-medium">
                      0 butir terverifikasi (tinjau di menu Admin)
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="space-y-3 pt-2">
        <h2 class="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <i data-lucide="layers" class="w-5 h-5 text-purple-600"></i> Kelompok B — Ujian Akhir Sekolah
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${mapelUAS.map(m => {
            const stat = hitungSoal(m.id);
            return `
              <div class="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between text-[11px] mb-1.5">
                    <strong class="text-slate-800">${escapeHtml(m.nama)}</strong>
                    <span class="${stat.verified > 0 ? 'text-emerald-600 font-bold' : 'text-slate-400'}">${stat.verified} Siap</span>
                  </div>
                  <p class="text-[11px] text-slate-500 line-clamp-2">${escapeHtml(m.deskripsi)}</p>
                </div>
                <div class="mt-3 pt-2 border-t">
                  ${stat.verified > 0 ? `
                    <button onclick="window.LMS.siapkanSesiMapel('${m.id}')" class="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl">Mulai Latihan</button>
                  ` : `
                    <span class="block text-center text-[10px] text-slate-400 py-1 bg-slate-50 rounded-lg">Materi belum tersedia</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// --- VIEW: LATIHAN SOAL ---
function viewHalamanLatihan(store) {
  if (!store.sesiAktif?.soalList?.length) {
    return `
      <div class="max-w-md mx-auto text-center py-12 space-y-4 bg-white p-8 rounded-3xl border">
        <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <i data-lucide="alert-circle" class="w-6 h-6"></i>
        </div>
        <h2 class="text-base font-bold text-slate-900">Belum Ada Soal Terverifikasi</h2>
        <p class="text-xs text-slate-600">Topik atau mata pelajaran ini belum memiliki soal berstatus <strong>Verified</strong>. Buka panel Admin untuk menelaah butir soal.</p>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md">Kembali ke Dashboard</button>
      </div>
    `;
  }

  const { soalList, indeksAktif, labelSesi } = store.sesiAktif;
  const soal = soalList[indeksAktif];
  const tipe = (soal.questionType || soal.tipe || "PG").toUpperCase();
  const ans = store.jawabanSesiAktif[soal.id];

  return `
    <div class="max-w-2xl mx-auto space-y-4">
      <div class="bg-white p-4 rounded-2xl border flex justify-between items-center text-xs shadow-sm">
        <div>
          <span class="font-bold text-slate-800 block">${escapeHtml(labelSesi)}</span>
          <span class="text-slate-500">Soal ${indeksAktif + 1} dari ${soalList.length}</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="px-2 py-0.5 rounded-md font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
            ${tipe === 'PGK_MCMA' ? 'PGK Pilihan Jamak' : (tipe === 'PGK_KATEGORI' ? 'PGK Benar/Salah' : (tipe === 'ISIAN' ? 'Isian' : 'PG'))}
          </span>
          <span class="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200">
            Terverifikasi
          </span>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-6 border space-y-4 shadow-sm">
        <div class="flex items-center justify-between text-xs text-slate-500 font-semibold border-b pb-2">
          <span>${escapeHtml(soal.subjectId || soal.mapel)} • ${escapeHtml(soal.competencyId || soal.kompetensi)}</span>
          <span class="text-[11px] font-bold text-slate-600">Tingkat: ${escapeHtml(soal.difficulty || "Menengah")}</span>
        </div>

        ${soal.stimulus ? `
          <div class="p-4 bg-slate-50 rounded-2xl text-xs text-slate-800 leading-relaxed border whitespace-pre-line border-slate-200">
            ${soal.stimulus}
          </div>
        ` : ""}

        <p class="text-sm font-bold text-slate-900 leading-snug">${escapeHtml(soal.question || soal.tanya)}</p>

        <div class="pt-2">
          ${renderInputInteraktifSoal(soal, ans)}
        </div>

        <div class="flex justify-between pt-4 border-t items-center">
          <button onclick="window.LMS.pindahSoal(${indeksAktif - 1})" ${indeksAktif === 0 ? 'disabled class="opacity-40 text-xs font-bold text-slate-400 cursor-not-allowed"' : 'class="text-xs font-bold text-slate-700 hover:underline"'}>
            ← Sebelumnya
          </button>
          ${indeksAktif < soalList.length - 1 ? `
            <button onclick="window.LMS.pindahSoal(${indeksAktif + 1})" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md">
              Berikutnya →
            </button>
          ` : `
            <button onclick="window.LMS.selesaikanSesi()" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md">
              Kirim & Selesaikan Sesi
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderInputInteraktifSoal(soal, ans) {
  const tipe = (soal.questionType || soal.tipe || "PG").toUpperCase();

  if (tipe === "PG") {
    const rawOpts = soal.options || soal.opsi || [];
    return `
      <div class="space-y-2">
        ${rawOpts.map(opt => {
          const kode = (typeof opt === "string") ? opt.trim().charAt(0) : opt.id;
          const labelTeks = (typeof opt === "string") ? opt : `${opt.id}. ${opt.text}`;
          const isSel = (ans === kode);
          return `
            <label onclick="window.LMS.pilihJawaban('${soal.id}', '${kode}')" class="flex items-center gap-3 p-3 rounded-xl border-2 ${isSel ? 'border-blue-600 bg-blue-50/60 font-semibold text-blue-900' : 'border-slate-200 hover:border-slate-300'} cursor-pointer text-xs transition-colors">
              <input type="radio" name="rad_${soal.id}" ${isSel ? 'checked' : ''} class="text-blue-600 focus:ring-blue-500">
              <span>${escapeHtml(labelTeks)}</span>
            </label>
          `;
        }).join('')}
      </div>
    `;
  }

  if (tipe === "PGK_MCMA") {
    const rawOpts = soal.options || soal.opsi || [];
    const userArray = Array.isArray(ans) ? ans : [];
    return `
      <div class="space-y-2">
        <p class="text-[11px] text-indigo-700 font-semibold mb-2">💡 Pilih satu atau lebih pilihan jawaban yang Anda anggap benar:</p>
        ${rawOpts.map(opt => {
          const kode = (typeof opt === "string") ? opt.trim().charAt(0) : opt.id;
          const labelTeks = (typeof opt === "string") ? opt : `${opt.id}. ${opt.text}`;
          const isChecked = userArray.includes(kode);
          return `
            <label onclick="window.LMS.toggleJawabanMcma('${soal.id}', '${kode}')" class="flex items-center gap-3 p-3 rounded-xl border-2 ${isChecked ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900' : 'border-slate-200 hover:border-slate-300'} cursor-pointer text-xs transition-colors">
              <input type="checkbox" ${isChecked ? 'checked' : ''} class="rounded text-indigo-600 focus:ring-indigo-500" onclick="event.stopPropagation(); window.LMS.toggleJawabanMcma('${soal.id}', '${kode}')">
              <span>${escapeHtml(labelTeks)}</span>
            </label>
          `;
        }).join('')}
      </div>
    `;
  }

  if (tipe === "PGK_KATEGORI") {
    const statements = soal.statements || soal.pernyataan || [];
    const userMap = (typeof ans === "object" && ans !== null) ? ans : {};
    return `
      <div class="space-y-2">
        <p class="text-[11px] text-amber-800 font-semibold mb-2">💡 Berikan penilaian Benar atau Salah pada masing-masing pernyataan berikut:</p>
        <div class="border border-slate-200 rounded-xl overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b text-slate-700 font-semibold">
              <tr>
                <th class="p-3">Pernyataan</th>
                <th class="p-3 text-center w-20">Benar</th>
                <th class="p-3 text-center w-20">Salah</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${statements.map((stmt, idx) => {
                const teks = (typeof stmt === "string") ? stmt : stmt.text;
                const statusPilihan = userMap[idx];
                return `
                  <tr class="hover:bg-slate-50/60">
                    <td class="p-3 text-slate-800">${escapeHtml(teks)}</td>
                    <td class="p-3 text-center">
                      <input type="radio" name="kat_${soal.id}_${idx}" value="true" ${statusPilihan === true ? 'checked' : ''} onchange="window.LMS.pilihJawabanKategori('${soal.id}', ${idx}, true)" class="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                    </td>
                    <td class="p-3 text-center">
                      <input type="radio" name="kat_${soal.id}_${idx}" value="false" ${statusPilihan === false ? 'checked' : ''} onchange="window.LMS.pilihJawabanKategori('${soal.id}', ${idx}, false)" class="w-4 h-4 text-rose-600 focus:ring-rose-500 cursor-pointer">
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  return `
    <div class="space-y-1">
      <label class="block text-slate-700 text-xs font-semibold mb-1">Ketikkan jawaban Anda:</label>
      <input type="text" value="${escapeHtml(ans || '')}" oninput="window.LMS.simpanIsian('${soal.id}', this.value)" placeholder="Tuliskan angka atau jawaban teks..." class="w-full px-3.5 py-2.5 border rounded-xl text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
    </div>
  `;
}

// --- VIEW: HASIL SESI ---
function viewHasilSesi(store) {
  const latest = store.riwayatSesi[store.riwayatSesi.length - 1];
  if (!latest) return `<div class="text-center py-12"><button onclick="window.LMS.navigate('#/anak/dashboard')">Kembali</button></div>`;

  return `
    <div class="max-w-md mx-auto bg-white p-8 rounded-3xl border text-center space-y-4 shadow-sm">
      <span class="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">Sesi Selesai</span>
      <h1 class="text-5xl font-black text-blue-600">${latest.skor}</h1>
      <p class="text-xs text-slate-500">${latest.jumlahBenar} dari ${latest.totalSoal} Soal Terjawab Benar</p>
      <div class="flex gap-2 pt-2">
        <button onclick="window.LMS.navigate('#/anak/pembahasan')" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm">Lihat Pembahasan</button>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold">Dashboard</button>
      </div>
    </div>
  `;
}

// --- VIEW: PEMBAHASAN LENGKAP ---
function viewHalamanPembahasan(store) {
  const soalList = store.sesiAktif?.soalList || [];
  return `
    <div class="max-w-2xl mx-auto space-y-4 pb-12">
      <div class="flex justify-between items-center">
        <h1 class="text-lg font-bold text-slate-900">Pembahasan Jawaban & Solusi Konsep</h1>
        <button onclick="window.LMS.navigate('#/anak/dashboard')" class="text-xs font-bold text-blue-600 hover:underline">Selesai Belajar</button>
      </div>
      ${soalList.map((s, idx) => {
        const userAns = store.jawabanSesiAktif[s.id];
        const res = periksaJawaban(s, userAns);
        const tipe = (s.questionType || s.tipe || "PG").toUpperCase();

        return `
          <div class="bg-white p-5 rounded-2xl border space-y-2 text-xs shadow-sm">
            <div class="flex justify-between items-center font-bold">
              <span>#${idx + 1} • ${escapeHtml(s.subjectId || s.mapel)} (${escapeHtml(s.competencyId || s.kompetensi)})</span>
              <span class="px-2 py-0.5 rounded text-[10px] ${res.status === 'BENAR' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                ${res.status} ${res.akurasi ? `(${res.akurasi})` : ''}
              </span>
            </div>
            <p class="text-slate-800 font-medium">${escapeHtml(s.question || s.tanya)}</p>

            <div class="p-3.5 bg-slate-50 rounded-xl text-slate-700 space-y-1.5 border border-slate-100">
              ${renderRekapKunciPembahasan(s, userAns, tipe)}
              <p class="text-slate-600 pt-1 leading-relaxed border-t border-slate-200">
                <strong>Solusi:</strong> ${escapeHtml(s.explanation || s.pembahasan)}
              </p>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderRekapKunciPembahasan(s, userAns, tipe) {
  if (tipe === "PG") {
    return `<div>Jawaban Anda: <strong class="font-mono text-slate-900">${escapeHtml(userAns || 'Tidak diisi')}</strong> | Kunci: <strong class="text-emerald-700 font-mono">${escapeHtml(s.correctAnswer || s.kunci)}</strong></div>`;
  }
  if (tipe === "PGK_MCMA") {
    const kArray = Array.isArray(s.correctAnswer || s.kunci) ? (s.correctAnswer || s.kunci) : [s.correctAnswer || s.kunci];
    const uArray = Array.isArray(userAns) ? userAns : [];
    return `<div>Pilihan Anda: <strong class="font-mono text-slate-900">[${uArray.join(', ') || 'Kosong'}]</strong> | Kunci: <strong class="text-emerald-700 font-mono">[${kArray.join(', ')}]</strong></div>`;
  }
  if (tipe === "PGK_KATEGORI") {
    const stmts = s.statements || s.pernyataan || [];
    const uMap = (typeof userAns === "object" && userAns !== null) ? userAns : {};
    return `
      <div class="space-y-1">
        <span class="font-bold text-slate-800 block">Kunci Penilaian Pernyataan:</span>
        <ul class="list-disc pl-4 space-y-0.5 text-[11px]">
          ${stmts.map((st, i) => {
            const k = Boolean(st.correct ?? st.kunci);
            const u = uMap[i];
            const isMatch = (u === k);
            return `<li>${escapeHtml(st.text || st)} — Kunci: <strong class="text-emerald-700">${k ? 'Benar' : 'Salah'}</strong> (Pilihan: ${u !== undefined ? (u ? 'Benar' : 'Salah') : 'Kosong'}) ${isMatch ? '✅' : '❌'}</li>`;
          }).join('')}
        </ul>
      </div>
    `;
  }
  return `<div>Jawaban Anda: <strong class="font-mono text-slate-900">${escapeHtml(userAns || 'Tidak diisi')}</strong> | Kunci Sahih: <strong class="text-emerald-700 font-mono">${escapeHtml(s.correctAnswer || s.kunci)}</strong></div>`;
}

// --- VIEW: DASHBOARD ORANG TUA ---
function viewDashboardOrtu(store) {
  return `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border space-y-4 shadow-sm">
      <h1 class="text-lg font-bold text-purple-900">Pantauan Belajar: ${escapeHtml(store.anak.nama)}</h1>
      <p class="text-xs text-slate-600">Total sesi mandiri terselesaikan: <strong>${store.riwayatSesi.length} Sesi</strong></p>
      <div class="p-3.5 bg-purple-50 rounded-xl text-xs text-purple-900 border border-purple-100">
        <strong>Catatan Guru/Pendamping:</strong> ${escapeHtml(store.ortu.catatanRekomendasi)}
      </div>
    </div>
  `;
}

// --- VIEW: ASESMEN ---
function viewEvaluasiSimulasi() {
  return `
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl border space-y-3 text-xs shadow-sm">
      <h1 class="text-base font-bold text-slate-900">Informasi Regulasi & Kalender Asesmen</h1>
      <p class="text-slate-600">• Asesmen Sumatif Akhir Jenjang (ASAJ SD): <strong>11 – 22 Mei 2027</strong></p>
      <p class="text-slate-600">• Kerangka Asesmen TKA: <strong>Peraturan Kepala BSKAP No. 047/H/AN/2025</strong></p>
    </div>
  `;
}

// --- VIEW: PANEL ADMIN ---
function viewAdminKonten(store) {
  const bank = store.bankSoal || [];
  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">Manajemen Bank Soal (${bank.length} Butir)</h1>
          <p class="text-xs text-slate-500">Kelola status butir (draf, needs_review, verified) dan format soal.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button onclick="window.LMS.openAdminModal()" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> Tambah Butir Soal
          </button>
          <button onclick="window.LMS.openImportModal()" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
            <i data-lucide="upload" class="w-4 h-4"></i> Impor JSON
          </button>
          <button onclick="window.LMS.eksporJSON()" class="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
            <i data-lucide="download" class="w-4 h-4"></i> Ekspor JSON
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th class="p-3.5">ID</th>
                <th class="p-3.5">Mata Pelajaran</th>
                <th class="p-3.5">Format</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${bank.map(item => {
                const tipe = (item.questionType || item.tipe || "PG").toUpperCase();
                return `
                  <tr class="hover:bg-slate-50/80">
                    <td class="p-3.5 font-mono font-bold text-slate-900">${escapeHtml(item.id)}</td>
                    <td class="p-3.5">${escapeHtml(item.subjectId || item.mapel)}</td>
                    <td class="p-3.5"><span class="px-2 py-0.5 bg-slate-100 rounded font-semibold text-[10px]">${tipe}</span></td>
                    <td class="p-3.5">
                      <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${item.verificationStatus === 'verified' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-800 bg-amber-50 border-amber-200'}">
                        ${escapeHtml(item.verificationStatus || 'needs_review')}
                      </span>
                    </td>
                    <td class="p-3.5 text-center whitespace-nowrap space-x-1">
                      ${item.verificationStatus !== "verified" ? `
                        <button onclick="window.LMS.setStatusSoal('${escapeHtml(item.id)}', 'verified')" class="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded font-bold">Setujui</button>
                      ` : `
                        <button onclick="window.LMS.setStatusSoal('${escapeHtml(item.id)}', 'needs_review')" class="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded font-bold">Tinjau</button>
                      `}
                      <button onclick="window.LMS.editSoal('${escapeHtml(item.id)}')" class="px-2 py-1 bg-blue-50 text-blue-700 rounded font-bold">Edit</button>
                      <button onclick="window.LMS.hapusSoal('${escapeHtml(item.id)}')" class="px-2 py-1 bg-rose-50 text-rose-700 rounded font-bold">Hapus</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ---------------- Antarmuka Global LMS (window.LMS) ----------------
window.LMS = {
  navigate,
  tempImportData: null,

  pilihRole(role) {
    const s = getStore();
    s.role = role;
    saveStore(s);
    if (role === "anak") navigate("#/anak/dashboard");
    else if (role === "ortu") navigate("#/ortu/dashboard");
    else navigate("#/admin");
  },

  siapkanSesiMapel(subjectId) {
    const s = getStore();
    const mapels = s.mataPelajaran || DAFTAR_MATA_PELAJARAN;
    const valid = (s.bankSoal || []).filter(q => (q.subjectId || (q.mapel === "Matematika" ? "matematika" : "bahasa-indonesia")) === subjectId && q.verificationStatus === "verified");

    if (valid.length === 0) {
      alert("Belum ada butir soal berstatus 'verified' pada mata pelajaran ini.");
      return;
    }
    const sub = mapels.find(m => m.id === subjectId);
    s.sesiAktif = {
      mode: subjectId,
      labelSesi: sub ? sub.nama : subjectId,
      indeksAktif: 0,
      soalList: valid
    };
    s.jawabanSesiAktif = {};
    s.sesiSudahDisimpan = false;
    saveStore(s);
    navigate("#/anak/latihan");
  },

  siapkanSesiTopik(subjectId, topicId) {
    const s = getStore();
    const mapels = s.mataPelajaran || DAFTAR_MATA_PELAJARAN;
    const valid = (s.bankSoal || []).filter(q => (q.subjectId || (q.mapel === "Matematika" ? "matematika" : "bahasa-indonesia")) === subjectId && q.topicId === topicId && q.verificationStatus === "verified");

    if (valid.length === 0) {
      alert("Belum ada butir soal terverifikasi pada topik ini. Silakan setujui butir soal di menu Admin.");
      return;
    }
    const sub = mapels.find(m => m.id === subjectId);
    const top = sub?.topik?.find(t => t.id === topicId);
    s.sesiAktif = {
      mode: subjectId,
      labelSesi: `${sub ? sub.nama : subjectId} — ${top ? top.nama : topicId}`,
      indeksAktif: 0,
      soalList: valid
    };
    s.jawabanSesiAktif = {};
    s.sesiSudahDisimpan = false;
    saveStore(s);
    navigate("#/anak/latihan");
  },

  pilihJawaban(id, kode) {
    const s = getStore();
    s.jawabanSesiAktif[id] = kode;
    saveStore(s);
    renderApp();
  },

  toggleJawabanMcma(id, kode) {
    const s = getStore();
    let current = Array.isArray(s.jawabanSesiAktif[id]) ? [...s.jawabanSesiAktif[id]] : [];
    if (current.includes(kode)) {
      current = current.filter(x => x !== kode);
    } else {
      current.push(kode);
    }
    s.jawabanSesiAktif[id] = current;
    saveStore(s);
    renderApp();
  },

  pilihJawabanKategori(id, stmtIdx, valBool) {
    const s = getStore();
    if (typeof s.jawabanSesiAktif[id] !== "object" || s.jawabanSesiAktif[id] === null || Array.isArray(s.jawabanSesiAktif[id])) {
      s.jawabanSesiAktif[id] = {};
    }
    s.jawabanSesiAktif[id][stmtIdx] = valBool;
    saveStore(s);
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
      mode: s.sesiAktif.mode,
      label: s.sesiAktif.labelSesi,
      totalSoal: s.sesiAktif.soalList.length,
      jumlahBenar: benar,
      skor: Math.round((benar / s.sesiAktif.soalList.length) * 100),
      estimasiMenit: 15
    });

    s.sesiSudahDisimpan = true;
    saveStore(s);
    navigate("#/anak/hasil");
  },

  setStatusSoal(id, status) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) {
      item.verificationStatus = status;
      saveStore(s);
      renderApp();
    }
  },

  editSoal(id) {
    const s = getStore();
    const item = s.bankSoal.find(x => x.id === id);
    if (item) window.LMS.openAdminModal(item);
  },

  hapusSoal(id) {
    if (confirm(`Hapus butir soal ${id}?`)) {
      const s = getStore();
      s.bankSoal = s.bankSoal.filter(x => x.id !== id);
      saveStore(s);
      renderApp();
    }
  },

  handleSubjectChange(subId) {
    const mapels = DAFTAR_MATA_PELAJARAN;
    const sub = mapels.find(m => m.id === subId);
    const topSelect = document.getElementById("soal-topic-id");
    if (topSelect && sub) {
      topSelect.innerHTML = (sub.topik || []).map(t => `<option value="${t.id}">${escapeHtml(t.nama)}</option>`).join('');
    }
  },

  openAdminModal(soal = null) {
    const s = getStore();
    const mapels = s.mataPelajaran || DAFTAR_MATA_PELAJARAN;
    const modal = document.getElementById("admin-modal");
    const subSelect = document.getElementById("soal-subject-id") || document.getElementById("soal-mapel");
    
    if (subSelect) {
      subSelect.innerHTML = mapels.map(m => `<option value="${m.id}">${escapeHtml(m.nama)}</option>`).join('');
    }

    if (soal) {
      document.getElementById("modal-title").textContent = `Edit Soal (${soal.id})`;
      document.getElementById("edit-original-id").value = soal.id;
      document.getElementById("soal-id").value = soal.id;
      document.getElementById("soal-id").disabled = true;
      if (subSelect) {
        subSelect.value = soal.subjectId || "matematika";
        window.LMS.handleSubjectChange(subSelect.value);
      }
      const topSelect = document.getElementById("soal-topic-id");
      if (topSelect && soal.topicId) topSelect.value = soal.topicId;

      document.getElementById("soal-status").value = soal.verificationStatus || "needs_review";
      document.getElementById("soal-kompetensi").value = soal.competencyId || soal.kompetensi || "";
      document.getElementById("soal-kesulitan").value = soal.difficulty || "Dasar";
      const tipe = (soal.questionType || soal.tipe || "PG").toUpperCase();
      document.getElementById("soal-tipe").value = tipe;
      document.getElementById("soal-stimulus").value = soal.stimulus || "";
      document.getElementById("soal-tanya").value = soal.question || soal.tanya || "";
      document.getElementById("soal-pembahasan").value = soal.explanation || soal.pembahasan || "";

      window.LMS.toggleFormTipe(tipe);
      if (tipe === "PG") {
        const opts = soal.options || soal.opsi || [];
        document.getElementById("soal-opsi-a").value = opts[0]?.text || opts[0] || "";
        document.getElementById("soal-opsi-b").value = opts[1]?.text || opts[1] || "";
        document.getElementById("soal-opsi-c").value = opts[2]?.text || opts[2] || "";
        document.getElementById("soal-opsi-d").value = opts[3]?.text || opts[3] || "";
        document.getElementById("soal-kunci-pg").value = soal.correctAnswer || soal.kunci || "A";
      } else {
        document.getElementById("soal-kunci-isian").value = soal.correctAnswer || soal.kunci || "";
        document.getElementById("soal-alt-isian").value = (soal.alternatives || []).join(", ");
      }
    } else {
      document.getElementById("modal-title").textContent = "Tambah Butir Soal Baru";
      document.getElementById("edit-original-id").value = "";
      document.getElementById("soal-id").value = "";
      document.getElementById("soal-id").disabled = false;
      document.getElementById("form-soal").reset();
      if (subSelect && subSelect.options.length > 0) {
        window.LMS.handleSubjectChange(subSelect.options[0].value);
      }
      window.LMS.toggleFormTipe("PG");
    }
    modal.classList.remove("hidden");
    safeLucide();
  },

  closeAdminModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) modal.classList.add("hidden");
  },

  toggleFormTipe(t) {
    const pgBox = document.getElementById("pg-fields");
    const isianBox = document.getElementById("isian-fields");
    if (!pgBox || !isianBox) return;

    if (t === "PG") {
      pgBox.classList.remove("hidden");
      isianBox.classList.add("hidden");
    } else {
      pgBox.classList.add("hidden");
      isianBox.classList.remove("hidden");
    }
  },

  handleSaveSoal(e) {
    e.preventDefault();
    const s = getStore();
    const origId = document.getElementById("edit-original-id").value;
    const id = document.getElementById("soal-id").value.trim().toUpperCase();
    const tipe = document.getElementById("soal-tipe").value;

    if (!origId && s.bankSoal.some(x => x.id === id)) {
      alert(`ID Soal ${id} sudah terdaftar.`);
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

    const subSelect = document.getElementById("soal-subject-id") || document.getElementById("soal-mapel");
    const topSelect = document.getElementById("soal-topic-id");

    const item = {
      id,
      subjectId: subSelect ? subSelect.value : "matematika",
      topicId: topSelect ? topSelect.value : "umum",
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
      source: "Input Manual Admin",
      verificationStatus: document.getElementById("soal-status")?.value || "needs_review"
    };

    if (origId) {
      const idx = s.bankSoal.findIndex(x => x.id === origId);
      if (idx !== -1) s.bankSoal[idx] = item;
    } else {
      s.bankSoal.push(item);
    }

    saveStore(s);
    window.LMS.closeAdminModal();
    renderApp();
  },

  // ---------------- HANDLER IMPOR FILE JSON ----------------
  handleImportFileSelect(input) {
    const file = input && input.files && input.files[0];
    const btnProses = document.querySelector("#modalImpor button:last-child, #import-modal button.bg-emerald-600, #import-modal button:last-child");

    if (!file) {
      window.LMS.tempImportData = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const parsed = JSON.parse(e.target.result);
        const list = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.bankSoal || []);

        if (!Array.isArray(list) || list.length === 0) {
          alert("Format JSON tidak valid: Berkas harus berupa array butir soal atau memiliki properti 'questions'.");
          if (btnProses) {
            btnProses.disabled = true;
            btnProses.classList.add("opacity-50", "cursor-not-allowed");
          }
          return;
        }

        window.LMS.tempImportData = list;

        // Buka status tombol Proses Impor
        if (btnProses) {
          btnProses.disabled = false;
          btnProses.classList.remove("opacity-50", "cursor-not-allowed");
          btnProses.classList.remove("bg-blue-300");
          btnProses.classList.add("bg-blue-600");
        }
      } catch (err) {
        alert("Sintaks JSON tidak valid: " + err.message);
        if (btnProses) {
          btnProses.disabled = true;
          btnProses.classList.add("opacity-50", "cursor-not-allowed");
        }
      }
    };
    reader.readAsText(file);
  },

  openImportModal() {
    const modal = document.getElementById("import-modal") || document.getElementById("modalImpor");
    if (modal) modal.classList.remove("hidden");
    window.LMS.tempImportData = null;
    safeLucide();
  },

  closeImportModal() {
    const modal = document.getElementById("import-modal") || document.getElementById("modalImpor");
    if (modal) modal.classList.add("hidden");
  },

  // Mendukung panggilan prosesImporJSON maupun eksekusiImporBankSoal
  prosesImporJSON() {
    window.LMS.eksekusiImporBankSoal();
  },

  eksekusiImporBankSoal() {
    const rawList = window.LMS.tempImportData;
    if (!rawList || !Array.isArray(rawList) || rawList.length === 0) {
      alert("Silakan pilih berkas JSON butir soal terlebih dahulu.");
      return;
    }

    const policyElem = document.getElementById("kebijakanDuplikat") || document.getElementById("import-conflict-policy");
    const policy = policyElem ? policyElem.value : "skip";

    const s = getStore();
    const existingMap = new Map();
    s.bankSoal.forEach(q => existingMap.set(String(q.id).trim().toUpperCase(), q));

    let ditambah = 0, dilewati = 0, ditimpa = 0;

    rawList.forEach(item => {
      const qId = item.id ? String(item.id).trim().toUpperCase() : null;
      if (!qId) return;

      const normalized = {
        ...item,
        id: qId,
        verificationStatus: item.verificationStatus || "needs_review"
      };

      if (existingMap.has(qId)) {
        if (policy === "overwrite" || policy === "replace") {
          existingMap.set(qId, normalized);
          ditimpa++;
        } else {
          dilewati++;
        }
      } else {
        existingMap.set(qId, normalized);
        ditambah++;
      }
    });

    s.bankSoal = Array.from(existingMap.values());
    saveStore(s);

    alert(`Impor Selesai!\n• Ditambahkan: ${ditambah} soal\n• Dilewati (Duplikat): ${dilewati} soal\n• Diperbarui: ${ditimpa} soal`);

    window.LMS.tempImportData = null;
    window.LMS.closeImportModal();
    renderApp();
  },

  eksporJSON() {
    const s = getStore();
    const payload = {
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      questions: s.bankSoal
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `bank-soal-tka-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  resetData() {
    if (confirm("Reset seluruh data LocalStorage ke setelan awal bawaan?")) {
      localStorage.removeItem("LMS_TKA_SD_STATE_V1_1");
      location.reload();
    }
  }
};

// Inisialisasi Siklus Hidup Router
window.addEventListener("hashchange", renderApp);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.hash) window.location.hash = "#/anak/dashboard";
    renderApp();
  });
} else {
  if (!window.location.hash) window.location.hash = "#/anak/dashboard";
  renderApp();
}
