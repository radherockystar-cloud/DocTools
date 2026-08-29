export function createComparisonSlider(beforeSrc, afterSrc) {
  const container = document.createElement('div');
  container.className = 'relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden select-none border-2 border-slate-700 bg-slate-900 shadow-xl touch-none';

  container.innerHTML = `
    <img src="${afterSrc}" class="absolute inset-0 w-full h-full object-contain pointer-events-none" />
    <span class="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-slate-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md z-10 shadow">
      ✨ 4K AI HDR
    </span>

    <div class="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10">
      <span class="text-xs font-black uppercase text-white/40 tracking-widest rotate-[-25deg]">DocTools 4K Preview</span>
    </div>

    <div id="slider-clipper" class="absolute inset-y-0 left-0 overflow-hidden bg-slate-900 pointer-events-none" style="width: 50%;">
      <img src="${beforeSrc}" class="absolute inset-0 w-full h-full object-contain pointer-events-none max-w-none" id="img-before" />
      <span class="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white font-bold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md z-10">
        Original Blur
      </span>
    </div>

    <div id="slider-handle" class="absolute top-0 bottom-0 cursor-ew-resize z-20 flex items-center justify-center" style="left: 50%; transform: translateX(-50%);">
      <div class="w-0.5 h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
      <div class="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg font-black text-xs border-2 border-slate-900">
        ↔
      </div>
    </div>
  `;

  const handle = container.querySelector('#slider-handle');
  const clipper = container.querySelector('#slider-clipper');
  const imgBefore = container.querySelector('#img-before');

  // Keep before image matched in width
  function updateImageWidth() {
    imgBefore.style.width = container.offsetWidth + 'px';
  }
  window.addEventListener('resize', updateImageWidth);
  setTimeout(updateImageWidth, 50);

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let pos = ((x - rect.left) / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    handle.style.left = `${pos}%`;
    clipper.style.width = `${pos}%`;
  }

  // Pointer & Touch Events
  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    updateImageWidth();
    setSliderPosition(e.clientX);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('pointerup', () => {
    isDragging = false;
  });

  return container;
}
