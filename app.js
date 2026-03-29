const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const storageKeys = {
  archive: 'critter.archive.v3',
  settings: 'critter.settings.v3',
  progression: 'critter.progress.v3',
  auth: 'critter.auth.v3',
};

const defaults = {
  settings: {
    hitRate: 'normal',
    pace: 'standard',
    style: 'funny',
    model: 'nano-banana-2',
    funMean: 70,
    cuteUgly: 60,
    cleanGrimy: 40,
    apiBaseUrl: 'https://api.example.invalid/transform',
    oauthProvider: 'google',
    apiKeyHint: 'lokaler-platzhalter',
    autoSaveBehavior: 'ask',
    sortOrder: 'newest',
  },
  progression: { level: 1, xp: 0, totalXp: 0, legendaryCount: 0 },
};

const analysisPhases = [
  'Subjekt-Erfassung',
  'Humanoid-Hüllenprüfung',
  'Spektralresiduen-Scan',
  'Glamour-Schleier-Inspektion',
  'Klassifikations-Lock',
];

const analysisMessages = [
  'Ektodichte-Gitter wird stabilisiert ...',
  'Hüllenmuster mit Register abgeglichen ...',
  'Ätherische Oszillation steigt an ...',
  'Maskierungsschleier wirkt instabil ...',
  'Finaler Klassen-Lock aktiv ...',
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

const rarityLabels = {
  common: 'Häufig',
  uncommon: 'Ungewöhnlich',
  rare: 'Selten',
  epic: 'Episch',
  legendary: 'Legendär',
};

const typeLabels = {
  human: 'Mensch',
  suspect: 'Verdacht',
  kobold: 'Kobold',
};

const state = {
  currentScreen: 'home',
  previousScreen: 'home',
  cameraStream: null,
  captureDataUrl: '',
  currentResult: null,
  transformDataUrl: '',
  archive: load(storageKeys.archive, []),
  settings: load(storageKeys.settings, defaults.settings),
  progression: load(storageKeys.progression, defaults.progression),
  authenticated: load(storageKeys.auth, false),
  resultHistory: [],
  rarityHistory: [],
  activeFilter: 'all',
  selectedArchiveId: null,
  cameraFacingMode: 'user',
  comparingAfter: true,
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
  $('#switchCameraBtn').addEventListener('click', switchCamera);
  $('#captureBtn').addEventListener('click', capturePhoto);
  $('#retakeBtn').addEventListener('click', openCameraFlow);
  $('#usePhotoBtn').addEventListener('click', runAnalysis);
  $('#resultHomeBtn').addEventListener('click', () => showScreen('home'));
  $('#saveResultBtn').addEventListener('click', () => saveCurrentResult(false));
  $('#saveTransformBtn').addEventListener('click', () => saveCurrentResult(true));
  $('#saveDetectionBtn').addEventListener('click', () => saveCurrentResult(false));
  $('#scanNextBtn').addEventListener('click', openCameraFlow);
  $('#retryTransformBtn').addEventListener('click', () => startTransform(0));
  $('#backToResultBtn').addEventListener('click', () => showScreen('result'));
  $('#viewDetailBtn').addEventListener('click', openCurrentResultDetail);
  $('#backToArchiveBtn').addEventListener('click', () => showScreen('archive'));
  $('#deleteEntryBtn').addEventListener('click', deleteSelectedEntry);
  $('#compareToggleBtn').addEventListener('click', toggleCompareImage);
  $('#shareEntryBtn').addEventListener('click', shareSelectedEntry);

  $$('.ghost-btn[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.open));
  });
}

