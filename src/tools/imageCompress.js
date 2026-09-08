import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImageCompress(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md dark:bg-blue-950/40">Smart Quality Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 dark:text-white">Compress Image (HD Sharpness)</h1>
          <p class="text-sm text-slate-500 mt-1 dark:text-slate-400">Shrinks MBs to exact KB (up to 2000 KB) without losing clarity.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">User Manual & SEO Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">How to Compress an Image to an Exact KB Size Without Losing Quality</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Almost every online form in India — from SSC and UPSC applications to bank account openings, passport applications, and college admissions — asks for a photograph within a very specific file size limit, usually somewhere between 20KB and 200KB. What looks like a simple requirement often becomes a frustrating exercise, because a photo taken on a modern smartphone camera is typically 3MB to 8MB in size, sometimes even larger. Simply reducing quality with random tools can leave your photo blurry, pixelated, or too dark. This article explains what actually happens when an image is compressed, and how to get a sharp, form-ready photo at the exact size an official portal demands.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Why Original Photos Are So Large</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Modern phone cameras capture images with very high resolution, often 12 megapixels or more, and store them with minimal compression to preserve as much visual detail as possible. This is great for printing or professional editing, but completely impractical for uploading to a government or banking form, most of which were designed years ago around much smaller file size limits. The gap between a 6MB smartphone photo and a 20KB form requirement is enormous, which is why naive resizing methods often destroy image quality.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">What Actually Determines File Size</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Three factors control how large or small an image file is: its pixel dimensions (width and height), its compression quality (how much detail is kept versus discarded), and the image format itself (JPEG generally compresses far better than PNG for photographs). A smart compression approach adjusts all three factors together, rather than blindly slashing quality, which is exactly why a size-targeted compressor can produce a visibly sharper result than manually saving an image at "60% quality" in a basic editor.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">The Problem With Basic Compression Tools</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Many free compression tools only offer a single quality slider, leaving the user to guess how low to go, and then check the resulting file size, adjust again, and repeat — sometimes five or six times before landing anywhere close to the required size. Other tools apply a fixed formula regardless of the target, which either over-compresses simple images (leaving unnecessary blur) or under-compresses complex ones (missing the target size entirely, so the form rejects the upload).</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">How a Smart Adaptive Compression Engine Works</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A well-designed compressor works the opposite way: instead of asking you to guess a quality percentage, you simply tell it the target size you need — say, 50KB — and it works backward from there. It starts by capping the image dimensions to a sensible resolution based on the target (a 20KB form photo does not need 4K resolution), then iteratively tests different quality levels, measuring the actual output size at each step. If the result is bigger than the target, quality is reduced slightly; if the result is comfortably under target with room to spare, quality is increased again to preserve more sharpness. This loop continues until the output lands as close as possible to the requested size, without dropping below it unnecessarily and losing more clarity than needed.</p>

          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">This approach explains why two images compressed to "50KB" by different tools can look completely different — one soft and muddy, the other crisp and clean. The difference comes down to how intelligently the resolution and quality trade-off is managed during that process, not just the final file size number.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Choosing the Right Target Size</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Different forms require different sizes, and getting this wrong is one of the most common reasons applications get stuck. SSC and many banking recruitment forms typically ask for a photograph between 20KB and 50KB, and a signature under 20KB. UPSC forms often specify slightly different limits for photo and signature separately. NTA exams like JEE Main and NEET usually specify both a minimum and a maximum size, meaning a file that is too small can be rejected just as easily as one that is too large. Always read the specific instructions on the official notification carefully, since applying a generic "50KB for everything" approach can lead to rejection on a portal that actually wants a minimum of 10KB.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Passport-Size Photo Requirements</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Beyond file size, most government forms also specify pixel dimensions for passport-style photographs, commonly something close to 200x230 pixels or similar ratios. A good compression tool should let the resolution scale down proportionally as part of the size-targeting process, so the final image is both the correct file size and a sensible resolution for a small ID-style photo, rather than an oddly stretched or distorted result.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">JPEG vs PNG: Which Format to Use</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">For photographs, JPEG is almost always the better choice for compression, because it is specifically designed to shrink continuous-tone images like faces and scenery with minimal visible quality loss. PNG, on the other hand, is a lossless format best suited for graphics with sharp edges, text, or transparency, and it does not shrink photographic images nearly as efficiently. If a form specifically asks for a JPG or JPEG file, make sure your final download is saved in that format rather than PNG, even if your original photo was captured or edited as a PNG.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Tips for a Better Starting Photo</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Compression quality also depends heavily on your original photo. A photo taken with good, even lighting and a plain background compresses more cleanly than a dark, noisy, or cluttered image, because compression algorithms have to work harder to preserve detail in busy or poorly lit areas. Before uploading, try to use a photo taken in daylight or bright indoor lighting, against a plain wall, facing the camera directly, as most exam and passport photo guidelines require.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Privacy While Compressing Sensitive Documents</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Photographs and signatures used for government forms are sensitive personal documents, and uploading them to a random online tool that processes files on a remote server carries real privacy risk — you have no way of knowing if that image is stored, logged, or misused afterward. A browser-based compressor that processes everything locally, without ever transmitting your file to a server, removes this risk entirely. Your photo stays on your own device from start to finish, which matters especially when the image includes your face and signature together.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">A Simple Workflow for Any Government Form</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Read the official notification carefully and note the exact required size range and dimensions for both photo and signature. Take or select a clear, well-lit photo against a plain background. Upload it to a size-targeted compressor and select the exact KB limit specified in the notification. Download the result and verify the file size shown matches what the form requires. Repeat the same process for your signature, since signatures usually have a much smaller size limit than photographs. Keep both compressed files saved in a clearly named folder so they are ready the moment you need to apply for any exam.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Final Thoughts</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Getting a photo down to an exact KB size without turning it into a blurry mess is less about luck and more about using the right approach — one that adjusts resolution and quality together instead of applying a single blunt setting. With a proper size-targeted, privacy-respecting compression tool and a bit of preparation on your original photo, meeting any government form's photo requirement becomes a five-second task instead of a repeated trial-and-error struggle.</p>
        </div>
      </article>
    </div>
  `;

  container.querySelector('#btn-back').addEventListener('click', onBack);

  const dropzoneArea = container.querySelector('#dropzone-area');
  const actionArea = container.querySelector('#action-area');

  const dropzone = createDropzone({
    accept: 'image/*',
    onFilesSelected: (file) => handleFile(file)
  });
  dropzoneArea.appendChild(dropzone);

  let currentFile = null;
  let imgObj = null;
  let compressedBlob = null;

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    imgObj = new Image();
    imgObj.src = previewUrl;
    await new Promise(r => imgObj.onload = r);

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm dark:border-slate-700" />
          <div class="overflow-hidden">
            <p class="font-semibold text-slate-800 text-sm truncate dark:text-slate-200">${file.name}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Original Size: <span class="font-bold text-slate-700 dark:text-slate-300">${formatBytes(file.size)}</span></p>
          </div>
        </div>
        <div id="result-stat" class="flex sm:justify-end items-center text-xs text-slate-600 font-medium dark:text-slate-300">
          Ready to compress
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Select Target Size (KB)</label>
        
        <!-- Preset Buttons -->
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          <button type="button" data-kb="20" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-slate-900 dark:border-slate-700">20 KB</button>
          <button type="button" data-kb="50" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-slate-900 dark:border-slate-700">50 KB</button>
          <button type="button" data-kb="100" class="preset-btn py-2 text-xs font-bold rounded-xl border border-blue-500 bg-blue-50 text-blue-600 font-bold transition-all dark:bg-blue-950/40">100 KB</button>
          <button type="button" data-kb="200" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-slate-900 dark:border-slate-700">200 KB</button>
          <button type="button" data-kb="500" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-slate-900 dark:border-slate-700">500 KB</button>
          <button type="button" data-kb="1000" class="preset-btn py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:border-blue-500 hover:text-blue-600 transition-all dark:bg-slate-900 dark:border-slate-700">1 MB</button>
        </div>

        <!-- Custom Slider (10 KB to 2000 KB) -->
        <div class="flex items-center gap-3">
          <input type="range" id="size-range" min="10" max="2000" step="10" value="100" class="w-full accent-blue-600" />
          <span id="range-val" class="text-sm font-bold text-blue-600 min-w-[75px] text-right">100 KB</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button id="btn-compress" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2">
          ⚡ Compress (Keep Sharp)
        </button>
      </div>

      <div id="preview-output" class="hidden"></div>
    `;

    const range = actionArea.querySelector('#size-range');
    const rangeVal = actionArea.querySelector('#range-val');
    const presetBtns = actionArea.querySelectorAll('.preset-btn');
    const btnCompress = actionArea.querySelector('#btn-compress');
    const resultStat = actionArea.querySelector('#result-stat');
    const previewOutput = actionArea.querySelector('#preview-output');

    range.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      rangeVal.textContent = val >= 1000 ? `${(val/1000).toFixed(1)} MB` : `${val} KB`;
      presetBtns.forEach(b => b.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600'));
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('border-blue-500', 'bg-blue-50', 'text-blue-600'));
        btn.classList.add('border-blue-500', 'bg-blue-50', 'text-blue-600');
        const kb = parseInt(btn.getAttribute('data-kb'), 10);
        range.value = kb;
        rangeVal.textContent = kb >= 1000 ? `${(kb/1000).toFixed(0)} MB` : `${kb} KB`;
      });
    });

    btnCompress.addEventListener('click', async () => {
      btnCompress.disabled = true;
      btnCompress.innerHTML = 'Optimizing with HD Engine...';

      const targetBytes = parseInt(range.value, 10) * 1024;
      compressedBlob = await smartCompress(imgObj, targetBytes);

      const compressedUrl = URL.createObjectURL(compressedBlob);

      resultStat.innerHTML = `
        <span class="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 dark:bg-emerald-950/30">
          Result: ${formatBytes(compressedBlob.size)}
        </span>
      `;

      previewOutput.classList.remove('hidden');
      previewOutput.innerHTML = `
        <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4 dark:bg-slate-800/60 dark:border-slate-800">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">HD Preview (Zero Blur)</p>
          <div class="flex justify-center bg-white p-2 rounded-xl border border-slate-200 max-h-72 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
            <img src="${compressedUrl}" class="max-h-64 object-contain rounded-lg" />
          </div>
          <button id="btn-download" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
            ⬇ Download Compressed Photo (${formatBytes(compressedBlob.size)})
          </button>
        </div>
      `;

      previewOutput.querySelector('#btn-download').addEventListener('click', () => {
        const nameParts = currentFile.name.split('.');
        nameParts.pop();
        downloadFile(compressedBlob, `${nameParts.join('.')}_hd_compressed.jpg`);
      });

      btnCompress.disabled = false;
      btnCompress.innerHTML = '⚡ Compress Again';
    });
  }
}

// Smart Adaptive High-Quality Compression Engine
async function smartCompress(img, targetBytes) {
  let scale = 1.0;
  let quality = 0.92;
  let bestBlob = null;

  const maxDim = Math.max(img.width, img.height);
  let capDim = 2560;
  if (targetBytes <= 100 * 1024) {
    capDim = 1280;
  } else if (targetBytes <= 500 * 1024) {
    capDim = 1920;
  }

  if (maxDim > capDim) {
    scale = capDim / maxDim;
  }

  for (let i = 0; i < 8; i++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', quality));
    bestBlob = blob;

    if (blob.size <= targetBytes) {
      if (blob.size >= targetBytes * 0.85 || quality >= 0.94) {
        return blob;
      }
      quality = Math.min(0.96, quality + 0.04);
    } else {
      if (quality > 0.72) {
        quality -= 0.07;
      } else {
        scale *= 0.84;
      }
    }
  }

  return bestBlob;
}
