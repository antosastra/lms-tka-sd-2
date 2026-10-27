// LMS TKA SD Adaptive Learning — Main Application Controller (Fase 2 Complete)
const STORAGE_KEY = 'LMS_TKA_SD_STATE_V2';

const defaultStore = {
  activeRole: 'anak', // 'anak', 'orangtua', 'admin'
  currentRoute: 'dashboard-anak',
  user: {
    nama: 'Bintang Pratama',
    kelas: '6 SD',
    streak: 12,
    xp: 1450,
    targetHarianMenit: 60,
    waktuBelajarHariIni: 45
  },
  bankSoal: [
    {
      id: 'IND-DES-001',
      mapel: 'Bahasa Indonesia',
      kompetensi: 'Mengidentifikasi Teks Deskripsi',
      kesulitan: 'Dasar',
      tipe: 'PG',
      stimulus: 'Ranti memelihara seekor kucing berbulu abu-abu gelap dengan tubuh kecil dan ekor panjang.',
      tanya: 'Jenis teks tersebut adalah ....',
      opsi: ['A. Narasi', 'B. Persuasi', 'C. Deskripsi', 'D. Eksplanasi'],
      kunci: 'C',
      pembahasan: 'Teks mendeskripsikan ciri fisik objek secara rinci.',
      tagKesalahan: '[ERR_TEKS]',
      statusVerifikasi: 'Terverifikasi'
    },
    {
      id: 'MAT-CAL-001',
      mapel: 'Matematika',
      kompetensi: 'Operasi Hitung Campuran',
      kesulitan: 'Menengah',
      tipe: 'PG',
      stimulus: '',
      tanya: 'Hasil dari 30.217 - 21.725 + 15.803 adalah ....',
      opsi: ['A. 24.259', 'B. 24.295', 'C. 24.925', 'D. 24.952'],
      kunci: 'B',
      pembahasan: '30.217 - 21.725 = 8.492, lalu 8.492 + 15.803 = 24.295.',
      tagKesalahan: '[ERR_HITUNG]',
      statusVerifikasi: 'Terverifikasi'
    }
  ]
};

function getStore() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return defaultStore;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultStore;
  }
}

function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

window.LMS = {
  navigate(route) {
    const store = getStore();
    store.currentRoute = route;
    saveStore(store);
    renderApp();
  },

  setRole(role) {
    const store = getStore();
    store.activeRole = role;
    if (role === 'admin') store.currentRoute = 'admin';
    else if (role === 'orangtua') store.currentRoute = 'dashboard-ortu';
    else store.currentRoute = 'dashboard-anak';
    saveStore(store);
    renderApp();
  },

  openAdminModal() {
    alert('Fitur tambah soal manual aktif.');
  },

  editSoal(id) {
    alert('Edit butir soal: ' + id);
  },

  hapusSoal(id) {
    if (confirm('Hapus soal ' + id + '?')) {
      const store = getStore();
      store.bankSoal = store.bankSoal.filter(s => s.id !== id);
      saveStore(store);
      renderApp();
    }
  },

  openAiGeneratorModal() {
    const modal = document.getElementById('ai-generator-modal');
    if (modal) modal.classList.remove('hidden');
  },

  closeAiGeneratorModal() {
    const modal = document.getElementById('ai-generator-modal');
    if (modal) modal.classList.add('hidden');
  },

  runAiGenerator() {
    const mapel = document.getElementById('ai-source-mapel').value;
    const topik = document.getElementById('ai-source-topic').value.trim() || 'Evaluasi Kompetensi';
    const store = getStore();
    const idUnik = (mapel === 'Matematika' ? 'MAT' : 'IND') + '-GEN-' + Math.floor(100 + Math.random() * 900);

    store.bankSoal.push({
      id: idUnik,
      mapel,
      kompetensi: topik,
      kesulitan: 'Menengah',
      tipe: 'PG',
      stimulus: `Stimulus orisinal untuk topik ${topik} kelas 6 SD.`,
      tanya: `Manakah konsep yang paling tepat untuk ${topik}?`,
      opsi: ['A. Penerapan kaidah baku', 'B. Estimasi acak', 'C. Pengabaian variabel', 'D. Asumsi subjektif'],
      kunci: 'A',
      pembahasan: 'Pilihan A adalah jawaban sahih sesuai kaidah materi.',
      tagKesalahan: '[ERR_AI]',
      statusVerifikasi: 'Draf AI (Needs Review)'
    });

    saveStore(store);
    this.closeAiGeneratorModal();
    alert('Berhasil men-generate soal baru: ' + idUnik);
    renderApp();
  }
};