function bindSettings() {
  $('#hitRateSelect').value = state.settings.hitRate;
  $('#paceSelect').value = state.settings.pace;
  $('#styleSelect').value = state.settings.style;
  $('#modelSelect').value = state.settings.model;
  $('#funMeanRange').value = String(state.settings.funMean);
  $('#cuteUglyRange').value = String(state.settings.cuteUgly);
  $('#cleanGrimyRange').value = String(state.settings.cleanGrimy);
  $('#apiBaseUrlInput').value = state.settings.apiBaseUrl;
  $('#oauthProviderSelect').value = state.settings.oauthProvider;
  $('#apiKeyHintInput').value = state.settings.apiKeyHint;
  $('#autoSaveSelect').value = state.settings.autoSaveBehavior;
  $('#sortOrderSelect').value = state.settings.sortOrder;

  $('#hitRateSelect').addEventListener('change', (e) => updateSetting('hitRate', e.target.value));
  $('#paceSelect').addEventListener('change', (e) => updateSetting('pace', e.target.value));
  $('#styleSelect').addEventListener('change', (e) => updateSetting('style', e.target.value));
  $('#modelSelect').addEventListener('change', (e) => updateSetting('model', e.target.value));
  $('#funMeanRange').addEventListener('input', (e) => updateSetting('funMean', Number(e.target.value)));
  $('#cuteUglyRange').addEventListener('input', (e) => updateSetting('cuteUgly', Number(e.target.value)));
  $('#cleanGrimyRange').addEventListener('input', (e) => updateSetting('cleanGrimy', Number(e.target.value)));
  $('#apiBaseUrlInput').addEventListener('change', (e) => updateSetting('apiBaseUrl', e.target.value.trim()));
  $('#oauthProviderSelect').addEventListener('change', (e) => updateSetting('oauthProvider', e.target.value));
  $('#apiKeyHintInput').addEventListener('change', (e) => updateSetting('apiKeyHint', e.target.value.trim()));
  $('#autoSaveSelect').addEventListener('change', (e) => updateSetting('autoSaveBehavior', e.target.value));
  $('#sortOrderSelect').addEventListener('change', (e) => {
    updateSetting('sortOrder', e.target.value);
    renderArchive();
  });

  $('#authToggleBtn').addEventListener('click', () => {
    state.authenticated = !state.authenticated;
    persist(storageKeys.auth, state.authenticated);
    $('#authToggleBtn').textContent = state.authenticated ? 'Trennen' : 'Verbinden';
  });
  $('#authToggleBtn').textContent = state.authenticated ? 'Trennen' : 'Verbinden';
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

function updateSetting(key, value) {
  state.settings[key] = value;
  persist(storageKeys.settings, state.settings);
}

function showScreen(screen) {
  state.previousScreen = state.currentScreen;
  state.currentScreen = screen;
  $$('.screen').forEach((s) => s.classList.toggle('active', s.dataset.screen === screen));
  $$('.nav-item').forEach((n) => n.classList.toggle('active', n.dataset.nav === screen));
  $('#stateText').textContent = `STATUS: ${screen.toUpperCase()}`;

  if (screen !== 'camera') stopCamera();
}

async function openCameraFlow() {
  showScreen('camera');
  const video = $('#cameraVideo');
  video.style.display = 'block';

  try {
    state.cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: state.cameraFacingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    video.srcObject = state.cameraStream;
    $('#switchCameraBtn').disabled = false;
  } catch {
    state.cameraStream = null;
    video.style.display = 'none';
    $('#switchCameraBtn').disabled = true;
    $('#stateText').textContent = 'STATUS: KAMERA_FALLBACK';
  }
}

async function switchCamera() {
  state.cameraFacingMode = state.cameraFacingMode === 'user' ? 'environment' : 'user';
  $('#cameraModeLabel').textContent = state.cameraFacingMode === 'user' ? 'Frontkamera' : 'Rückkamera';
  await openCameraFlow();
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
    ctx.fillText('SIMULIERTE AUFNAHME', 220, 270);
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
    $('#analysisTimer').textContent = `ANALYSE: ${Math.max(0, Math.ceil((duration - elapsed) / 1000))}s`;

    const phaseIndex = Math.min(analysisPhases.length - 1, Math.floor(progress * analysisPhases.length));
    $('#analysisPhase').textContent = `Phase: ${analysisPhases[phaseIndex]}`;
    $('#analysisMessage').textContent = analysisMessages[phaseIndex];

    if (progress >= 1) {
      clearInterval(timer);
      $('#analysisTimer').textContent = 'ANALYSE: ABGESCHLOSSEN';
      produceResult();
    }
  }, 250);
}

