import { createDropzone } from '../components/Dropzone.js';
import { formatBytes, readFileAsDataURL } from '../utils/fileHelpers.js';
import { downloadFile } from '../utils/download.js';

export function renderImageResize(container, onBack) {
  container.innerHTML = `
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      <button id="btn-back" class="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors dark:text-slate-400">
        ← Back to All Tools
      </button>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md dark:bg-indigo-950/40">Crisp Edge Engine</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 dark:text-white">Crop & Resize Dimensions</h1>
          <p class="text-sm text-slate-500 mt-1 dark:text-slate-400">Multi-step downscaling + Micro-sharpening for crystal clear Passport & Signature.</p>
        </div>

        <div id="dropzone-area"></div>
        <div id="action-area" class="hidden mt-6 space-y-6"></div>
      </div>

      <!-- Blog Article (Clean Background, No Cards) -->
      <article class="mt-12 mb-8 space-y-6 text-slate-700 dark:text-slate-300">
        <div>
          <span class="text-xs font-extrabold uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-100/60 dark:bg-rose-950/60 px-3 py-1 rounded-md inline-block mb-3">User Manual & Dimensions Guide</span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Why Resizing a Photo the Wrong Way Ruins Its Sharpness (and How to Fix It)</h2>
        </div>

        <div class="space-y-5 text-base leading-relaxed font-medium">
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">If you have ever resized a photo down to a small passport-size dimension and watched it come out looking soft, fuzzy, or oddly stretched, you are not alone. Resizing an image sounds like a trivial task, but doing it correctly — especially for strict government form requirements — involves a lot more than just dragging a photo smaller. This article breaks down why naive resizing destroys quality, and what a proper crop-and-resize workflow actually looks like.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">The Difference Between Resizing and Cropping</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Resizing changes the overall dimensions of an image while keeping its full content, often distorting the aspect ratio if width and height aren't scaled proportionally. Cropping, on the other hand, cuts away part of the image to match a required aspect ratio without stretching anything. For passport-style photos — say, 350×450 pixels for a 7:9 ratio — the correct approach is to crop the photo to the right ratio first, centering on the face, and only then resize it down to the exact target pixel dimensions. Skipping the crop step and just squashing a wide photo into a tall frame is exactly what causes people's faces to look stretched or squeezed in ID photos.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Why "One-Step" Downscaling Looks Blurry</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When a large image, say 4000×3000 pixels, is resized directly down to something tiny like 200×230 pixels in a single step, the browser has to throw away an enormous amount of pixel information all at once. Most basic image editors do this in one jump, and the result is a soft, slightly blurry image because the downscaling algorithm cannot average pixel data cleanly across such a large jump. A much better approach is multi-step scaling — halving the image dimensions repeatedly (4000→2000→1000→500→250) until it's close to the target size, and only doing the final precise resize in the last step. Each halving step lets the image smoothly average out detail rather than losing it abruptly, which is why professionally built resize tools produce noticeably crisper results than a single drag-and-drop resize in a basic editor.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">The Role of Sharpening Filters</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Even with careful multi-step scaling, some softness is unavoidable when shrinking any image significantly. A subtle sharpening filter, applied after resizing, restores a bit of that lost edge definition by slightly boosting the contrast between a pixel and its neighbors. This has to be done carefully and in moderation — too much sharpening introduces visible noise or "halo" artifacts around edges, while too little leaves the photo looking flat. A well-tuned sharpening pass (roughly 15-20% intensity) strikes the right balance, giving passport and signature photos a crisp, professional look without looking artificially processed.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Why Face Positioning Matters in ID Photos</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Government ID photo guidelines almost always expect the face to be centered with some headroom above and a bit more space below the chin for the shoulders. A generic center-crop often cuts off too much forehead or leaves too much empty space below the chin, especially for portrait-style photos taken close up. Smarter cropping tools bias the crop slightly upward or downward depending on the target aspect ratio, keeping the face better framed within the final dimensions rather than mechanically slicing the exact geometric center of the original photo.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Common Government Photo Dimension Requirements</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Different forms specify different exact pixel dimensions, and getting these right matters as much as the file size. Passport-style photographs are commonly requested around 350×450 pixels. Signatures are usually a wide, short rectangle, often close to 300×120 pixels. Many SSC and UPSC forms specifically ask for photographs around 200×230 pixels. Always check the specific notification for the exact numbers, since even a small mismatch in dimensions — not just file size — can cause an online form to reject the upload.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Understanding "Exact Size" vs "2x Clarity" Modes</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">When a resize tool offers a choice between an exact target size and a higher-resolution "2x" option, it is giving you a trade-off between strict compliance and visual clarity. If you are uploading directly to a form that specifies an exact pixel dimension, use the exact size mode, since uploading a larger image may be auto-rejected or auto-incorrectly cropped by the portal. If you're saving a personal copy of a sharp ID photo for printing or future use, a 2x higher-resolution version preserves more detail and looks noticeably better when viewed on a larger screen or printed physically.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Aspect Ratio Mistakes to Avoid</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">A frequent mistake is manually typing in width and height values that don't match any real aspect ratio requirement, which forces the crop or resize step to either stretch the image or crop far more than intended. Whenever a form specifies both an exact width and height, treat those two numbers as a fixed ratio rather than independent values — resizing 400×500 to 200×300, for instance, changes the aspect ratio and will visibly distort the photo. Using preset buttons for common document types avoids this problem entirely, since the ratio is already correct for that specific use case.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Getting the Best Source Photo Before You Resize</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">No amount of clever resizing can fully recover detail from a low-resolution or heavily compressed starting photo. Start with the highest-resolution version of your photo available — ideally the original camera or phone capture, not a photo that has already been resized, screenshotted, or downloaded from WhatsApp, since messaging apps often re-compress images heavily. The better your starting resolution, the more room the multi-step scaling and sharpening process has to work with, and the sharper your final small-size photo will look.</p>

          <h3 class="text-xl font-black text-slate-900 dark:text-white pt-3">Final Thoughts</h3>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">Getting a passport, signature, or ID photo to look sharp at a tiny pixel size is a matter of process, not luck. Cropping to the correct aspect ratio before resizing, scaling down gradually in steps rather than all at once, and applying a light, carefully tuned sharpening pass together produce a noticeably cleaner result than any single-step resize. Combine this with starting from the best original photo you have, and matching the exact pixel dimensions your specific form requires, and you'll get a crisp, form-ready photo on the first try instead of repeated re-uploads.</p>
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

  async function handleFile(file) {
    currentFile = file;
    const previewUrl = await readFileAsDataURL(file);

    imgObj = new Image();
    imgObj.src = previewUrl;
    await new Promise(r => imgObj.onload = r);

    actionArea.classList.remove('hidden');
    actionArea.innerHTML = `
      <div class="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 dark:bg-slate-800/60 dark:border-slate-800">
        <img src="${previewUrl}" class="w-16 h-16 object-cover rounded-xl border border-slate-300 shadow-sm dark:border-slate-700" />
        <div class="overflow-hidden">
          <p class="font-semibold text-slate-800 text-sm truncate dark:text-slate-200">${file.name}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">Original Dimensions: <span class="font-bold text-indigo-700">${imgObj.naturalWidth} × ${imgObj.naturalHeight} px</span></p>
        </div>
      </div>

      <!-- Document Presets -->
      <div>
        <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Select Document / Form Preset</label>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <button type="button" data-w="350" data-h="450" class="preset-card text-left p-3 rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 hover:border-indigo-600 transition-all cursor-pointer">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🛂 Passport Photo</span>
            <span class="block text-[11px] text-indigo-600 font-semibold mt-0.5">350 × 450 px (7:9)</span>
          </button>

          <button type="button" data-w="300" data-h="120" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">✍️ Signature</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">300 × 120 px (5:2)</span>
          </button>

          <button type="button" data-w="200" data-h="230" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🏛️ SSC / UPSC</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">200 × 230 px</span>
          </button>

          <button type="button" data-w="1080" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🔲 Square (1:1)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">1080 × 1080 px</span>
          </button>

          <button type="button" data-w="1920" data-h="1080" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">🖥️ Full HD (16:9)</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">1920 × 1080 px</span>
          </button>

          <button type="button" data-w="custom" class="preset-card text-left p-3 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 transition-all cursor-pointer dark:bg-slate-900 dark:border-slate-800">
            <span class="block text-xs font-bold text-slate-900 dark:text-white">✏️ Custom Size</span>
            <span class="block text-[11px] text-slate-500 font-semibold mt-0.5 dark:text-slate-400">Enter custom px</span>
          </button>
        </div>
      </div>

      <!-- Dimensions and Framing -->
      <div class="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 dark:bg-slate-800/60 dark:border-slate-800">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 dark:text-slate-300">Target Width (px)</label>
            <input type="number" id="input-w" value="350" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1 dark:text-slate-300">Target Height (px)</label>
            <input type="number" id="input-h" value="450" class="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200" />
          </div>
        </div>

        <!-- Clarity Mode / Multiplier -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase mb-2 dark:text-slate-300">Clarity & Resolution Mode</label>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-indigo-600 rounded-xl cursor-pointer clarity-opt dark:bg-slate-900">
              <input type="radio" name="clarityMode" value="1" checked class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block dark:text-slate-200">Exact Form Size (1x)</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400">Matches official form requirements</span>
              </div>
            </label>
            <label class="flex items-center gap-2 p-3 bg-white border-2 border-slate-200 rounded-xl cursor-pointer clarity-opt hover:border-indigo-400 dark:bg-slate-900 dark:border-slate-800">
              <input type="radio" name="clarityMode" value="2" class="accent-indigo-600" />
              <div>
                <span class="font-bold text-slate-800 block dark:text-slate-200">Super HD 2x Clarity</span>
                <span class="text-[10px] text-indigo-600 font-semibold">2x High-DPI for sharp viewing</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <button id="btn-crop-resize" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all text-sm flex items-center justify-center gap-2">
        ⚡ Crop & Render Ultra HD
      </button>

      <div id="crop-preview-output" class="hidden"></div>
    `;

    const inputW = actionArea.querySelector('#input-w');
    const inputH = actionArea.querySelector('#input-h');
    const presetCards = actionArea.querySelectorAll('.preset-card');
    const clarityOpts = actionArea.querySelectorAll('.clarity-opt');
    const btnCropResize = actionArea.querySelector('#btn-crop-resize');
    const cropPreviewOutput = actionArea.querySelector('#crop-preview-output');

    clarityOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        clarityOpts.forEach(o => {
          o.classList.remove('border-indigo-600');
          o.classList.add('border-slate-200');
        });
        opt.classList.add('border-indigo-600');
        opt.classList.remove('border-slate-200');
      });
    });

    presetCards.forEach(card => {
      card.addEventListener('click', () => {
        presetCards.forEach(c => {
          c.classList.remove('border-indigo-600', 'bg-indigo-50/50');
          c.classList.add('border-slate-200', 'bg-white');
          const sub = c.querySelector('span:last-child');
          if (sub) {
            sub.classList.remove('text-indigo-600');
            sub.classList.add('text-slate-500');
          }
        });

        card.classList.add('border-indigo-600', 'bg-indigo-50/50');
        card.classList.remove('border-slate-200', 'bg-white');
        const activeSub = card.querySelector('span:last-child');
        if (activeSub) {
          activeSub.classList.add('text-indigo-600');
          activeSub.classList.remove('text-slate-500');
        }

        const w = card.getAttribute('data-w');
        const h = card.getAttribute('data-h');
        if (w !== 'custom') {
          inputW.value = w;
          inputH.value = h;
        }
      });
    });

    btnCropResize.addEventListener('click', async () => {
      const baseW = parseInt(inputW.value, 10);
      const baseH = parseInt(inputH.value, 10);
      const multiplier = parseInt(actionArea.querySelector('input[name="clarityMode"]:checked').value, 10);

      if (!baseW || !baseH || baseW <= 0 || baseH <= 0) {
        alert('Please enter valid width and height in pixels.');
        return;
      }

      const targetW = baseW * multiplier;
      const targetH = baseH * multiplier;

      btnCropResize.disabled = true;
      btnCropResize.innerHTML = 'Rendering Ultra Sharp HD...';

      const srcW = imgObj.naturalWidth;
      const srcH = imgObj.naturalHeight;
      const srcRatio = srcW / srcH;
      const targetRatio = targetW / targetH;

      let cropW, cropH, cropX, cropY;

      if (srcRatio > targetRatio) {
        cropH = srcH;
        cropW = srcH * targetRatio;
        cropX = (srcW - cropW) / 2;
        cropY = 0;
      } else {
        cropW = srcW;
        cropH = srcW / targetRatio;
        cropX = 0;
        cropY = (srcH - cropH) * 0.22;
      }

      const finalCanvas = multiStepScale(imgObj, cropX, cropY, cropW, cropH, targetW, targetH);
      applySharpen(finalCanvas);

      finalCanvas.toBlob((blob) => {
        const resizedUrl = URL.createObjectURL(blob);

        cropPreviewOutput.classList.remove('hidden');
        cropPreviewOutput.innerHTML = `
          <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-4 dark:bg-slate-800/60 dark:border-slate-800">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Ultra-Sharp HD Result</p>
              <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 dark:bg-indigo-950/40">
                ${targetW} × ${targetH} px (${formatBytes(blob.size)})
              </span>
            </div>
            <div class="flex justify-center bg-white p-3 rounded-xl border border-slate-200 max-h-80 overflow-hidden dark:bg-slate-900 dark:border-slate-800">
              <img src="${resizedUrl}" class="max-h-72 object-contain rounded-lg shadow-sm" />
            </div>
            <button id="btn-download-crop" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all text-sm flex items-center justify-center gap-2">
              ⬇ Download Sharp Photo (${targetW}×${targetH}px)
            </button>
          </div>
        `;

        cropPreviewOutput.querySelector('#btn-download-crop').addEventListener('click', () => {
          const nameParts = currentFile.name.split('.');
          nameParts.pop();
          downloadFile(blob, `${nameParts.join('.')}_${targetW}x${targetH}_sharp.jpg`);
        });

        btnCropResize.disabled = false;
        btnCropResize.innerHTML = '⚡ Crop & Render Ultra HD';
      }, 'image/jpeg', 0.98);
    });
  }
}

function multiStepScale(img, sx, sy, sw, sh, dw, dh) {
  let curW = sw;
  let curH = sh;
  let curCanvas = document.createElement('canvas');
  curCanvas.width = curW;
  curCanvas.height = curH;
  let curCtx = curCanvas.getContext('2d');
  curCtx.drawImage(img, sx, sy, sw, sh, 0, 0, curW, curH);

  while (curW / 2 > dw && curH / 2 > dh) {
    curW = Math.round(curW / 2);
    curH = Math.round(curH / 2);
    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = curW;
    nextCanvas.height = curH;
    const nextCtx = nextCanvas.getContext('2d');
    nextCtx.imageSmoothingEnabled = true;
    nextCtx.imageSmoothingQuality = 'high';
    nextCtx.drawImage(curCanvas, 0, 0, curW, curH);
    curCanvas = nextCanvas;
    curCtx = nextCtx;
  }

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = dw;
  finalCanvas.height = dh;
  const finalCtx = finalCanvas.getContext('2d');
  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.fillStyle = '#FFFFFF';
  finalCtx.fillRect(0, 0, dw, dh);
  finalCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, dw, dh);

  return finalCanvas;
}

function applySharpen(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);
  const mix = 0.20;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const top = copy[((y - 1) * w + x) * 4 + c];
        const bottom = copy[((y + 1) * w + x) * 4 + c];
        const left = copy[(y * w + (x - 1)) * 4 + c];
        const right = copy[(y * w + (x + 1)) * 4 + c];
        const center = copy[idx + c];

        const sharpVal = center * 3 - (top + bottom + left + right) * 0.5;
        data[idx + c] = Math.round(center * (1 - mix) + sharpVal * mix);
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}