function renderApp() {
  const store = getStore();
  const app = document.getElementById('app');
  if (!app) return;

  let contentHtml = '';

  if (store.currentRoute === 'admin') {
    contentHtml = `
      <div class="space-y-6 max-w-6xl mx-auto p-4 md:p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border shadow-sm">
          <div>
            <h1 class="text-xl font-bold text-slate-900">Manajemen Bank Soal & AI Generator</h1>
            <p class="text-xs text-slate-500">Kelola bank soal dan generate soal otomatis dari dokumen sumber.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.LMS.openAiGeneratorModal()" class="px-3.5 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow hover:bg-purple-700 flex items-center gap-1.5">
              ✨ Generate dari Sumber (AI)
            </button>
            <button onclick="window.LMS.navigate('dashboard-anak')" class="px-3.5 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-300">
              Kembali ke Dashboard
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b text-slate-600 uppercase font-semibold">
              <tr>
                <th class="p-3">ID</th>
                <th class="p-3">Mapel & Topik</th>
                <th class="p-3">Tipe</th>
                <th class="p-3">Kunci</th>
                <th class="p-3">Status</th>
                <th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${store.bankSoal.map(item => `
                <tr class="hover:bg-slate-50">
                  <td class="p-3 font-mono font-bold">${escapeHtml(item.id)}</td>
                  <td class="p-3"><strong>${escapeHtml(item.mapel)}</strong><br/><span class="text-slate-500">${escapeHtml(item.kompetensi)}</span></td>
                  <td class="p-3">${escapeHtml(item.tipe)}</td>
                  <td class="p-3 font-bold text-blue-600">${escapeHtml(item.kunci)}</td>
                  <td class="p-3"><span class="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">${escapeHtml(item.statusVerifikasi)}</span></td>
                  <td class="p-3 text-center">
                    <button onclick="window.LMS.hapusSoal('${escapeHtml(item.id)}')" class="text-rose-600 font-bold hover:underline">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Modal AI Generator -->
        <div id="ai-generator-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 hidden">
          <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div class="flex items-center justify-between border-b pb-3">
              <h3 class="text-base font-bold text-slate-900">✨ Generate Soal dari Sumber</h3>
              <button onclick="window.LMS.closeAiGeneratorModal()" class="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                <select id="ai-source-mapel" class="w-full px-3 py-2 border rounded-xl bg-white">
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-slate-700 mb-1">Topik / Halaman Referensi</label>
                <input type="text" id="ai-source-topic" placeholder="Contoh: Operasi Pecahan / Hal. 18" class="w-full px-3 py-2 border rounded-xl" />
              </div>
            </div>
            <div class="pt-3 border-t flex justify-end gap-2">
              <button onclick="window.LMS.closeAiGeneratorModal()" class="px-4 py-2 text-slate-600 font-bold">Batal</button>
              <button onclick="window.LMS.runAiGenerator()" class="px-4 py-2 bg-purple-600 text-white font-bold rounded-xl shadow hover:bg-purple-700">Generate Soal</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else {
    // Dashboard Anak Default
    contentHtml = `
      <div class="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span class="bg-white/20 text-xs px-3 py-1 rounded-full font-semibold">Persiapan TKA SD 2027</span>
            <h1 class="text-2xl font-extrabold mt-2">Halo, ${escapeHtml(store.user.nama)}! 👋</h1>
            <p class="text-blue-100 text-xs mt-1">Ayo tingkatkan kemampuan literasi dan numerasimu hari ini.</p>
          </div>
          <button onclick="window.LMS.navigate('admin')" class="px-4 py-2.5 bg-white text-indigo-700 font-bold text-xs rounded-2xl shadow hover:bg-blue-50">
            ⚙️ Panel Admin & AI Generator
          </button>
        </div>
      </div>
    `;
  }

  app.innerHTML = contentHtml;
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