function produceResult() {
  const type = weightedResult(state.settings.hitRate);
  const anomalyScore = Math.round(55 + Math.random() * 44);
  const rarity = type === 'kobold' ? weightedPickWithHistory(rarityWeights) : null;

  state.currentResult = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    type,
    anomalyScore,
    rarity,
    koboldClass: type === 'kobold' ? randomFrom(['Moorfunke', 'Laternenknabberer', 'Dachbalken-Imp', 'Kupferschleicher']) : null,
    image: state.captureDataUrl,
    transformedImage: '',
    style: state.settings.style,
    model: state.settings.model,
    prompt: buildPrompt(),
    traits: buildTraits(),
    lore: buildLore(type, rarity),
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
    title.textContent = 'Mensch bestätigt';
    meta.textContent = `Alles klar. Anomaliewert ${result.anomalyScore}%.`;
    primary.textContent = 'Erneut scannen';
    primary.onclick = openCameraFlow;
  } else if (result.type === 'suspect') {
    title.textContent = 'Verdächtige Signatur';
    meta.textContent = `Mögliche Glamour-Rückstände (${result.anomalyScore}%).`;
    primary.textContent = 'Verdacht transformieren';
    primary.onclick = () => startTransform(0);
  } else {
    title.textContent = 'Kobold entdeckt';
    meta.textContent = `${result.koboldClass} // Seltenheit ${rarityLabels[result.rarity]} // Wert ${result.anomalyScore}%`;
    primary.textContent = 'Subjekt transformieren';
    primary.onclick = () => startTransform(0);
  }
}

function startTransform(attempt = 0) {
  const guardError = getTransformGuardError();
  if (guardError) {
    showTransformError(guardError, false);
    return;
  }

  showScreen('transform');
  $('#transformProgress').style.width = '0%';
  let progress = 0;
  const shouldFail = Math.random() < 0.15 && attempt < 2;

  const job = setInterval(() => {
    progress += 8 + Math.random() * 15;
    $('#transformProgress').style.width = `${Math.min(100, progress)}%`;
    $('#transformStatus').textContent =
      progress < 45
        ? 'Stil-Prompt wird komponiert ...'
        : progress < 80
          ? 'Kobold-Merkmale werden gerendert ...'
          : 'Bildausgabe wird finalisiert ...';

    if (progress >= 100) {
      clearInterval(job);
      if (shouldFail) {
        showTransformError('Die API hat ein Timeout gemeldet. Bitte erneut versuchen.', true);
        return;
      }
      finishTransform();
    }
  }, 300);
}

function getTransformGuardError() {
  if (!navigator.onLine) return 'Transformation nicht möglich: Offline-Modus ist aktiv.';
  if (!state.authenticated) return `Transformation erfordert eine OAuth-Verbindung (${state.settings.oauthProvider}) in den Einstellungen.`;
  if (!state.settings.model) return 'Bitte zuerst ein Modell in den Einstellungen auswählen.';
  if (!state.settings.apiBaseUrl) return 'Bitte zuerst eine API-Basis-URL in den Einstellungen hinterlegen.';
  if (!state.settings.apiKeyHint) return 'Bitte zuerst einen API-Schlüssel-Platzhalter in den Einstellungen hinterlegen.';
  return '';
}

function showTransformError(message, retryAllowed) {
  $('#transformErrorMessage').textContent = message;
  $('#retryTransformBtn').disabled = !retryAllowed;
  showScreen('transformError');
}

function finishTransform() {
  const transformed = buildTransformedImage(state.captureDataUrl, state.currentResult.rarity || 'common');
  state.transformDataUrl = transformed;
  state.currentResult.transformedImage = transformed;
  $('#beforeImage').src = state.captureDataUrl;
  $('#afterImage').src = transformed;
  state.comparingAfter = true;
  $('#compareToggleBtn').textContent = 'Vorher anzeigen';
  showScreen('transformResult');

  if (state.settings.autoSaveBehavior === 'always') {
    saveCurrentResult(true);
  }
}

