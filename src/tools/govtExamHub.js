export function renderGovtExamHub(container, onBack) {
  container.innerHTML = `
    <div class="max-w-4xl mx-auto px-4 py-8 sm:py-12 animate-fade-in">
      <!-- Top Bar -->
      <div class="flex items-center justify-between mb-8 pb-4 border-b border-rose-200/60 dark:border-slate-800">
        <button id="back-home-btn" class="inline-flex items-center gap-2 text-xs font-extrabold px-4 py-2 bg-rose-50 dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-slate-800 rounded-xl hover:bg-rose-100 transition shadow-sm">
          ← Back to Tools
        </button>
        <div class="text-right">
          <span class="text-[11px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">Official Portal Hub</span>
        </div>
      </div>

      <!-- Header -->
      <div class="text-center max-w-xl mx-auto mb-10">
        <div class="w-16 h-16 bg-gradient-to-tr from-rose-600 to-pink-500 rounded-3xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-rose-600/30">
          🏛️
        </div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Govt Exam & Application Portals
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Direct official links to major government job portals. Opens securely in a new tab.
        </p>
      </div>

      <!-- Exam Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${[
          {
            title: 'Staff Selection Commission (SSC)',
            desc: 'Official portal for CGL, CHSL, MTS, GD Constable & other staff recruitments.',
            url: 'https://ssc.gov.in',
            badge: 'SSC EXAMS',
            icon: '📋'
          },
          {
            title: 'Union Public Service Commission (UPSC)',
            desc: 'Official portal for Civil Services (IAS/IPS), NDA, CDS, and Engineering Services.',
            url: 'https://upsc.gov.in',
            badge: 'UPSC / IAS',
            icon: '⚖️'
          },
          {
            title: 'Institute of Banking Personnel Selection (IBPS)',
            desc: 'Official portal for PO, Clerk, Specialist Officer & Regional Rural Bank exams.',
            url: 'https://ibps.in',
            badge: 'BANKING',
            icon: '🏦'
          },
          {
            title: 'National Testing Agency (NTA)',
            desc: 'Official portal for JEE Main, NEET UG, CUET, and national level entrance exams.',
            url: 'https://nta.ac.in',
            badge: 'NTA / ENTRANCE',
            icon: '🎓'
          },
          {
            title: 'Railway Recruitment Board (RRB)',
            desc: 'Official portal for NTPC, Group D, ALP, Technician, and railway jobs.',
            url: 'https://www.rrbcdg.gov.in',
            badge: 'RAILWAY',
            icon: '🚆'
          },
          {
            title: 'Sarkari Result (Job Alerts & Updates)',
            desc: 'Trusted aggregator for latest job notifications, admit cards, and results.',
            url: 'https://www.sarkariresult.com',
            badge: 'JOB ALERTS',
            icon: '🔔'
          }
        ].map(exam => `
          <div class="bg-white dark:bg-slate-900 border border-rose-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:border-rose-500 transition flex flex-col justify-between group">
            <div>
              <div class="flex items-center justify-between mb-3">
                <span class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center text-lg">${exam.icon}</span>
                <span class="text-[10px] font-black bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900">${exam.badge}</span>
              </div>
              <h3 class="font-black text-slate-900 dark:text-white text-base mb-1 group-hover:text-rose-600 transition">${exam.title}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">${exam.desc}</p>
            </div>
            <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span class="text-[11px] text-slate-400 font-semibold">⚡ Secure External Link</span>
              <a href="${exam.url}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-rose-600/20 inline-flex items-center gap-1.5">
                Visit Portal ↗
              </a>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Bottom Banner / Tip -->
      <div class="mt-8 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-rose-500/5 border border-rose-200 dark:border-rose-900/50 p-6 rounded-3xl text-center">
        <h4 class="font-black text-slate-900 dark:text-white text-sm mb-1">💡 Form Bharne Se Pehle Photo Prepare Karein!</h4>
        <p class="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-lg mx-auto mb-4">
          SSC, UPSC ya kisi bhi form ke liye 20KB/50KB photo aur signature compress karne ke liye hamare free tools ka use karein.
        </p>
        <button id="go-to-compressor" class="px-6 py-2.5 bg-rose-600 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition">
          🗜️ Open Photo Compressor Now
        </button>
      </div>
    </div>
  `;

  document.getElementById('back-home-btn').addEventListener('click', onBack);
  document.getElementById('go-to-compressor').addEventListener('click', onBack);
}
