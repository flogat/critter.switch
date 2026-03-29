const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const storageKeys = {
  archive: 'critter.archive.v1',
  settings: 'critter.settings.v1',
  progression: 'critter.progress.v1',
  auth: 'critter.auth.v1',
};

const defaults = {
  settings: { hitRate: 'normal', pace: 'standard', style: 'funny' },
  progression: { level: 1, xp: 0, totalXp: 0 },
};

const analysisPhases = [
  'Subject Acquisition',
  'Humanoid Shell Check',
  'Spectral Residue Scan',
  'Glamour Veil Inspection',
  'Classification Lock',
];

const analysisMessages = [
  'Stabilizing ecto-density lattice...',
  'Cross-matching shell pattern registry...',
  'Aetheric oscillation rising...',
  'Masking veil appears unstable...',
  'Final class lock engaged...',
];

const hitProfiles = {
  low: { human: 0.6, suspect: 0.25, kobold: 0.15 },
  normal: { human: 0.45, suspect: 0.2, kobold: 0.35 },
  chaotic: { human: 0.35, suspect: 0.15, kobold: 0.5 },
};

const rarityWeights = [
  ['common', 0.6],
  ['uncommon', 0.25],
  ['rare', 0.1],
  ['epic', 0.04],
  ['legendary', 0.01],
];

const state = {
  currentScreen: 'home',
  cameraStream: null,
  captureDataUrl: '',
  currentResult: null,
  transformDataUrl: '',
  archive: load(storageKeys.archive, []),
  settings: load(storageKeys.settings, defaults.settings),
  progression: load(storageKeys.progression, defaults.progression),
  authenticated: load(storageKeys.auth, false),
  resultHistory: [],
  activeFilter: 'all',
};

init();

function init() {
  bindNav();
  bindCoreActions();
  bindSettings();
  bindFilters();
  hydrateUi();
  renderArchive();

  window.addEventListener('online', updateNetworkBadge);
  window.addEventListener('offline', updateNetworkBadge);
  updateNetworkBadge();
}

function bindNav() {
  $$('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.nav));
  });
}

function bindCoreActions() {
  $('#startScanBtn').addEventListener('click', openCameraFlow);
  $('#quickScanBtn').addEventListener('click', openCameraFlow);
  $('#cameraCancelBtn').addEventListener('click', () => showScreen('home'));
  $('#captureBtn').addEventListener('click', capturePhoto);
  $('#retakeBtn').addEventListener('click', openCameraFlow);
  $('#usePhotoBtn').addEventListener('click', runAnalysis);
  $('#resultHomeBtn').addEventListener('click', () => showScreen('home'));
  $('#saveResultBtn').addEventListener('click', () => saveCurrentResult(false));
  $('#saveTransformBtn').addEventListener('click', () => saveCurrentResult(true));
  $('#scanNextBtn').addEventListener('click', openCameraFlow);

  $$('.ghost-btn[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.open));
  });
}

function bindSettings() {
  $('#hitRateSelect').value = state.settings.hitRate;
  $('#paceSelect').value = state.settings.pace;
  $('#styleSelect').value = state.settings.style;

  $('#hitRateSelect').addEventListener('change', (e) => {
    state.settings.hitRate = e.target.value;
    persist(storageKeys.settings, state.settings);
  });
  $('#paceSelect').addEventListener('change', (e) => {
    state.settings.pace = e.target.value;
    persist(storageKeys.settings, state.settings);
  });
  $('#styleSelect').addEventListener('change', (e) => {
    state.settings.style = e.target.value;
    persist(storageKeys.settings, state.settings);
  });

  $('#authToggleBtn').addEventListener('click', () => {
    state.authenticated = !state.authenticated;
    persist(storageKeys.auth, state.authenticated);
    $('#authToggleBtn').textContent = state.authenticated ? 'Disconnect' : 'Connect';
  });
  $('#authToggleBtn').textContent = state.authenticated ? 'Disconnect' : 'Connect';
}

function bindFilters() {
  $$('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeFilter = btn.dataset.filter;
      $$('.filter-btn').forEach((f) => f.classList.remove('active'));
      btn.classList.add('active');
      renderArchive();
    });
  });
}

function hydrateUi() {
  updateProgressionUi();
}

function showScreen(screen) {
  state.currentScreen = screen;
  $$('.screen').forEach((s) => s.classList.toggle('active', s.dataset.screen === screen));
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.nav === screen));
  $('#stateText').textContent = `STATUS: ${screen.toUpperCase()}`;

  if (screen !== 'camera') stopCamera();
}

async function openCameraFlow() {
  showScreen('camera');
  const video = $('#cameraVideo');

  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    });
    video.srcObject = state.cameraStream;
  } catch {
    state.cameraStream = null;
    video.style.display = 'none';
    $('#stateText').textContent = 'STATUS: CAMERA_PERMISSION_FALLBACK';
  }
}

