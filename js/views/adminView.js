/**
 * Tampilan Pengelolaan Bank Soal & Content Management (Admin)
 */
import { escapeHtml, DAFTAR_CHECKLIST_VERIFIKASI } from '../utils/validator.js';

export function renderAdminKonten(store, filters = {}) {
  const bank = store.bankSoal || [];
  const mapelList = store.mataPelajaran || [];

  // Hitung statistik per status
  const totalSoal = bank.length;
  const verifiedCount = bank.filter(q => q.verificationStatus === "verified").length;
  const reviewCount = bank.filter(q => q.verificationStatus === "needs_review").length;
  const draftCount = bank.filter(q => q.verificationStatus === "draft").length;
  const archivedCount = bank.filter(q => q.verificationStatus === "archived").length;

  // Filter reaktif
  const qKeyword = (filters.search || "").toLowerCase().trim();
  const fSubject = filters.subject || "all";
  const fStatus = filters.status || "all";
  const fDifficulty = filters.difficulty || "all";

  const filteredSoal = bank.filter(item => {
    if (fSubject !== "all" && item.subjectId !== fSubject) return false;
    if (fStatus !== "all" && item.verificationStatus !== fStatus) return false;
    if (fDifficulty !== "all" && item.difficulty !== fDifficulty) return false;
    if (qKeyword) {
      const matchId = item.id.toLowerCase().includes(qKeyword);
      const matchTanya = item.question.toLowerCase().includes(qKeyword);
      const matchKomp = item.competencyId.toLowerCase().includes(qKeyword);
      if (!matchId && !matchTanya && !matchKomp) return false;
    }
    return true;
  });

  return `
    <div class="space-y-6 pb-12">
      <!-- Peringatan Kepatuhan Demo Client-Side -->
      <div class="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-xs text-amber-900 flex items-start justify-between">
        <div class="flex items-start gap-2">
          <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"></i>
          <div>
            <strong class="font-bold">Mode Pengelolaan Konten (Client-Side Storage):</strong>
            <p class="mt-0.5 text-amber-800">
              Halaman ini berjalan di GitHub Pages tanpa backend server. Data disimpan di LocalStorage peramban Anda. Lakukan ekspor cadangan secara berkala agar tidak kehilangan draf penelaahan.
            </p>
          </div>
        </div>
        <span class="bg-amber-200/80 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Demo Admin</span>
      </div>

      <!-- Header & Aksi Utama -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Bank Soal & Kurasi</h1>
          <p class="text-xs text-slate-500 mt-1">Kelola, tinjau, validasi, serta impor-ekspor soal persiapan TKA SD & Ujian Sekolah.</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <button onclick="window.LMS.openAdminModal()" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-4 h-4"></i> Tambah Soal
          </button>
          <button onclick="window.LMS.openImportModal()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5">
            <i data-lucide="upload" class="w-4 h-4"></i> Impor JSON
          </button>
          <button onclick="window.LMS.openExportModal()" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5">
            <i data-lucide="download" class="w-4 h-4"></i> Ekspor JSON
          </button>
        </div>
      </div>

      <!-- Kartu Ringkasan Status -->
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-slate-500 text-[11px] block">Total Koleksi</span>
          <strong class="text-xl font-black text-slate-900 mt-1 block">${totalSoal}</strong>
        </div>
        <div class="bg-white p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span class="text-emerald-700 text-[11px] font-semibold block">Terverifikasi</span>
          <strong class="text-xl font-black text-emerald-700 mt-1 block">${verifiedCount}</strong>
          <span class="text-[10px] text-slate-400">Dapat diakses siswa</span>
        </div>
        <div class="bg-white p-3.5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <span class="text-amber-700 text-[11px] font-semibold block">Perlu Ditinjau</span>
          <strong class="text-xl font-black text-amber-700 mt-1 block">${reviewCount}</strong>
          <span class="text-[10px] text-slate-400">Antrean telaah</span>
        </div>
        <div class="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
          <span class="text-slate-600 text-[11px] font-semibold block">Draf</span>
          <strong class="text-xl font-black text-slate-700 mt-1 block">${draftCount}</strong>
          <span class="text-[10px] text-slate-400">Penyusunan awal</span>
        </div>
        <div class="bg-white p-3.5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm col-span-2 sm:col-span-1">
          <span class="text-rose-700 text-[11px] font-semibold block">Diarsipkan</span>
          <strong class="text-xl font-black text-rose-700 mt-1 block">${archivedCount}</strong>
          <span class="text-[10px] text-slate-400">Nonaktif latihan</span>
        </div>
      </div>

      <!-- Bilah Pencarian & Filter Reaktif -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Cari Kata Kunci / ID</label>
            <div class="relative">
              <input type="text" id="admin-filter-search" value="${escapeHtml(qKeyword)}" placeholder="Contoh: MAT-BIL atau pecahan..." class="w-full pl-8 pr-3 py-2 border rounded-xl bg-slate-50 focus:bg-white text-xs" oninput="window.LMS.applyAdminFilter()">
              <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"></i>
            </div>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
            <select id="admin-filter-subject" onchange="window.LMS.applyAdminFilter()" class="w-full px-3 py-2 border rounded-xl bg-white text-xs">
              <option value="all">Semua Mata Pelajaran</option>
              ${mapelList.map(m => `<option value="${m.id}" ${fSubject === m.id ? 'selected' : ''}>[${m.kelompok}] ${m.nama}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Status Verifikasi</label>
            <select id="admin-filter-status" onchange="window.LMS.applyAdminFilter()" class="w-full px-3 py-2 border rounded-xl bg-white text-xs">
              <option value="all">Semua Status</option>
              <option value="verified" ${fStatus === 'verified' ? 'selected' : ''}>Terverifikasi (verified)</option>
              <option value="needs_review" ${fStatus === 'needs_review' ? 'selected' : ''}>Perlu Ditinjau (needs_review)</option>
              <option value="draft" ${fStatus === 'draft' ? 'selected' : ''}>Draf (draft)</option>
              <option value="archived" ${fStatus === 'archived' ? 'selected' : ''}>Diarsipkan (archived)</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold text-slate-700 mb-1">Tingkat Kesulitan</label>
            <select id="admin-filter-diff" onchange="window.LMS.applyAdminFilter()" class="w-full px-3 py-2 border rounded-xl bg-white text-xs">
              <option value="all">Semua Kesulitan</option>
              <option value="Dasar" ${fDifficulty === 'Dasar' ? 'selected' : ''}>Dasar</option>
              <option value="Menengah" ${fDifficulty === 'Menengah' ? 'selected' : ''}>Menengah</option>
              <option value="Lanjut" ${fDifficulty === 'Lanjut' ? 'selected' : ''}>Lanjut</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tabel Daftar Soal -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span class="text-xs font-bold text-slate-700">Menampilkan ${filteredSoal.length} dari ${totalSoal} Butir Soal</span>
          ${(fSubject !== 'all' || fStatus !== 'all' || fDifficulty !== 'all' || qKeyword) ? `
            <button onclick="window.LMS.resetAdminFilter()" class="text-xs text-blue-600 hover:underline font-semibold">Reset Filter</button>
          ` : ''}
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-[11px]">
              <tr>
                <th class="p-3.5">ID Soal</th>
                <th class="p-3.5">Mata Pelajaran & Kompetensi</th>
                <th class="p-3.5">Tipe</th>
                <th class="p-3.5">Kesulitan</th>
                <th class="p-3.5">Kunci</th>
                <th class="p-3.5">Status</th>
                <th class="p-3.5 text-center">Tindakan Kurasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${filteredSoal.length === 0 ? `
                <tr>
                  <td colspan="7" class="p-8 text-center text-slate-400">
                    Tidak ditemukan butir soal yang sesuai dengan kriteria filter saat ini.
                  </td>
                </tr>
              ` : filteredSoal.map(item => {
                const mapelObj = mapelList.find(m => m.id === item.subjectId);
                const mapelName = mapelObj ? mapelObj.nama : item.subjectId;

                let statusBadge = "";
                if (item.verificationStatus === "verified") {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Terverifikasi</span>';
                } else if (item.verificationStatus === "needs_review") {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">Perlu Ditinjau</span>';
                } else if (item.verificationStatus === "archived") {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">Diarsipkan</span>';
                } else {
                  statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Draf</span>';
                }

                return `
                  <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="p-3.5 font-mono font-bold text-slate-900">${escapeHtml(item.id)}</td>
                    <td class="p-3.5">
                      <strong class="text-slate-800 block">${escapeHtml(mapelName)}</strong>
                      <span class="text-slate-500 text-[11px] block truncate max-w-xs" title="${escapeHtml(item.competencyId)}">${escapeHtml(item.competencyId)}</span>
                    </td>
                    <td class="p-3.5"><span class="bg-slate-100 px-2 py-0.5 rounded font-mono">${escapeHtml(item.questionType)}</span></td>
                    <td class="p-3.5">${escapeHtml(item.difficulty)}</td>
                    <td class="p-3.5 font-bold text-blue-600 font-mono">${escapeHtml(item.correctAnswer)}</td>
                    <td class="p-3.5">${statusBadge}</td>
                    <td class="p-3.5 text-center whitespace-nowrap space-x-1">
                      <button onclick="window.LMS.openReviewModal('${escapeHtml(item.id)}')" class="px-2 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold text-[11px]" title="Checklist Validasi">
                        Telaah
                      </button>
                      <button onclick="window.LMS.editSoal('${escapeHtml(item.id)}')" class="px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[11px]">
                        Edit
                      </button>
                      ${item.verificationStatus !== "verified" ? `
                        <button onclick="window.LMS.quickVerify('${escapeHtml(item.id)}')" class="px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px]">
                          Setujui
                        </button>
                      ` : ''}
                      ${item.verificationStatus !== "archived" ? `
                        <button onclick="window.LMS.quickArchive('${escapeHtml(item.id)}')" class="px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[11px]">
                          Arsip
                        </button>
                      ` : `
                        <button onclick="window.LMS.quickDraft('${escapeHtml(item.id)}')" class="px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-[11px]">
                          Buka Arsip
                        </button>
                      `}
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
