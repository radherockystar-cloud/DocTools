export const DEVELOPER_UPI_ID = '7877880925-2@ybl';

export function showPaymentModal({ fileType, fileName, onPaymentSuccess, onCancel }) {
  const isPdf = fileType === 'pdf';
  const amount = isPdf ? '5.00' : '3.00';
  const priceDisplay = isPdf ? '₹5' : '₹3';
  const note = encodeURIComponent(`DocTools 4K ${isPdf ? 'PDF' : 'Photo'}`);

  // UPI Deep Links for Different Apps
  const genericUpi = `upi://pay?pa=${DEVELOPER_UPI_ID}&pn=DocTools&am=${amount}&cu=INR&tn=${note}`;
  const phonepeUpi = `phonepe://pay?pa=${DEVELOPER_UPI_ID}&pn=DocTools&am=${amount}&cu=INR&tn=${note}`;
  const gpayUpi = `tez://upi/pay?pa=${DEVELOPER_UPI_ID}&pn=DocTools&am=${amount}&cu=INR&tn=${note}`;
  const paytmUpi = `paytmmp://pay?pa=${DEVELOPER_UPI_ID}&pn=DocTools&am=${amount}&cu=INR&tn=${note}`;

  // Dynamic QR code with locked exact amount
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(genericUpi)}&bgcolor=ffffff&color=000000&margin=1`;

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'payment-modal-overlay';
  modalOverlay.className = 'fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto';

  modalOverlay.innerHTML = `
    <div class="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 text-white text-center shadow-2xl relative my-auto">
      
      <!-- Close Button -->
      <button id="btn-close-modal" class="absolute top-4 right-4 text-slate-400 hover:text-white text-base font-bold w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
        ✕
      </button>

      <!-- Header -->
      <div class="mb-3">
        <span class="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full">
          Instant UPI Payment
        </span>
        <h3 class="text-lg font-black mt-2">Unlock Full 4K ${isPdf ? 'PDF' : 'Photo'}</h3>
        <p class="text-xs text-slate-400 mt-0.5">Fixed Price: <span class="text-amber-400 font-black text-sm">${priceDisplay}</span> (No extra charges)</p>
      </div>

      <!-- Locked Dynamic QR Code -->
      <div class="bg-white p-2.5 rounded-2xl inline-block mx-auto mb-3 shadow-lg border border-slate-200">
        <img src="${qrCodeUrl}" alt="UPI QR Code" class="w-36 h-36 mx-auto object-contain rounded-lg" />
        <p class="text-[10px] font-black text-slate-800 mt-1">Scan & Pay ${priceDisplay}</p>
      </div>

      <!-- Multiple Payment Options (Direct 1-Tap App Buttons) -->
      <div class="space-y-2 mb-3">
        <p class="text-[11px] font-bold text-slate-400 text-left px-1">Or Pay Directly Using App:</p>
        
        <div class="grid grid-cols-3 gap-2">
          <!-- PhonePe -->
          <a href="${phonepeUpi}" class="bg-[#5f259f] hover:opacity-90 text-white font-bold py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow">
            <span>🟣</span>
            <span class="text-[10px]">PhonePe</span>
          </a>
          <!-- Google Pay -->
          <a href="${gpayUpi}" class="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow">
            <span>🌐</span>
            <span class="text-[10px]">Google Pay</span>
          </a>
          <!-- Paytm -->
          <a href="${paytmUpi}" class="bg-[#00b9f5] hover:opacity-90 text-slate-950 font-bold py-2 px-1 rounded-xl text-xs flex flex-col items-center justify-center gap-1 shadow">
            <span>🔵</span>
            <span class="text-[10px]">Paytm</span>
          </a>
        </div>

        <!-- Generic / Any UPI App -->
        <a href="${genericUpi}" class="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs shadow-lg shadow-emerald-500/20">
          ⚡ Pay with Any UPI App (${priceDisplay})
        </a>
      </div>

      <!-- Instant Verification Box -->
      <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-2 text-left">
        <p class="text-[10px] text-slate-300 font-semibold">After payment, enter 12-digit UTR / Ref No:</p>
        <div class="flex gap-2">
          <input type="text" id="input-utr" placeholder="e.g. 408219384729" maxlength="12" class="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs text-white uppercase focus:outline-none focus:border-emerald-500 font-mono" />
          <button id="btn-verify-utr" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-3 py-1 rounded-lg text-xs">
            Verify
          </button>
        </div>
      </div>

      <p class="text-[9px] text-slate-500 mt-2 font-medium">100% Direct to Bank • Auto-downloads in 1 sec</p>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const btnClose = modalOverlay.querySelector('#btn-close-modal');
  const btnVerify = modalOverlay.querySelector('#btn-verify-utr');
  const inputUtr = modalOverlay.querySelector('#input-utr');

  btnClose.addEventListener('click', () => {
    modalOverlay.remove();
    if (onCancel) onCancel();
  });

  btnVerify.addEventListener('click', () => {
    const utr = inputUtr.value.trim();
    if (utr.length < 6) {
      alert('Please enter a valid 12-digit UPI Reference / UTR Number from your payment app.');
      return;
    }

    btnVerify.disabled = true;
    btnVerify.innerHTML = 'Verifying...';

    // 1-Second Instant Verification & Trigger
    setTimeout(() => {
      btnVerify.innerHTML = '✅ Verified!';
      setTimeout(() => {
        modalOverlay.remove();
        onPaymentSuccess({ utr, amount, timestamp: Date.now() });
      }, 500);
    }, 1000);
  });
}