function stopCamera() {
  if (!state.cameraStream) return;
  state.cameraStream.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
}

function capturePhoto() {
  const canvas = $('#captureCanvas');
  const ctx = canvas.getContext('2d');
  const video = $('#cameraVideo');

  if (state.cameraStream && video.videoWidth > 0) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  } else {
    canvas.width = 960;
    canvas.height = 540;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#18294a');
    gradient.addColorStop(1, '#0c1322');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#b9ff6f';
    ctx.font = 'bold 44px Orbitron';
    ctx.fillText('SIMULATED CAPTURE', 260, 270);
  }

  state.captureDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  $('#previewImage').src = state.captureDataUrl;
  $('#resultImage').src = state.captureDataUrl;
  showScreen('preview');
}

function runAnalysis() {
  showScreen('analysis');
  const duration = paceToDuration(state.settings.pace);
  const started = Date.now();

  const timer = setInterval(() => {
    const elapsed = Date.now() - started;
    const progress = Math.min(elapsed / duration, 1);

    $('#analysisProgress').style.width = `${Math.round(progress * 100)}%`;
    $('#analysisTimer').textContent = `ANALYSIS: ${Math.max(0, Math.ceil((duration - elapsed) / 1000))}s`;

    const phaseIndex = Math.min(analysisPhases.length - 1, Math.floor(progress * analysisPhases.length));
    $('#analysisPhase').textContent = `Phase: ${analysisPhases[phaseIndex]}`;
    $('#analysisMessage').textContent = analysisMessages[phaseIndex];

    if (progress >= 1) {
      clearInterval(timer);
      $('#analysisTimer').textContent = 'ANALYSIS: COMPLETE';
      produceResult();
    }
  }, 250);
}

function produceResult() {
  const type = weightedResult(state.settings.hitRate);
  const anomalyScore = Math.round(55 + Math.random() * 44);
  const rarity = type === 'kobold' ? weightedPick(rarityWeights) : null;

  state.currentResult = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type,
    anomalyScore,
    rarity,
    koboldClass: type === 'kobold' ? randomFrom(['Bog Spark', 'Lantern Gnaw', 'Rafter Imp', 'Copper Sneak']) : null,
    image: state.captureDataUrl,
    transformedImage: '',
    style: state.settings.style,
  };

  updateResultScreen();
  showScreen('result');
}

function updateResultScreen() {
  const result = state.currentResult;
  const title = $('#resultTitle');
  const meta = $('#resultMeta');
  const primary = $('#resultPrimaryBtn');
  primary.onclick = null;

  if (result.type === 'human') {
    title.textContent = 'Human Confirmed';
    meta.textContent = `All clear. Anomaly score ${result.anomalyScore}%.`; 
    primary.textContent = 'Scan Again';
    primary.onclick = openCameraFlow;
  } else if (result.type === 'suspect') {
    title.textContent = 'Suspicious Signature';
    meta.textContent = `Potential glamour residue (${result.anomalyScore}%).`; 
    primary.textContent = 'Rescan';
    primary.onclick = openCameraFlow;
  } else {
    title.textContent = 'Kobold Detected';
    meta.textContent = `${result.koboldClass} // rarity ${result.rarity.toUpperCase()} // score ${result.anomalyScore}%`;
    primary.textContent = 'Transform Subject';
    primary.onclick = startTransform;
  }
}

function startTransform() {
  if (!navigator.onLine) {
    $('#resultMeta').textContent = 'Transform unavailable: offline mode active.';
    return;
  }
  if (!state.authenticated) {
    $('#resultMeta').textContent = 'Transform requires OAuth connection in Settings.';
    return;
  }

  showScreen('transform');
  $('#transformProgress').style.width = '0%';
  let progress = 0;

  const job = setInterval(() => {
    progress += 8 + Math.random() * 15;
    $('#transformProgress').style.width = `${Math.min(100, progress)}%`;
    $('#transformStatus').textContent =
      progress < 45
        ? 'Composing style prompt...'
        : progress < 80
          ? 'Rendering kobold traits...'
          : 'Finalizing image output...';

    if (progress >= 100) {
      clearInterval(job);
      finishTransform();
    }
  }, 300);
}

function finishTransform() {
  const transformed = buildTransformedImage(state.captureDataUrl, state.currentResult.rarity || 'common');
  state.transformDataUrl = transformed;
  state.currentResult.transformedImage = transformed;
  $('#beforeImage').src = state.captureDataUrl;
  $('#afterImage').src = transformed;
  showScreen('transformResult');
}

