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

    <!-- Disclaimer -->
    <div class="max-w-4xl mx-auto px-4 mt-6">
      <div class="bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        <strong class="text-amber-700 dark:text-amber-400 block mb-1">⚠️ Disclaimer</strong>
        FreeDocTools is an independent utility website and is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any government agency, including SSC, UPSC, NTA, or Indian Railways. All official portal links provided are solely for the convenience of job applicants.
      </div>
    </div>

    <!-- Blog Article (Clean Background, No Cards) -->
    <div class="max-w-4xl mx-auto px-4 mt-12 mb-8">
      <div class="space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">Official Guide & Documentation</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">A Complete Guide to Government Exam Portals in India: SSC, UPSC, IBPS, NTA and Railways</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Every year, lakhs of students and job aspirants across India spend hours searching for the correct official website to apply for a government exam. With so many recruitment bodies, each with its own domain, login system, and application process, it is easy to land on the wrong page, miss a deadline, or worse, fall for a fake portal designed to steal personal information. This guide brings together the most important government exam and recruitment portals in one place, and explains exactly how each of them works, so that your preparation time goes into studying, not searching.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Why a Single Trusted List of Portals Matters</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Government job vacancies in India are spread across dozens of departments and commissions. A candidate preparing for a banking job, a railway job, and a civil services exam at the same time often has to juggle three or four different websites, each with a different design and a different set of rules. Bookmarking scattered links is unreliable, browser bookmarks get lost, and search engines sometimes show outdated or unofficial mirror sites ranking above the real one. Keeping a single, curated hub of verified official links — like the one on this page — removes that friction and reduces the risk of ending up on a fraudulent look-alike site.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Staff Selection Commission (SSC)</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The Staff Selection Commission is responsible for recruiting staff for various posts in ministries, departments, and subordinate offices of the Government of India. Its most popular examinations include the Combined Graduate Level (CGL) exam, the Combined Higher Secondary Level (CHSL) exam, Multi-Tasking Staff (MTS) recruitment, and the General Duty (GD) Constable exam for paramilitary forces. Each of these exams follows a multi-tier pattern, usually starting with a computer-based tier one exam, followed by a tier two exam, and in some cases a skill test, document verification, or physical test. The official SSC portal is where notifications, admit cards, answer keys, and results are published first, before appearing on any news or aggregator website.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Aspirants preparing for SSC exams should treat the official notification PDF as the single source of truth for eligibility, age limit, and application fee, since these details can change from one cycle to the next. It is common for candidates to rely on secondhand information from social media groups, which sometimes carry incorrect dates. Always cross-check important information directly on the portal before making a decision.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Union Public Service Commission (UPSC)</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The Union Public Service Commission conducts some of the most prestigious and competitive examinations in the country, including the Civil Services Examination for IAS, IPS, and allied services, the National Defence Academy (NDA) exam, the Combined Defence Services (CDS) exam, and various Engineering Services examinations. The Civil Services Examination itself is a three-stage process: a preliminary objective exam, a mains written exam consisting of several descriptive papers, and a personality test or interview. The entire cycle, from notification to final result, can take close to a year.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because the stakes are high and the process is long, candidates preparing for UPSC exams are strongly advised to rely only on the official portal for the exam calendar, syllabus, and any changes in the exam pattern. Coaching institutes and YouTube channels are useful for guidance, but the final authority on dates and rules always rests with the official notification.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Institute of Banking Personnel Selection (IBPS)</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">IBPS is the common recruitment body for public sector banks in India. It conducts exams for the post of Probationary Officer (PO), Clerk, Specialist Officer (SO), and also manages recruitment for Regional Rural Banks (RRBs) through a separate common recruitment process. Banking exams are known for their fast-paced, time-bound nature, generally combining sections such as Reasoning, Quantitative Aptitude, English Language, and General Awareness within a strict per-section timer.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because IBPS recruitment cycles overlap for multiple banks in the same year, candidates often confuse one notification with another. Bookmarking the official IBPS portal, and always verifying the specific notification number before applying, helps avoid applying under the wrong category or missing a specific bank's own separate cutoff.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">National Testing Agency (NTA)</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">The National Testing Agency conducts several major entrance examinations for higher education in India, including JEE Main for engineering admissions, NEET UG for medical admissions, and CUET for undergraduate admissions to central universities. NTA exams are almost entirely computer-based and are held in multiple sessions or shifts, sometimes across several cities in a single day. Because these exams determine college admissions rather than direct government jobs, the pressure and competition are extremely high, with lakhs of students competing for a limited number of seats.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For NTA exams, candidates should pay special attention to the exact photo and signature specifications mentioned in the information bulletin, since NTA forms are known for being strict about file size, dimensions, and background color of uploaded photographs. A mismatch here can lead to application rejection even if all academic details are correct.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Railway Recruitment Board (RRB)</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Indian Railways is one of the largest employers in the country, and recruitment is handled through a network of Railway Recruitment Boards across different zones. Popular railway exams include NTPC (Non-Technical Popular Categories), Group D recruitment, Assistant Loco Pilot (ALP), and Technician posts. Railway exams typically follow a multi-stage pattern involving a computer-based test, followed by stages such as a physical efficiency test, document verification, and medical examination depending on the post applied for.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Because railway recruitment is zone-based, candidates need to identify which RRB zone corresponds to the post they are applying for, since the same exam may have separate notifications and separate portals for different zones. The central RRB portal listed above is the right place to start, and it links out to the individual zonal websites where needed.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Using Aggregator Sites Like Sarkari Result</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Alongside official portals, many aspirants also follow aggregator websites such as Sarkari Result, which compile job notifications, admit card releases, and results from multiple government bodies into one feed. These sites are extremely useful for staying updated on new vacancies you might otherwise miss, but they should always be treated as a discovery tool rather than the final authority. Once you spot a relevant notification on an aggregator, always click through to the actual government portal to read the original notification and apply directly there.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Common Mistakes Candidates Make While Applying</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A large number of government form rejections happen not because of academic ineligibility, but because of small procedural errors. The most frequent issues include uploading a photograph or signature that exceeds the prescribed file size limit, using the wrong image format, entering a mismatched date of birth compared to the matriculation certificate, missing the last date for fee payment, and forgetting to take a printout of the final submitted form for future reference. Reading the official notification carefully, at least twice, before filling the form goes a long way in avoiding these errors.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Preparing Your Documents in Advance</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">One of the most underrated parts of exam preparation is document readiness. Most government application forms require a recent passport-size photograph and a scanned signature, both compressed to a specific file size, usually somewhere between 20KB and 200KB depending on the exam body. Keeping a compressed, correctly sized copy of your photo and signature ready in advance means you can apply the moment a new notification is released, instead of scrambling to resize images under deadline pressure. This is exactly the kind of preparation task that a free, private, browser-based compressor tool is built for — no file is uploaded to any server, and the resizing happens instantly on your own device.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Staying Updated Without Getting Overwhelmed</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">With new notifications being released almost every week across different departments, it is easy to feel overwhelmed trying to track everything. A practical approach is to shortlist two or three exam categories that genuinely match your eligibility and interest — for example, banking and SSC, or railways and defence — and set a fixed weekly routine to check only those official portals, rather than following every notification that appears on social media. This focused approach saves time and reduces exam-related anxiety.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Final Thoughts</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Government recruitment in India runs through a wide network of commissions and boards, each with its own portal, its own exam pattern, and its own deadlines. Having verified, official links for SSC, UPSC, IBPS, NTA, and RRB in one place, along with a general awareness of common application mistakes, helps candidates spend less time searching and more time preparing. Combine this with keeping your documents — especially photographs and signatures — ready in the correct format and size ahead of time, and you remove most of the last-minute stress that usually surrounds government exam applications.</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-home-btn').addEventListener('click', onBack);
  document.getElementById('go-to-compressor').addEventListener('click', onBack);
}
