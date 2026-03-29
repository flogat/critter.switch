const tabs = document.querySelectorAll('.nav-item');
const contents = document.querySelectorAll('.tab-content');

for (const tab of tabs) {
  tab.addEventListener('click', () => {
    tabs.forEach((btn) => btn.classList.remove('active'));
    contents.forEach((section) => section.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab)?.classList.add('active');
  });
}

const strength = document.getElementById('strength');
const stateText = document.getElementById('stateText');
const latestCapture = document.getElementById('latestCapture');
const startBtn = document.getElementById('startBtn');
const initializeBtn = document.getElementById('initializeBtn');

function runScan() {
  const next = Math.floor(80 + Math.random() * 20);
  strength.textContent = `${next}%`;
  stateText.textContent = 'STATUS: SCAN_COMPLETE_SIGNAL_LOCKED';
  latestCapture.textContent = `KOBOLD_TYPE_${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
}

startBtn?.addEventListener('click', runScan);
initializeBtn?.addEventListener('click', runScan);