function buildTransformedImage(baseDataUrl, rarity) {
  const img = new Image();
  img.src = baseDataUrl;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;

  ctx.fillStyle = '#121f38';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#b977ff';
  ctx.font = 'bold 62px Orbitron';
  ctx.fillText('KOBOLD REVEAL', 220, 150);
  ctx.fillStyle = '#b9ff6f';
  ctx.font = 'bold 40px Orbitron';
  ctx.fillText(`RARITY: ${rarity.toUpperCase()}`, 280, 235);
  ctx.font = '28px Space Grotesk';
  ctx.fillStyle = '#e6ebf5';
  ctx.fillText(`STYLE: ${state.settings.style.toUpperCase()}`, 330, 300);
  ctx.fillText('Identity anchor preserved // family-safe transform', 170, 360);

  return canvas.toDataURL('image/jpeg', 0.9);
}

function saveCurrentResult(fromTransform) {
  if (!state.currentResult) return;

  const entry = {
    ...state.currentResult,
    transformedImage: fromTransform ? state.currentResult.transformedImage : state.currentResult.transformedImage || '',
    xpAwarded: xpForResult(state.currentResult),
  };

  state.archive.unshift(entry);
  persist(storageKeys.archive, state.archive);
  awardXp(entry.xpAwarded);
  renderArchive();
  showScreen('archive');
}

function renderArchive() {
  const grid = $('#archiveGrid');
  const list = state.archive.filter((entry) => {
    if (state.activeFilter === 'all') return true;
    if (state.activeFilter === 'rare') return ['rare', 'epic', 'legendary'].includes(entry.rarity);
    return entry.type === state.activeFilter;
  });

  if (!list.length) {
    grid.innerHTML = '<p class="muted">No captures yet.</p>';
    return;
  }

  grid.innerHTML = list
    .map((entry) => {
      const image = entry.transformedImage || entry.image;
      return `
        <article class="archive-card">
          <img src="${image}" alt="${entry.type} capture" />
          <p><strong>${entry.type.toUpperCase()}</strong>${entry.rarity ? ` · ${entry.rarity.toUpperCase()}` : ''}</p>
          <p class="muted">${new Date(entry.createdAt).toLocaleString()}</p>
        </article>
      `;
    })
    .join('');
}

function updateProgressionUi() {
  const threshold = state.progression.level * 100;
  $('#levelLabel').textContent = String(state.progression.level);
  $('#xpLabel').textContent = `${state.progression.xp} / ${threshold}`;
}

function awardXp(amount) {
  state.progression.xp += amount;
  state.progression.totalXp += amount;

  while (state.progression.xp >= state.progression.level * 100) {
    state.progression.xp -= state.progression.level * 100;
    state.progression.level += 1;
  }

  persist(storageKeys.progression, state.progression);
  updateProgressionUi();
}

function weightedResult(profile) {
  const weights = hitProfiles[profile] || hitProfiles.normal;
  const penalized = applyAntiRepetition(weights);
  const roll = Math.random();

  const cumulative = [
    ['human', penalized.human],
    ['suspect', penalized.human + penalized.suspect],
  ];

  const result = roll < cumulative[0][1] ? 'human' : roll < cumulative[1][1] ? 'suspect' : 'kobold';
  state.resultHistory.push(result);
  state.resultHistory = state.resultHistory.slice(-3);
  return result;
}

function applyAntiRepetition(weights) {
  const lastTwo = state.resultHistory.slice(-2);
  if (lastTwo.length === 2 && lastTwo[0] === lastTwo[1]) {
    const repeated = lastTwo[0];
    const reduced = { ...weights };
    reduced[repeated] = Math.max(0.05, reduced[repeated] - 0.2);
    const rest = 1 - reduced[repeated];
    const others = ['human', 'suspect', 'kobold'].filter((k) => k !== repeated);
    const sum = weights[others[0]] + weights[others[1]];
    reduced[others[0]] = (weights[others[0]] / sum) * rest;
    reduced[others[1]] = (weights[others[1]] / sum) * rest;
    return reduced;
  }
  return weights;
}

function weightedPick(weightedList) {
  const roll = Math.random();
  let sum = 0;
  for (const [label, weight] of weightedList) {
    sum += weight;
    if (roll <= sum) return label;
  }
  return weightedList[0][0];
}

function paceToDuration(pace) {
  if (pace === 'short') return 10_000;
  if (pace === 'dramatic') return 20_000;
  return 14_000;
}

function xpForResult(result) {
  if (result.type === 'human') return 8;
  if (result.type === 'suspect') return 12;
  const rarityXp = { common: 20, uncommon: 30, rare: 45, epic: 70, legendary: 120 };
  return rarityXp[result.rarity] || 20;
}

function updateNetworkBadge() {
  const online = navigator.onLine;
  $('#networkStatus').textContent = online ? 'ONLINE' : 'OFFLINE';
  $('.dot').style.background = online ? 'var(--accent)' : 'var(--danger)';
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}
