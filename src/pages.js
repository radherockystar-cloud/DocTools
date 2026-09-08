import { navigate } from './router.js';

function pageShell(title, badge, bodyHtml) {
  return `
    <div class="max-w-4xl mx-auto px-4 py-8 sm:py-14 w-full">
      <div class="space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          ${badge ? `<span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">${badge}</span>` : ''}
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">${title}</h1>
        </div>
        
        <div class="space-y-5 text-base leading-relaxed font-medium">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

export function renderAbout(container, onBack) {
  container.innerHTML = pageShell('About FreeDocTools', 'Our Story', `
    <p>Welcome to FreeDocTools, your premier destination for hyper-fast, secure, and fully private web utilities. Our platform is engineered specifically to help students, job aspirants, and professionals manage their daily document workflows without compromising data privacy[span_0](start_span)[span_0](end_span).</p>
    <p>Unlike traditional web services that process files on remote clouds, FreeDocTools operates 100% on the client side. By leveraging advanced WebAssembly and native HTML5 web APIs, all file compression, image resizing, and text extraction tasks occur directly inside your browser's local memory. Your files never leave your device[span_1](start_span)[span_1](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-4">Why We Built This</h2>
    <p>Government exam forms, job applications, and admissions portals almost always demand documents in a very specific format — a certain file type, a strict KB size, an exact pixel dimension. A photo captured on a modern smartphone rarely meets any of these requirements straight out of the camera. Converting scattered photos into a clean, structured, correctly sized document removes that friction entirely, and a properly formatted PDF or image stays readable and consistent whether it's opened on a phone, a laptop, or an office printer[span_2](start_span)[span_2](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-4">Your Privacy Comes First</h2>
    <p>Most online document tools are built on cloud servers — the moment you click "Upload," your ID cards, tax documents, and personal photos travel across the internet to sit on someone else's server, with no real way for you to know how long they're kept or who might access them[span_3](start_span)[span_3](end_span).</p>
    <p>FreeDocTools takes a different approach. Every tool on this site runs entirely inside your own browser, using local, sandboxed memory. Compression, resizing, merging, and text recognition all happen on your device — nothing is uploaded, nothing is stored on our servers, and everything is cleared automatically the moment you close the tab[span_4](start_span)[span_4](end_span).</p>
  `);
}

export function renderContact(container, onBack) {
  container.innerHTML = pageShell('Help & Support Center', 'Get in Touch', `
    <p>Have questions, facing technical issues, or want to suggest a new utility tool? We are here to help you. Reach out to our official support channels directly[span_5](start_span)[span_5](end_span):</p>
    <ul class="list-disc list-inside space-y-3 font-semibold text-slate-800 dark:text-slate-200">
      <li><strong class="text-rose-600">Email Support:</strong> radherockystar@gmail.com[span_6](start_span)[span_6](end_span)</li>
      <li><strong class="text-rose-600">Telegram Community:</strong> @ROCKY_STAR474[span_7](start_span)[span_7](end_span)</li>
    </ul>
    <p>We aim to respond to all user queries and tool suggestions within 24 to 48 hours[span_8](start_span)[span_8](end_span).</p>
  `);
}

export function renderPrivacy(container, onBack) {
  container.innerHTML = pageShell('Privacy Policy', 'Legal & Security', `
    <p><strong class="text-slate-900 dark:text-white">Effective Date: January 1, 2026</strong>[span_9](start_span)[span_9](end_span)</p>
    <p>At FreeDocTools, accessible from freedoctools.online, safeguarding your personal data is our primary commitment. We strictly adhere to a zero server-side storage architecture[span_10](start_span)[span_10](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">1. Data Processing and Security</h2>
    <p>We do not upload, store, monitor, or view any files, PDFs, or images processed through our utility suite. All conversion, resizing, and optical character recognition (OCR) operations run locally within your device environment[span_11](start_span)[span_11](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">2. Cookies and Advertising</h2>
    <p>FreeDocTools may use cookies to optimize user experience. Additionally, third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to this site and/or other sites on the Internet[span_12](start_span)[span_12](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">3. Children's Privacy</h2>
    <p>FreeDocTools does not knowingly collect any personal information from children. Our tools are intended for general use by students, job aspirants, and professionals preparing documents for forms and applications[span_13](start_span)[span_13](end_span).</p>
  `);
}

export function renderTerms(container, onBack) {
  container.innerHTML = pageShell('Terms and Conditions', 'Legal Services', `
    <p>By accessing freedoctools.online, you agree to be bound by these terms. We provide 100% free, private browser studio utilities on an "as is" and "as available" basis without warranties of any kind[span_14](start_span)[span_14](end_span).</p>
    <p>Users bear full operational responsibility for verifying that converted, resized, or compressed documents meet the specific criteria of external systems or government exam portals[span_15](start_span)[span_15](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">Use of Tools</h2>
    <p>All tools on this site are provided free of charge for personal and professional use. You agree not to use FreeDocTools for any unlawful purpose or in any way that could damage, disable, or impair the site[span_16](start_span)[span_16](end_span).</p>

    <h2 class="text-xl font-black text-slate-900 dark:text-white pt-3">Limitation of Liability</h2>
    <p>FreeDocTools and its developer shall not be held liable for any loss, rejection of an application, or damage arising from the use of, or inability to use, any tool on this website[span_17](start_span)[span_17](end_span).</p>
  `);
}

const TOOL_GUIDES = [
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
    <p>Every tool on FreeDocTools runs directly in your browser — nothing is uploaded to a server. Below is a quick step-by-step guide for each tool[span_18](start_span)[span_18](end_span).</p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      ${guidesHtml}
    </div>
  `);
}