function buildTransformedImage(baseDataUrl, rarity) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 960;
  canvas.height = 540;

  ctx.fillStyle = '#121f38';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#b977ff';
  ctx.font = 'bold 58px Orbitron';
  ctx.fillText('KOBOLD-ENTTARNUNG', 180, 150);
  ctx.fillStyle = '#b9ff6f';
  ctx.font = 'bold 34px Orbitron';
  ctx.fillText(`SELTENHEIT: ${rarityLabels[rarity].toUpperCase()}`, 260, 220);
  ctx.font = '28px Space Grotesk';
  ctx.fillStyle = '#e6ebf5';
  ctx.fillText(`STIL: ${state.settings.style.toUpperCase()}`, 290, 285);
  ctx.fillText(`MODELL: ${state.settings.model}`, 290, 330);
  ctx.fillText('Identitätsanker erhalten // familienfreundliche Transformation', 140, 390);

  if (baseDataUrl) {
    const img = new Image();
    img.src = baseDataUrl;
  }
  return canvas.toDataURL('image/jpeg', 0.9);
}

function toggleCompareImage() {
  state.comparingAfter = !state.comparingAfter;
  $('#afterImage').style.display = state.comparingAfter ? 'block' : 'none';
  $('#beforeImage').style.display = state.comparingAfter ? 'none' : 'block';
  $('#compareToggleBtn').textContent = state.comparingAfter ? 'Vorher anzeigen' : 'Nachher anzeigen';
}

function openCurrentResultDetail() {
  if (!state.currentResult) return;
  renderDetail(state.currentResult);
  showScreen('detail');
}

function openArchiveDetail(id) {
  const entry = state.archive.find((item) => item.id === id);
  if (!entry) return;
  state.selectedArchiveId = id;
  renderDetail(entry);
  showScreen('detail');
}

function renderDetail(entry) {
  $('#detailImage').src = entry.transformedImage || entry.image;
  $('#detailMeta').innerHTML = `
    <label><strong>Typ</strong><span>${typeLabels[entry.type]}</span></label>
    <label><strong>Seltenheit</strong><span>${entry.rarity ? rarityLabels[entry.rarity] : '–'}</span></label>
    <label><strong>Klasse</strong><span>${entry.koboldClass || '–'}</span></label>
    <label><strong>Stil</strong><span>${entry.style}</span></label>
    <label><strong>Modell</strong><span>${entry.model || '–'}</span></label>
    <label><strong>Datum</strong><span>${new Date(entry.createdAt).toLocaleString('de-DE')}</span></label>
    <label><strong>Traits</strong><span>${entry.traits ? entry.traits.join(', ') : '–'}</span></label>
    <label><strong>Lore</strong><span>${entry.lore || '–'}</span></label>
  `;
}

function deleteSelectedEntry() {
  if (!state.selectedArchiveId) {
    showScreen('archive');
    return;
  }
  state.archive = state.archive.filter((entry) => entry.id !== state.selectedArchiveId);
  persist(storageKeys.archive, state.archive);
  state.selectedArchiveId = null;
  renderArchive();
  showScreen('archive');
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
  awardXp(entry.xpAwarded, entry.rarity);
  renderArchive();
  state.selectedArchiveId = entry.id;
  showScreen('archive');
}

