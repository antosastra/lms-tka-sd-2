import { escapeHtml } from '../utils/sanitizer.js';

export function renderAdminKonten(store) {
  return `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900">Manajemen Bank Soal & AI Generator</h1>
          <p class="text-xs text-slate-500">Kelola bank soal atau generate soal otomatis langsung dari dokumen sumber (PDF/Scan).</p>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="window.LMS.openAiGeneratorModal()" class="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-purple-700 flex items-center gap-1.5">
            <i data-lucide="sparkles" class="w-4 h-4"></i> Generate dari Sumber (AI)
          </button>
          <button onclick="window.LMS.openAdminModal()" class="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 flex items-center gap-1.5">
            <i data-lucide="plus" class="w-4 h-4"></i> Tambah Manual
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th class="p-3.5">ID Butir</th>
                <th class="p-3.5">Mapel & Domain</th>
                <th class="p-3.5">Tipe</th>
                <th class="p-3.5">Kesulitan</th>
                <th class="p-3.5">Kunci Sahih</th>
                <th class="p-3.5">Status Verifikasi</th>
                <th class="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${store.bankSoal.map(item => `
                <tr class="hover:bg-slate-50/80">
                  <td class="p-3.5 font-mono font-bold text-slate-900">${escapeHtml(item.id)}</td>
                  <td class="p-3.5">
                    <strong class="text-slate-800 block">${escapeHtml(item.mapel)}</strong>
                    <span class="text-slate-500 text-[11px]">${escapeHtml(item.kompetensi)}</span>
                  </td>
                  <td class="p-3.5"><span class="bg-slate-100 px-2 py-0.5 rounded font-medium">${escapeHtml(item.tipe)}</span></td>
                  <td class="p-3.5">${escapeHtml(item.kesulitan)}</td>
                  <td class="p-3.5 font-bold text-blue-600">${escapeHtml(item.kunci)}</td>
                  <td class="p-3.5"><span class="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-semibold">${escapeHtml(item.statusVerifikasi)}</span></td>
                  <td class="p-3.5 text-center whitespace-nowrap">
                    <button onclick="window.LMS.editSoal('${escapeHtml(item.id)}')" class="text-blue-600 hover:underline font-bold mr-2">Edit</button>
                    <button onclick="window.LMS.hapusSoal('${escapeHtml(item.id)}')" class="text-rose-600 hover:underline font-bold">Hapus</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal AI Generator from Source -->
      <div id="ai-generator-modal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 hidden">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <i data-lucide="sparkles" class="w-5 h-5 text-purple-600"></i> Generate Soal dari Dokumen Sumber
            </h3>
            <button onclick="window.LMS.closeAiGeneratorModal()" class="p-1 rounded-lg text-slate-400 hover:text-slate-600">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <div class="space-y-3 text-xs">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Pilih Dokumen Sumber (NotebookLM / Upload)</label>
              <select id="ai-source-file" class="w-full px-3 py-2 border rounded-xl focus:border-purple-600 focus:outline-none bg-white">
                <option value="SPM Plus TKA SD/MI 2026 (Erlangga)">SPM Plus TKA SD/MI 2026 (Erlangga)</option>
                <option value="Modul Kurikulum Merdeka Kelas 6 SD">Modul Kurikulum Merdeka Kelas 6 SD</option>
                <option value="Bank Soal Latihan Ujian Sekolah">Bank Soal Latihan Ujian Sekolah</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
              <select id="ai-source-mapel" class="w-full px-3 py-2 border rounded-xl focus:border-purple-600 focus:outline-none bg-white">
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Topik atau Halaman Referensi</label>
              <input type="text" id="ai-source-topic" placeholder="Contoh: Operasi Hitung Pecahan / Halaman 18" class="w-full px-3 py-2 border rounded-xl focus:border-purple-600 focus:outline-none">
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Tempel Teks Soal / Catatan dari Sumber (Opsional)</label>
              <textarea id="ai-source-raw" rows="3" placeholder="Salin teks atau uraian soal dari PDF sumber di sini agar AI membuat kloning isomorfiknya..." class="w-full px-3 py-2 border rounded-xl focus:border-purple-600 focus:outline-none"></textarea>
            </div>

            <div class="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px]">
              <strong>Mode Kloning Konsep (Isomorfik):</strong> Sistem akan membuatkan soal baru yang 100% orisinal (menjaga indikator kompetensi dan tingkat kesulitan yang sama persis dengan sumber, namun mengubah angka/narasi agar aman hak cipta).
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button type="button" onclick="window.LMS.closeAiGeneratorModal()" class="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs">Batal</button>
            <button type="button" onclick="window.LMS.runAiGenerator()" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5">
              <i data-lucide="cpu" class="w-4 h-4"></i> Generate & Masukkan ke Bank Soal
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
