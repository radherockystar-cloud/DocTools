import { inject } from '@vercel/analytics';
inject();
import { renderGovtExamHub } from './tools/govtExamHub.js';
import { renderNavbar } from './components/Navbar.js';
import { renderFooter } from './components/Footer.js';
import { renderImageCompress } from './tools/imageCompress.js';
import { renderImageResize } from './tools/imageResize.js';
import { renderImageConvert } from './tools/imageConvert.js';
import { renderPdfCompress } from './tools/pdfCompress.js';
import { renderPdfMerge } from './tools/pdfMerge.js';
import { renderImagesToPdf } from './tools/imagesToPdf.js';
import { renderPdfSplitter } from './tools/pdfSplitter.js';
import { renderTextExtractor } from './tools/textExtractor.js';
import { renderAbout, renderContact, renderPrivacy, renderTerms, renderHowToUseAll } from './pages.js';
import { getCurrentPath, navigate } from './router.js';

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const customStyles = document.createElement('style');
customStyles.innerHTML = `
  html:not(.dark) body {
    background: radial-gradient(circle at 15% 15%, #ffe4e6 0%, transparent 45%),
                radial-gradient(circle at 85% 25%, #fce7f3 0%, transparent 45%),
                radial-gradient(circle at 50% 80%, #fff1f2 0%, transparent 50%),
                #fffafa !important;
    color: #0f172a !important;
  }
  html:not(.dark) .hero-main-title { color: #0f172a !important; }
  html:not(.dark) .hero-glow-text { filter: drop-shadow(0 0 18px rgba(244, 63, 94, 0.35)); }
  html:not(.dark) .tool-3d-card {
    background: #ffffff !important;
    border: 1.5px solid #ffe4e6 !important;
    box-shadow: 0 12px 28px -6px rgba(244, 63, 94, 0.09), 0 4px 8px rgba(0, 0, 0, 0.02), inset 0 1px 0 #ffffff !important;
  }
  html:not(.dark) .tool-3d-card:hover {
    border-color: #f43f5e !important;
    box-shadow: 0 22px 40px -10px rgba(244, 63, 94, 0.3), 0 0 0 1.5px #f43f5e !important;
    transform: translateY(-5px);
  }
  html:not(.dark) .card-title-text { color: #0f172a !important; text-shadow: 0 1px 2px rgba(0,0,0,0.04); }
  html:not(.dark) .tool-3d-card:hover .card-title-text { color: #e11d48 !important; text-shadow: 0 0 14px rgba(244, 63, 94, 0.45); }
  html:not(.dark) .card-desc-text { color: #475569 !important; }
  html:not(.dark) .tool-badge-pill {
    background: linear-gradient(135deg, #ffffff 0%, #fff1f2 100%) !important;
    border: 1.5px solid #fecdd3 !important;
    color: #e11d48 !important;
    box-shadow: 0 3px 10px rgba(244, 63, 94, 0.12) !important;
  }
  html:not(.dark) .trust-card-3d {
    background: #ffffff !important;
    border: 1.5px solid #ffe4e6 !important;
    box-shadow: 0 10px 25px -5px rgba(244, 63, 94, 0.07) !important;
  }

  html.dark body {
    background: radial-gradient(circle at 50% 0%, #1a1122 0%, #0b0f19 100%) !important;
    color: #f8fafc !important;
  }
  html.dark .hero-main-title { color: #ffffff !important; }
  html.dark .hero-glow-text { filter: drop-shadow(0 0 20px rgba(244, 63, 94, 0.55)); }
  html.dark .tool-3d-card {
    background: #161a29 !important;
    border: 1.5px solid #2d2438 !important;
    box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
  }
  html.dark .tool-3d-card:hover {
    border-color: #f43f5e !important;
    box-shadow: 0 22px 35px -10px rgba(244, 63, 94, 0.4), 0 0 0 1.5px #f43f5e !important;
    transform: translateY(-5px);
  }
  html.dark .card-title-text { color: #ffffff !important; }
  html.dark .tool-3d-card:hover .card-title-text { color: #fb7185 !important; text-shadow: 0 0 14px rgba(244, 63, 94, 0.6); }
  html.dark .card-desc-text { color: #94a3b8 !important; }
  html.dark .tool-badge-pill {
    background: rgba(225, 29, 72, 0.15) !important;
    border: 1.5px solid rgba(244, 63, 94, 0.4) !important;
    color: #fda4af !important;
  }
  html.dark .trust-card-3d {
    background: #161a29 !important;
    border: 1.5px solid #2d2438 !important;
  }
  .tool-3d-card { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
`;
document.head.appendChild(customStyles);

const app = document.getElementById('app');