function renderArchive() {
  const grid = $('#archiveGrid');
  const filtered = state.archive.filter((entry) => {
    if (state.activeFilter === 'all') return true;
    if (state.activeFilter === 'rare') return ['rare', 'epic', 'legendary'].includes(entry.rarity);
    return entry.type === state.activeFilter;
  });

  const list = [...filtered].sort((a, b) => {
    if (state.settings.sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (state.settings.sortOrder === 'rarity') {
      const order = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1, null: 0 };
      return (order[b.rarity] || 0) - (order[a.rarity] || 0);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!list.length) {
    grid.innerHTML = '<p class="muted">Noch keine Funde vorhanden.</p>';
    return;
  }

  grid.innerHTML = list
    .map((entry) => {
      const image = entry.transformedImage || entry.image;
      return `
        <article class="archive-card" data-open-id="${entry.id}">
          <img src="${image}" alt="${typeLabels[entry.type]}-Fund" />
          <p><strong>${typeLabels[entry.type].toUpperCase()}</strong>${entry.rarity ? ` · ${rarityLabels[entry.rarity].toUpperCase()}` : ''}</p>
          <p class="muted">${new Date(entry.createdAt).toLocaleString('de-DE')}</p>
        </article>
      `;
    })
    .join('');

  $$('#archiveGrid .archive-card').forEach((card) => {
    card.addEventListener('click', () => openArchiveDetail(card.dataset.openId));
  });
}

async function shareSelectedEntry() {
  const entry = state.archive.find((item) => item.id === state.selectedArchiveId);
  if (!entry) return;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Critter Switch Fund',
        text: `${typeLabels[entry.type]} – ${entry.koboldClass || 'Scan-Ergebnis'}`,
        url: window.location.href,
      });
    } catch {
      // Nutzerabbruch ignorieren
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    $('#stateText').textContent = 'STATUS: LINK_IN_ZWISCHENABLAGE';
  } catch {
    $('#stateText').textContent = 'STATUS: TEILEN_NICHT_VERFÜGBAR';
  }
}

function updateProgressionUi() {
  const threshold = state.progression.level * 100;
  $('#levelLabel').textContent = String(state.progression.level);
  $('#xpLabel').textContent = `${state.progression.xp} / ${threshold}`;
}

function awardXp(amount, rarity) {
  state.progression.xp += amount;
  state.progression.totalXp += amount;
  if (rarity === 'legendary') state.progression.legendaryCount += 1;

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

function weightedPickWithHistory(weightedList) {
  const picked = weightedPick(weightedList);
  const last = state.rarityHistory[state.rarityHistory.length - 1];
  if (last === picked && Math.random() < 0.45) {
    const alternatives = weightedList.filter(([name]) => name !== picked);
    const alt = weightedPick(alternatives.map(([name, weight]) => [name, weight / 0.99]));
    state.rarityHistory.push(alt);
    state.rarityHistory = state.rarityHistory.slice(-4);
    return alt;
  }
  state.rarityHistory.push(picked);
  state.rarityHistory = state.rarityHistory.slice(-4);
  return picked;
}

function weightedPick(weightedList) {
  const total = weightedList.reduce((sum, [, weight]) => sum + weight, 0);
  const roll = Math.random() * total;
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

function buildPrompt() {
  const fun = state.settings.funMean / 100;
  const cute = state.settings.cuteUgly / 100;
  const clean = state.settings.cleanGrimy / 100;

  return `Transformiere das fotografierte menschliche Subjekt in einen ${state.settings.style}-Kobold, halte Pose und Bildausschnitt stabil, bewahre erkennbare Identitätsanker, familienfreundlich ohne Horror. Stimmung: Spaß ${fun.toFixed(2)}, Süße ${cute.toFixed(2)}, Sauberkeit ${clean.toFixed(2)}.`;
}

function buildTraits() {
  const traits = [];
  traits.push(state.settings.funMean > 50 ? 'verspielt' : 'grimmig');
  traits.push(state.settings.cuteUgly > 50 ? 'knuddelig' : 'kratzig');
  traits.push(state.settings.cleanGrimy > 50 ? 'poliert' : 'erdig');
  return traits;
}

function buildLore(type, rarity) {
  if (type !== 'kobold') return 'Kein Kobold-Lore-Eintrag vorhanden.';
  const rarityText = rarityLabels[rarity] || 'Häufig';
  return `${rarityText}er Feldbericht: Sichtung im Bereich alter Dachbalken, reagiert auf Neonlicht und Süßigkeiten.`;
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) return Array.isArray(parsed) ? parsed : fallback;
    if (fallback && typeof fallback === 'object') return { ...fallback, ...parsed };
    return parsed;
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
