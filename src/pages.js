import { navigate } from './router.js';

function pageShell(title, badge, bodyHtml) {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8 sm:py-14 w-full">
      <div class="space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          ${badge ? `<span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">${badge}</span>` : ''}
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">${title}</h1>
        </div>

        <div class="space-y-6 text-base leading-relaxed font-medium">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderAbout(container, onBack) {
  container.innerHTML = pageShell('About FreeDocTools - Professional Document Utility Suite', 'Our Mission & Story', `
    <p>Welcome to <strong>FreeDocTools</strong> (freedoctools.online), your premier destination for hyper-fast, highly secure, and 100% private browser-based web utilities. Our platform is meticulously engineered from the ground up to assist students, job aspirants, competitive exam candidates, and working professionals across India in efficiently managing their daily document preparation workflows without ever compromising personal data security or privacy.</p>
    
    <p>In today's digital era, submitting online applications for government recruitment examinations, university admissions, banking vacancies, and professional certifications requires strict adherence to digital formatting rules. Unlike conventional online services that require bulky software installations or risky cloud uploads, FreeDocTools operates entirely on the client-side. By leveraging advanced WebAssembly packages, HTML5 Canvas rendering engines, and native browser APIs, all document compression, image resizing, format conversion, background removal, and text extraction tasks occur instantly inside your device's sandboxed memory. Your files never leave your personal computer or smartphone.</p>

    <h2 class="text-2xl font-black text-slate-900 dark:text-white pt-4">Why We Created FreeDocTools</h2>
    <p>Every year, millions of students across the country face frustrating application form rejections simply because their uploaded passport-size photographs exceed strict KB limits (such as 20KB or 50KB), digital signatures get blurred due to improper resizing, or scanned marksheets exceed portal upload caps. Traditional desktop photo editors are often too complex for everyday users, while standard online tools expose private identification records to third-party cloud servers. We built FreeDocTools to bridge this gap completely — offering an ultra-fast, professional, pre-calibrated utility suite that makes form preparation simple, accurate, and completely private.</p>

    <h2 class="text-2xl font-black text-slate-900 dark:text-white pt-4">Our Core Commitment to Absolute Data Privacy</h2>
    <p>Data privacy is not merely an option at FreeDocTools; it is our foundational architecture. The moment you upload sensitive identification cards, PAN records, academic marksheets, or personal photographs to a traditional cloud website, your private files travel across the internet to sit on someone else's remote server. We eliminate this vulnerability entirely. Every single tool on our platform runs locally inside your browser memory. Nothing is uploaded, nothing is stored on external databases, and all temporary cache data is wiped clean the moment you close your browser tab.</p>
  `);
}

export function renderContact(container, onBack) {
  container.innerHTML = pageShell('Help & Support Center - Get in Touch', 'Customer Assistance', `
    <p>Have questions regarding specific tool functionalities, facing technical issues while compressing documents, or eager to suggest a brand-new productivity utility for our platform? Our dedicated support team is always here to assist you.</p>
    
    <p>You can reach out directly to our official communication channels for prompt assistance:</p>
    
    <div class="bg-rose-50/60 dark:bg-slate-800/60 p-6 rounded-3xl border border-rose-200/80 dark:border-slate-700 space-y-4">
      <div class="flex items-center gap-3">
        <span class="text-2xl">📧</span>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Email Support</p>
          <p class="text-base font-black text-slate-900 dark:text-white">radherockystar@gmail.com</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-2xl">💬</span>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Telegram Community Channel</p>
          <p class="text-base font-black text-slate-900 dark:text-white">@ROCKY_STAR474</p>
        </div>
      </div>
    </div>

    <p>We are fully committed to reviewing all user inquiries, bug reports, and tool enhancement requests, aiming to provide comprehensive responses within 24 to 48 business hours.</p>
  `);
}

export function renderPrivacy(container, onBack) {
  container.innerHTML = pageShell('Privacy Policy & Data Protection', 'Legal & Compliance', `
    <p><strong class="text-slate-900 dark:text-white">Effective Date: January 1, 2026</strong></p>
    
    <p>At <strong>FreeDocTools</strong>, accessible via <code>freedoctools.online</code>, safeguarding the privacy and confidentiality of our visitors is our paramount obligation. This comprehensive Privacy Policy document outlines the exact nature of information collected, processed, and maintained when you utilize our browser-based document utility suite.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">1. Zero Server-Side Storage Architecture</h2>
    <p>We strictly adhere to a zero server-side file retention policy. We do not upload, store, monitor, inspect, or archive any images, PDF documents, text strings, or scanned marksheets processed through our tools. All conversion, compression, resizing, background removal, and optical character recognition (OCR) operations execute locally within your device environment.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">2. Cookies, Analytics, and Google AdSense Advertising</h2>
    <p>FreeDocTools may utilize standard HTTP cookies to enhance user experience, save interface preferences (such as dark mode settings), and optimize website navigation performance. Additionally, third-party vendor partners, including Google, utilize cookies to serve advertisements based on a user's prior browsing history on this website and other participating internet domains. Google's utilization of advertising cookies enables it and its network publishing partners to serve targeted ads to our visitors based on their engagement metrics.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">3. Children's Information and General Compliance</h2>
    <p>Our platform does not knowingly collect any personally identifiable information from minors under the age of 13. FreeDocTools is intended for general professional use by students, job aspirants, and adults preparing official digital credentials.</p>
  `);
}

export function renderTerms(container, onBack) {
  container.innerHTML = pageShell('Terms and Conditions of Service', 'Legal Agreement', `
    <p>Welcome to <strong>FreeDocTools</strong> (` + '`freedoctools.online`' + `). By accessing, browsing, or utilizing any utility tool provided on this website, you explicitly agree to comply with and be bound by the following comprehensive terms and conditions of service.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">1. Provision of Free Browser Utilities</h2>
    <p>We provide 100% free, private browser-based studio utilities on an "as is" and "as available" basis without offering explicit or implicit warranties of any kind. While our compression and formatting algorithms are meticulously calibrated to meet standard portal requirements, users bear full operational responsibility for verifying that their final converted, resized, or compressed documents satisfy the exact criteria mandated by external governing authorities or recruitment boards.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">2. Acceptable Use Policy</h2>
    <p>All micro tools hosted on this platform are provided free of charge for legitimate personal, educational, and professional document preparation. You expressly agree not to utilize FreeDocTools for any unlawful activities, malicious file processing, or automated scraping that could compromise, disable, or impair website performance.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">3. Limitation of Liability</h2>
    <p>FreeDocTools, its developer, and associated publishing partners shall not be held legally or financially liable for any direct loss, application rejection, missed submission deadlines, or incidental damages arising from the use of, or inability to use, any tool on this website.</p>
  `);
}

export function renderSecurity(container, onBack) {
  container.innerHTML = pageShell('Platform Security & Trust Architecture', 'Data Safety Guarantee', `
    <p>Security on FreeDocTools is not an afterthought; it is woven directly into our fundamental engineering structure. Every single tool runs entirely inside your own web browser using local sandboxed memory, HTML5 Canvas rendering, and WebAssembly technologies. There is no file upload transmission step because there is no remote server waiting to receive your files on the backend.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">No File Ever Leaves Your Personal Device</h2>
    <p>Image compression, dimension scaling, format conversion, background removal, PDF merging, splitting, and optical character recognition (OCR) all occur locally within your browser tab. Your personal photographs, sensitive identification cards, financial marksheets, and confidential signatures are processed exclusively in your device's RAM and are never transmitted across the internet.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">Automatic Memory Cleanup</h2>
    <p>Because zero files are uploaded to external cloud storage, there are no cached documents left behind to secure or delete later. Temporary in-browser binary buffers utilized during active processing are purged automatically the moment you close or refresh your browser tab.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">Third-Party Services and Infrastructure</h2>
    <p>Our platform utilizes standard, highly secure third-party services exclusively for static content hosting, performance analytics, and advertising delivery (please refer to our <button data-inline-link="/privacy-policy" class="text-rose-600 dark:text-rose-400 font-bold hover:underline">Privacy Policy</button> for further details). These services possess zero access to the private files you process through our tools.</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">Reporting Security Vulnerabilities</h2>
    <p>If you believe you have identified a technical security flaw or vulnerability on our platform, please notify us immediately via the <button data-inline-link="/contact" class="text-rose-600 dark:text-rose-400 font-bold hover:underline">Contact Us</button> support page so our development team can investigate and resolve it promptly.</p>
  `);
  container.querySelectorAll('[data-inline-link]').forEach(el => {
    el.addEventListener('click', () => navigate(el.getAttribute('data-inline-link')));
  });
}

const TOOL_GUIDES = [
  {
    title: '🖼️ Background Remover & Studio',
    steps: [
      'Upload your photo via the dropzone in the Background Remover tab.',
      'Click the "Remove Background Now" button to automatically isolate the subject.',
      'Choose a solid color template (blue, green, red) or upload a custom background from your gallery, then download your final studio image.'
    ]
  },
  {
    title: '🏛️ Govt Exam Portals Hub',
    steps: [
      'Browse the official government exam and recruitment portals shown (SSC, UPSC, IBPS, NTA, RRB, Sarkari Result).',
      'Click "Visit Portal" on the organization you need — it opens securely in a new tab.',
      'Before filling any form, use the Photo/Signature Compressor to resize your documents to the exact KB size required.'
    ]
  },
  {
    title: '🗜️ Compress Image Size',
    steps: [
      'Upload your photo via the dropzone.',
      'Pick a target size using a preset (20KB–1MB) or the custom slider (10KB–2000KB).',
      'Click "Compress (Keep Sharp)" and download the result once ready.'
    ]
  },
  {
    title: '📐 Resize Dimensions',
    steps: [
      'Upload your photo.',
      'Choose a document preset (Passport, Signature, SSC/UPSC, Square, Full HD) or enter a custom width & height.',
      'Select "Exact Form Size" or "Super HD 2x", then click "Crop & Render Ultra HD" and download.'
    ]
  },
  {
    title: '🔄 Convert Image Format',
    steps: [
      'Upload an image.',
      'Choose the target format — JPG, WEBP, or PNG.',
      'Click "Convert Format Now" and download the converted file.'
    ]
  },
  {
    title: '📑 Compress PDF',
    steps: [
      'Upload your PDF file.',
      'Choose a compression level — Recommended (HD), Maximum Small, or Fast Stream Clean.',
      'Click "Compress PDF Now" and download the smaller file.'
    ]
  },
  {
    title: '📎 Merge PDFs',
    steps: [
      'Upload two or more PDF files (they list in the order added).',
      'Click "Merge PDFs".',
      'Download the single combined PDF.'
    ]
  },
  {
    title: '🖼️ Images to PDF',
    steps: [
      'Upload multiple photos — each becomes a page, in the order selected.',
      'Click "Create PDF Document".',
      'Download the generated multi-page PDF.'
    ]
  },
  {
    title: '✂️ Split PDF Pages',
    steps: [
      'Upload your PDF.',
      'Enter the page numbers you want, e.g. "1-3, 5".',
      'Click "Split PDF" and download the extracted pages as a new PDF.'
    ]
  },
  {
    title: '📝 Extract Text (OCR) — Lens Text Selector',
    steps: [
      'Upload a photo of text (notes, printed page, etc.).',
      'Click "Scan & Enable Touch Selection" to detect words.',
      'Touch/click individual words on the image to select or deselect them — selected words appear in the notebook panel.',
      'Copy the text or export it directly as a PDF.'
    ]
  },
  {
    title: '📝 Text Extractor (OCR)',
    steps: [
      'Upload a scanned image or photo of a document.',
      'Wait a few seconds while the text is automatically detected.',
      'Copy the extracted, editable text to your clipboard.'
    ]
  }
];

export function renderHowToUseAll(container, onBack) {
  const guidesHtml = TOOL_GUIDES.map(g => `
    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-rose-200/60 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
      <h3 class="font-black text-slate-900 dark:text-white text-base mb-3">${g.title}</h3>
      <ol class="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
        ${g.steps.map(s => `<li>${s}</li>`).join('')}
      </ol>
    </div>
  `).join('');

  container.innerHTML = pageShell('How to Use All Tools', 'User Manual', `
    <p>Every tool on FreeDocTools runs directly in your browser — nothing is uploaded to a server. Below is a quick step-by-step guide for each tool.</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      ${guidesHtml}
    </div>
  `);
}