const TOOLS = [
  { id: 'govt-exam-hub', title: 'Govt Exam Portals Hub', desc: 'Direct official links for SSC, UPSC, Banking, NTA & Railway exam applications.', badge: 'PORTALS', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(14, 165, 233, 0.55);', iconBg: 'background: linear-gradient(135deg, #0ea5e9, #2563eb);', icon: '🏛️', render: renderGovtExamHub },
  { id: 'image-compress', title: 'Compress Image Size', desc: 'Reduce photo size to 20KB, 50KB, 100KB for government and exam portals.', badge: 'POPULAR', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(225, 29, 72, 0.55);', iconBg: 'background: linear-gradient(135deg, #ff4b72, #e11d48);', icon: '🗜️', render: renderImageCompress },
  { id: 'image-resize', title: 'Resize Dimensions', desc: 'Set width & height in exact pixels for passport photos & signature crops.', badge: 'UTILITY', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(236, 72, 153, 0.55);', iconBg: 'background: linear-gradient(135deg, #f43f5e, #ec4899);', icon: '📐', render: renderImageResize },
  { id: 'image-convert', title: 'Convert Image Format', desc: 'Convert pictures between JPG, PNG, and WebP formats at zero quality loss.', badge: 'FAST', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(217, 70, 239, 0.55);', iconBg: 'background: linear-gradient(135deg, #db2777, #c026d3);', icon: '🔄', render: renderImageConvert },
  { id: 'pdf-compress', title: 'Compress PDF', desc: 'Safe & lossless PDF file size reduction directly inside your browser.', badge: 'PDF', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(239, 68, 68, 0.55);', iconBg: 'background: linear-gradient(135deg, #e11d48, #9f1239);', icon: '📑', render: renderPdfCompress },
  { id: 'pdf-merge', title: 'Merge PDFs', desc: 'Combine multiple PDF files and marksheets into a single file.', badge: 'PDF', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(244, 63, 94, 0.55);', iconBg: 'background: linear-gradient(135deg, #fb7185, #e11d48);', icon: '📎', render: renderPdfMerge },
  { id: 'images-to-pdf', title: 'Images to PDF', desc: 'Turn multiple gallery photos & scans into a clean single A4 PDF.', badge: 'CONVERT', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(236, 72, 153, 0.55);', iconBg: 'background: linear-gradient(135deg, #ec4899, #be185d);', icon: '🖼️', render: renderImagesToPdf },
  { id: 'pdf-splitter', title: 'Split PDF Pages', desc: 'Extract specific pages or separate single sheets from heavy PDFs.', badge: 'PDF', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(225, 29, 72, 0.55);', iconBg: 'background: linear-gradient(135deg, #f43f5e, #b91c1c);', icon: '✂️', render: renderPdfSplitter },
  { id: 'text-extractor', title: 'Extract Text (OCR)', desc: 'Extract editable text from scanned documents and notebook photos.', badge: 'SMART OCR', iconShadow: 'box-shadow: 0 12px 26px -4px rgba(244, 63, 94, 0.55);', iconBg: 'background: linear-gradient(135deg, #ff4b72, #e11d48);', icon: '📝', render: renderTextExtractor }
];

const STATIC_PAGES = {
  '/about': renderAbout,
  '/contact': renderContact,
  '/privacy-policy': renderPrivacy,
  '/terms': renderTerms,
  '/how-to-use': renderHowToUseAll
};

function renderRoute(path) {
  const container = document.getElementById('main-view');
  const footerEl = document.getElementById('app-footer');
  if (!container) return;
  container.innerHTML = '';
  
  const pageRenderer = STATIC_PAGES[path];
  if (pageRenderer) {
    if (footerEl) footerEl.style.display = 'none';
    pageRenderer(container, () => navigate('/'));
  } else {
    if (footerEl) footerEl.style.display = 'block';
    showHome();
  }
}

function initApp() {
  app.innerHTML = '';
  renderNavbar(app, () => navigate('/'));

  const mainContent = document.createElement('main');
  mainContent.id = 'main-view';
  mainContent.className = 'flex-grow min-h-[75vh]';
  app.appendChild(mainContent);

  const footerWrapper = document.createElement('div');
  footerWrapper.id = 'app-footer';
  renderFooter(footerWrapper);
  app.appendChild(footerWrapper);

  renderRoute(getCurrentPath());

  window.addEventListener('route-change', (e) => {
    renderRoute(e.detail.path);
  });
}

function showHome() {
  const container = document.getElementById('main-view');
  if (!container) return;
  container.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 py-8 sm:py-14">
      <div class="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2.5 bg-gradient-to-r from-white via-rose-50 to-pink-50 dark:from-slate-900 dark:to-rose-950/80 text-rose-600 dark:text-rose-300 text-xs font-black px-4 py-1.5 rounded-full mb-4 border border-rose-200/90 dark:border-rose-800 shadow-md shadow-rose-500/10 backdrop-blur-md">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-sm shadow-rose-500"></span>
          <span class="tracking-wide">100% Free & Private Browser Studio</span>
        </div>

        <h1 class="hero-main-title text-3xl sm:text-5xl font-black tracking-tight leading-tight">
          Superfast Image & PDF <br class="hidden sm:inline" />
          <span class="hero-glow-text bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 bg-clip-text text-transparent">Micro Tools</span>
        </h1>

        <p class="mt-3.5 text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-medium">
          Fast client-side utility suite to compress, resize, extract text, and convert documents for government exams and daily work.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="tools-grid"></div>

      <!-- Feature Trust Badges -->
      <div class="mt-16 sm:mt-20 border-t border-rose-200/60 dark:border-slate-800 pt-12 grid grid-cols-1 md:grid-cols-3 gap-5 text-center">
        <div class="trust-card-3d p-6 rounded-3xl">
          <div class="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-slate-800 text-rose-600 dark:text-rose-400 flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-sm">🔒</div>
          <h3 class="font-black text-slate-900 dark:text-white text-base">100% Client-Side Private</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">Your photos and documents never leave your device. All operations happen in local browser memory.</p>
        </div>

        <div class="trust-card-3d p-6 rounded-3xl">
          <div class="w-12 h-12 rounded-2xl bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-400 flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-sm">⚡</div>
          <h3 class="font-black text-slate-900 dark:text-white text-base">Instant Processing</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">Ultra-fast performance powered by WebAssembly, HTML5 Canvas, and native Web APIs.</p>
        </div>

        <div class="trust-card-3d p-6 rounded-3xl">
          <div class="w-12 h-12 rounded-2xl bg-red-50 dark:bg-slate-800 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-sm">📱</div>
          <h3 class="font-black text-slate-900 dark:text-white text-base">Govt Exam Ready</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">Pre-calibrated 20KB, 50KB, and 100KB presets for SSC, UPSC, State forms & Job applications.</p>
        </div>
      </div>

      <!-- Professional AdSense-Friendly SEO Article Section (Clean Background, No Cards) -->
      <div class="mt-20 pt-16 border-t border-rose-200/60 dark:border-slate-800 max-w-4xl mx-auto space-y-8 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">Official Guide & Documentation</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Complete Guide to Online Document Management & Form Preparation</h2>
        </div>

        <div class="space-y-6 text-base leading-relaxed font-medium">
          <p>Welcome to <strong>FreeDocTools</strong>, your ultimate browser-based document utility suite designed specifically for students, job aspirants, and professionals across India. Navigating government recruitment portals, bank exam applications, and university admissions often requires uploading photographs, signatures, and certificates in strict digital formats. Understanding how file compression, pixel dimension scaling, and secure format conversion work can save you from application rejections.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-2">Why Proper Image Compression Matters for Govt Exams</h3>
          <p>Most official application systems—such as SSC CGL, UPSC Civil Services, IBPS Banking, and Railway recruitment boards—impose strict file size limits, typically ranging between 20KB to 50KB for passport photos and 10KB to 20KB for signatures. Smartphones today capture high-resolution photographs weighing several megabytes (3MB to 8MB). Simply shrinking dimensions randomly can blur vital facial features or text. Our client-side compression algorithm intelligently reduces file weight while preserving high edge sharpness so your documents pass automated scrutiny without hassle.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-2">The Security Advantage of Client-Side Processing</h3>
          <p>Traditional online tools upload your personal identification cards, marksheets, and tax forms to remote cloud servers, posing significant privacy risks. FreeDocTools eliminates this risk entirely. Powered by modern HTML5 Canvas, WebAssembly, and secure web APIs, every task—whether it is merging multi-page PDFs, splitting documents, or running optical character recognition (OCR)—executes directly inside your browser's sandboxed local memory. Your private documents never touch an external server.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-2">Streamlining Your Daily Workflow</h3>
          <p>Whether you need to convert high-res PNG scans into lightweight WebP formats, merge scattered PDF marksheets into a single file for college applications, or extract editable text from scanned textbook pages using our smart OCR lens, FreeDocTools provides instant, friction-free performance across all mobile and desktop devices.</p>
        </div>
      </div>

    </div>
  `;

  const grid = container.querySelector('#tools-grid');
  if (!grid) return;

  TOOLS.TOOLS = TOOLS || [];
  TOOLS.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-3d-card rounded-3xl p-6 flex flex-col justify-between cursor-pointer group';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-5">
          <div style="${tool.iconBg} ${tool.iconShadow}" class="w-14 h-14 rounded-2xl text-white flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ${tool.icon}
          </div>
          <span class="tool-badge-pill text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
            ${tool.badge}
          </span>
        </div>
        <h2 class="card-title-text text-lg font-black tracking-tight mb-1.5">${tool.title}</h2>
        <p class="card-desc-text text-xs leading-relaxed font-medium">${tool.desc}</p>
      </div>
      <div class="mt-6 pt-4 border-t border-rose-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
        <span class="font-extrabold tracking-wide">Use Tool</span>
        <span class="text-base group-hover:translate-x-1 transition-transform">→</span>
      </div>
    `;

    card.addEventListener('click', () => {
      container.innerHTML = '';
      navigate('/tool-' + tool.id);
      tool.render(container, () => navigate('/'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    grid.appendChild(card);
  });
}

initApp();
