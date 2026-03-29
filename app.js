const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const storageKeys = {
  archive: 'critter.archive.v3',
  settings: 'critter.settings.v3',
  progression: 'critter.progress.v3',
};

const archiveStorageLimits = {
  maxEntries: 120,
  recentWithImages: 24,
};

const koboldClasses = [
  'Moorfunke',
  'Laternenknabberer',
  'Dachbalken-Imp',
  'Kupferschleicher',
  'Socken-Orakel',
  'WLAN-Wichtel',
  'Keks-Kommissar',
  'Keller-Konfetti-Kobold',
  'Zahnputz-Zampano',
  'Pfandflaschen-Paladin',
  'Staubwedel-Schamane',
  'Pizzarand-Pirat',
  'Treppenwitz-Trollinger',
  'Koffein-Kobold',
];

const defaults = {
  settings: {
    koboldChance: 35,
    style: 'funny',
    model: 'gemini-3.1-flash-image-preview',
    funMean: 70,
    cuteUgly: 60,
    cleanGrimy: 40,
    apiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent',
    apiKey: '',
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
  resultHistory: [],
  rarityHistory: [],
  activeFilter: 'all',
  selectedArchiveId: null,
  cameraFacingMode: 'user',
  preferredCameraDeviceId: '',
  comparingAfter: true,
  captureWidth: 0,
  captureHeight: 0,
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
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
  updateNetworkBadge();
  handleOrientationChange();
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
  $('#cameraSettingsBtn').addEventListener('click', () => showScreen('settings'));
  $('#captureBtn').addEventListener('click', capturePhoto);
  $('#retakeBtn').addEventListener('click', openCameraFlow);
  $('#usePhotoBtn').addEventListener('click', runAnalysis);
  $('#resultHomeBtn').addEventListener('click', () => showScreen('home'));
  $('#saveResultBtn').addEventListener('click', () => saveCurrentResult(false));
  $('#downloadResultBtn').addEventListener('click', downloadCurrentResultImage);
  $('#saveTransformBtn').addEventListener('click', () => saveCurrentResult(true));
  $('#downloadTransformBtn').addEventListener('click', downloadCurrentTransformImage);
  $('#saveDetectionBtn').addEventListener('click', () => saveCurrentResult(false));
  $('#scanNextBtn').addEventListener('click', openCameraFlow);
  $('#retryTransformBtn').addEventListener('click', () => startTransform(0));
  $('#backToResultBtn').addEventListener('click', () => showScreen('result'));
  $('#viewDetailBtn').addEventListener('click', openCurrentResultDetail);
  $('#backToArchiveBtn').addEventListener('click', () => showScreen('archive'));
  $('#deleteEntryBtn').addEventListener('click', deleteSelectedEntry);
  $('#compareToggleBtn').addEventListener('click', toggleCompareImage);
  $('#shareEntryBtn').addEventListener('click', shareSelectedEntry);
  $('#downloadDetailBtn').addEventListener('click', downloadSelectedEntryImage);
  $('#detailCompareRange').addEventListener('input', (e) => updateDetailCompare(e.target.value));

  $$('.ghost-btn[data-open]').forEach((btn) => {
    btn.addEventListener('click', () => showScreen(btn.dataset.open));
  });
}

function bindSettings() {
  $('#koboldChanceRange').value = String(state.settings.koboldChance ?? defaults.settings.koboldChance);
  $('#koboldChanceValue').textContent = `${state.settings.koboldChance ?? defaults.settings.koboldChance}%`;
  $('#styleSelect').value = state.settings.style;
  $('#modelSelect').value = state.settings.model;
  $('#funMeanRange').value = String(state.settings.funMean);
  $('#cuteUglyRange').value = String(state.settings.cuteUgly);
  $('#cleanGrimyRange').value = String(state.settings.cleanGrimy);
  $('#apiKeyInput').value = state.settings.apiKey;
  $('#autoSaveSelect').value = state.settings.autoSaveBehavior;
  $('#sortOrderSelect').value = state.settings.sortOrder;

  $('#koboldChanceRange').addEventListener('input', (e) => {
    const value = Number(e.target.value);
    $('#koboldChanceValue').textContent = `${value}%`;
    updateSetting('koboldChance', value);
  });
  $('#styleSelect').addEventListener('change', (e) => updateSetting('style', e.target.value));
  $('#modelSelect').addEventListener('change', (e) => updateSetting('model', e.target.value));
  $('#funMeanRange').addEventListener('input', (e) => updateSetting('funMean', Number(e.target.value)));
  $('#cuteUglyRange').addEventListener('input', (e) => updateSetting('cuteUgly', Number(e.target.value)));
  $('#cleanGrimyRange').addEventListener('input', (e) => updateSetting('cleanGrimy', Number(e.target.value)));
  $('#apiKeyInput').addEventListener('change', (e) => updateSetting('apiKey', e.target.value.trim()));
  $('#autoSaveSelect').addEventListener('change', (e) => updateSetting('autoSaveBehavior', e.target.value));
  $('#sortOrderSelect').addEventListener('change', (e) => {
    updateSetting('sortOrder', e.target.value);
    renderArchive();
  });
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
  document.body.classList.toggle('camera-mode', screen === 'camera');

  if (screen !== 'camera') stopCamera();
}

async function openCameraFlow() {
  showScreen('camera');
  const video = $('#cameraVideo');
  video.style.display = 'block';
  stopCamera();

  try {
    state.cameraStream = await requestCameraStream();
    video.srcObject = state.cameraStream;
    await video.play().catch(() => {});
    if (!video.videoWidth || !video.videoHeight) throw new Error('Kamera liefert kein Bildsignal.');
    $('#switchCameraBtn').disabled = false;
    $('#stateText').textContent = 'STATUS: KAMERA_BEREIT';
  } catch {
    state.cameraStream = null;
    video.srcObject = null;
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
  const video = $('#cameraVideo');
  if (video) video.srcObject = null;
  if (!state.cameraStream) return;
  state.cameraStream.getTracks().forEach((track) => track.stop());
  state.cameraStream = null;
}

async function requestCameraStream() {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('getUserMedia nicht verfügbar');
  const constraints = await buildCameraConstraintSequence();
  let lastError;

  for (const videoConstraint of constraints) {
    try {
      return await navigator.mediaDevices.getUserMedia({ video: videoConstraint, audio: false });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('Kein Kamera-Stream verfügbar');
}

async function buildCameraConstraintSequence() {
  const base = {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  };
  const sequence = [];
  const wantedFacing = state.cameraFacingMode;

  if (state.preferredCameraDeviceId) {
    sequence.push({ ...base, deviceId: { exact: state.preferredCameraDeviceId } });
  }

  sequence.push({ ...base, facingMode: { exact: wantedFacing } });
  sequence.push({ ...base, facingMode: { ideal: wantedFacing } });

  const matchingDeviceId = await findCameraDeviceIdForFacingMode(wantedFacing);
  if (matchingDeviceId) {
    state.preferredCameraDeviceId = matchingDeviceId;
    sequence.unshift({ ...base, deviceId: { exact: matchingDeviceId } });
  }

  sequence.push({ ...base });
  sequence.push(true);
  return sequence;
}

async function findCameraDeviceIdForFacingMode(facingMode) {
  if (!navigator.mediaDevices?.enumerateDevices) return '';
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videos = devices.filter((device) => device.kind === 'videoinput');
    if (!videos.length) return '';

    const facingHint = facingMode === 'environment' ? /(back|rear|environment|rück)/i : /(front|user|self|face|vorn)/i;
    const hinted = videos.find((device) => facingHint.test(device.label || ''));
    if (hinted?.deviceId) return hinted.deviceId;
    if (videos.length === 1) return videos[0].deviceId || '';
    const fallback = facingMode === 'environment' ? videos[videos.length - 1] : videos[0];
    return fallback?.deviceId || '';
  } catch {
    return '';
  }
}

function handleOrientationChange() {
  const landscape = window.matchMedia('(orientation: landscape)').matches;
  document.body.classList.toggle('is-portrait', !landscape);
}

function capturePhoto() {
  const canvas = $('#captureCanvas');
  const ctx = canvas.getContext('2d');
  const video = $('#cameraVideo');

  if (state.cameraStream && video.videoWidth > 0) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    state.captureWidth = canvas.width;
    state.captureHeight = canvas.height;
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
    state.captureWidth = canvas.width;
    state.captureHeight = canvas.height;
  }

  state.captureDataUrl = canvas.toDataURL('image/jpeg', 0.92);
  $('#previewImage').src = state.captureDataUrl;
  $('#resultImage').src = state.captureDataUrl;
  showScreen('preview');
}

function runAnalysis() {
  showScreen('analysis');
  const duration = 14_000;
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
      try {
        produceResult();
      } catch (error) {
        console.error('Analyseabschluss fehlgeschlagen:', error);
        const message = error?.message ? ` (${error.message})` : '';
        $('#analysisMessage').textContent = `Analyseabschluss fehlgeschlagen${message}. Bitte erneut scannen.`;
      }
    }
  }, 250);
}

function produceResult() {
  const type = weightedResult();
  const anomalyScore = Math.round(55 + Math.random() * 44);
  const rarity = type === 'kobold' ? weightedPickWithHistory(rarityWeights) : null;

  state.currentResult = {
    id: generateResultId(),
    createdAt: new Date().toISOString(),
    type,
    anomalyScore,
    rarity,
    koboldClass: type === 'kobold' ? randomFrom(koboldClasses) : null,
    image: state.captureDataUrl,
    captureMeta: buildCaptureMeta(),
    transformedImage: '',
    style: state.settings.style,
    model: state.settings.model,
    prompt: buildPrompt(),
    traits: buildTraits(),
    lore: buildLore(type, rarity),
  };

  updateResultScreen();
  syncCurrentResultToArchive();
  showScreen('result');
}

function generateResultId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const random = Math.random().toString(36).slice(2, 10);
  return `scan-${Date.now()}-${random}`;
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
    primary.textContent = 'Trotzdem transformieren';
    primary.onclick = () => startTransform(0);
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

async function startTransform(attempt = 0) {
  const guardError = getTransformGuardError();
  if (guardError) {
    showTransformError(guardError, false);
    return;
  }

  showScreen('transform');
  $('#transformProgress').style.width = '0%';
  let progress = 5;
  let settled = false;
  const expectedDurationMs = 35_000;
  const progressStarted = Date.now();

  const job = setInterval(() => {
    const elapsed = Date.now() - progressStarted;
    const linearProgress = 5 + (elapsed / expectedDurationMs) * 90;
    progress = Math.min(95, Math.max(progress, linearProgress));
    $('#transformProgress').style.width = `${progress}%`;
    $('#transformStatus').textContent =
      progress < 45
        ? 'Stil-Prompt wird komponiert ...'
        : progress < 80
          ? 'Gemini Image Pro rendert Transformation ...'
          : 'Bildausgabe wird finalisiert ...';
  }, 300);

  try {
    const transformed = await requestTransformFromApi();
    settled = true;
    clearInterval(job);
    $('#transformProgress').style.width = '100%';
    $('#transformStatus').textContent = 'Transformation abgeschlossen.';
    finishTransform(transformed);
  } catch (error) {
    settled = true;
    clearInterval(job);
    const fallbackMessage = attempt < 2 ? 'Bitte erneut versuchen.' : 'Bitte Einstellungen prüfen und später erneut versuchen.';
    showTransformError(`${error.message || 'Transformation fehlgeschlagen.'} ${fallbackMessage}`, attempt < 2);
  } finally {
    if (!settled) clearInterval(job);
  }
}

function getTransformGuardError() {
  if (!navigator.onLine) return 'Transformation nicht möglich: Offline-Modus ist aktiv.';
  if (!state.settings.model) return 'Bitte zuerst ein Modell in den Einstellungen auswählen.';
  if (!state.settings.apiKey) {
    return 'Bitte zuerst einen Google API Key in den Einstellungen hinterlegen.';
  }
  return '';
}

function showTransformError(message, retryAllowed) {
  $('#transformErrorMessage').textContent = message;
  $('#retryTransformBtn').disabled = !retryAllowed;
  showScreen('transformError');
}

function finishTransform(transformed) {
  state.transformDataUrl = transformed;
  state.currentResult.transformedImage = transformed;
  $('#beforeImage').src = state.captureDataUrl;
  $('#afterImage').src = transformed;
  state.comparingAfter = true;
  $('#compareToggleBtn').textContent = 'Vorher anzeigen';
  showScreen('transformResult');
  syncCurrentResultToArchive();

  if (state.settings.autoSaveBehavior === 'always') {
    saveCurrentResult(true);
  }
}

function toggleCompareImage() {
  state.comparingAfter = !state.comparingAfter;
  $('#afterImage').style.display = state.comparingAfter ? 'block' : 'none';
  $('#beforeImage').style.display = state.comparingAfter ? 'none' : 'block';
  $('#compareToggleBtn').textContent = state.comparingAfter ? 'Vorher anzeigen' : 'Nachher anzeigen';
}

function updateDetailCompare(value) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0));
  $('#detailAfterImage').style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
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
  const captureMeta = entry.captureMeta || {};
  const beforeImage = entry.image || buildArchivePlaceholder(entry.hasImageFallback);
  const afterImage = entry.transformedImage || beforeImage;
  $('#detailBeforeImage').src = beforeImage;
  $('#detailAfterImage').src = afterImage;
  const compareAvailable = Boolean(entry.transformedImage && entry.image);
  $('#detailCompareControl').style.display = compareAvailable ? 'grid' : 'none';
  $('#detailCompare').classList.toggle('single-image', !compareAvailable);
  $('#detailCompareRange').value = '100';
  updateDetailCompare(100);
  $('#detailMeta').innerHTML = `
    <label><strong>Typ</strong><span>${typeLabels[entry.type]}</span></label>
    <label><strong>Seltenheit</strong><span>${entry.rarity ? rarityLabels[entry.rarity] : '–'}</span></label>
    <label><strong>Klasse</strong><span>${entry.koboldClass || '–'}</span></label>
    <label><strong>Stil</strong><span>${entry.style}</span></label>
    <label><strong>Modell</strong><span>${entry.model || '–'}</span></label>
    <label><strong>Format</strong><span>${captureMeta.formatLabel || 'Unbekannt'}</span></label>
    <label><strong>Ausrichtung</strong><span>${captureMeta.orientationLabel || 'Unbekannt'}</span></label>
    <label><strong>Gerät</strong><span>${captureMeta.deviceLabel || 'Unbekannt'}</span></label>
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
  if (fromTransform && !state.currentResult.transformedImage) return;
  syncCurrentResultToArchive();
  state.selectedArchiveId = state.currentResult.id;
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
      const image = getEntryImage(entry);
      const beforeImage = entry.image || buildArchivePlaceholder(entry.hasImageFallback);
      const afterImage = entry.transformedImage || beforeImage;
      const captureMeta = entry.captureMeta || {};
      const ratio = Number(captureMeta.width) > 0 && Number(captureMeta.height) > 0 ? `${captureMeta.width} / ${captureMeta.height}` : '16 / 10';
      const compareCard = entry.transformedImage
        ? `
          <div class="archive-compare" style="--capture-ratio:${ratio};">
            <img src="${beforeImage}" alt="Vorher" />
            <img src="${afterImage}" alt="Nachher" />
          </div>`
        : `<img src="${image}" alt="${typeLabels[entry.type]}-Fund" style="--capture-ratio:${ratio};" />`;
      return `
        <article class="archive-card" data-open-id="${entry.id}">
          ${compareCard}
          <p><strong>${typeLabels[entry.type].toUpperCase()}</strong>${entry.rarity ? ` · ${rarityLabels[entry.rarity].toUpperCase()}` : ''}</p>
          <p class="archive-format">${captureMeta.formatLabel || 'Format unbekannt'} · ${captureMeta.orientationLabel || 'Ausrichtung unbekannt'}</p>
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
  const imageDataUrl = getEntryImage(entry);

  if (navigator.share) {
    try {
      const payload = {
        title: 'Critter Switch Fund',
        text: `${typeLabels[entry.type]} – ${entry.koboldClass || 'Scan-Ergebnis'}`,
        url: window.location.href,
      };
      const file = dataUrlToFile(imageDataUrl, `critter-${entry.id}.jpg`);
      if (file && navigator.canShare?.({ files: [file] })) payload.files = [file];
      await navigator.share(payload);
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

function weightedResult(profile = 'normal') {
  const baseWeights = hitProfiles[profile] || hitProfiles.normal;
  const weights = applyKoboldChance(baseWeights, state.settings.koboldChance);
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

function applyKoboldChance(baseWeights, koboldChance) {
  const kobold = Math.min(0.9, Math.max(0.05, Number(koboldChance ?? 35) / 100));
  const humanSuspectTotal = Math.max(0.0001, baseWeights.human + baseWeights.suspect);
  const humanRatio = baseWeights.human / humanSuspectTotal;
  const nonKobold = 1 - kobold;
  const human = nonKobold * humanRatio;
  return {
    human,
    suspect: nonKobold - human,
    kobold,
  };
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

async function requestTransformFromApi() {
  const endpoint = withGoogleApiKey(resolveGeminiEndpoint(getEffectiveApiBaseUrl(), state.settings.model), state.settings.apiKey);
  const payload = buildGoogleTransformPayload();
  const headers = { 'Content-Type': 'application/json' };
  if (state.settings.apiKey) headers['x-goog-api-key'] = state.settings.apiKey;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`Transform-API Fehler ${response.status}${details ? `: ${details.slice(0, 140)}` : ''}`);
  }

  const data = await response.json();
  const dataUrl = extractImageDataUrl(data);
  if (!dataUrl) throw new Error('Keine Bilddaten in der API-Antwort gefunden.');
  return dataUrl;
}

function getEffectiveApiBaseUrl() {
  return defaults.settings.apiBaseUrl;
}


function resolveGeminiEndpoint(baseUrl, model) {
  if (!baseUrl) return '';

  const normalizedBase = baseUrl.trim().replace(/\/+$/, '');
  const encodedModel = encodeURIComponent(model || '');
  const hasMethodSuffix = /:generateContent(?:\?|$)/.test(normalizedBase);

  if (hasMethodSuffix) return normalizedBase;
  if (/\/models\/[^/]+$/.test(normalizedBase) && model) {
    return `${normalizedBase}:generateContent`;
  }
  if (normalizedBase.endsWith('/models') && model) {
    return `${normalizedBase}/${encodedModel}:generateContent`;
  }

  return model
    ? `${normalizedBase}/models/${encodedModel}:generateContent`
    : normalizedBase;
}

function withGoogleApiKey(baseUrl, apiKey) {
  if (!baseUrl || !apiKey) return baseUrl;
  try {
    const url = new URL(baseUrl);
    if (url.searchParams.has('key')) return url.toString();
    const isGoogleEndpoint = url.hostname.includes('googleapis.com') || url.hostname.includes('google.com');
    if (isGoogleEndpoint) {
      url.searchParams.set('key', apiKey);
      return url.toString();
    }
    return baseUrl;
  } catch {
    return baseUrl;
  }
}

function buildGoogleTransformPayload() {
  const [mimeHeader, base64Image = ''] = (state.captureDataUrl || '').split(',');
  const mimeMatch = mimeHeader?.match(/^data:(.+);base64$/);
  const mimeType = mimeMatch?.[1] || 'image/jpeg';

  return {
    contents: [
      {
        role: 'user',
        parts: [
          { text: buildPrompt() },
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: {
        aspectRatio: detectAspectRatio(),
        imageSize: '2K',
      },
    },
  };
}

function detectAspectRatio() {
  const width = state.captureWidth || 0;
  const height = state.captureHeight || 0;
  if (width > 0 && height > 0) {
    const ratio = width / height;
    if (ratio > 1.6) return '16:9';
    if (ratio < 0.8) return '3:4';
  }
  return '4:3';
}

function extractImageDataUrl(data) {
  if (!data || typeof data !== 'object') return '';

  if (typeof data.imageDataUrl === 'string' && data.imageDataUrl.startsWith('data:image/')) {
    return data.imageDataUrl;
  }

  if (typeof data.imageBase64 === 'string' && data.imageBase64.length > 24) {
    return `data:image/jpeg;base64,${data.imageBase64}`;
  }

  const inlineData =
    data?.candidates?.[0]?.content?.parts?.find((part) => part?.inlineData?.data)?.inlineData ||
    data?.predictions?.[0]?.bytesBase64Encoded;

  if (typeof inlineData === 'object' && inlineData?.data) {
    return `data:${inlineData.mimeType || 'image/png'};base64,${inlineData.data}`;
  }
  if (typeof inlineData === 'string') {
    return `data:image/png;base64,${inlineData}`;
  }
  return '';
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

function syncCurrentResultToArchive() {
  if (!state.currentResult) return;
  const existingIndex = state.archive.findIndex((entry) => entry.id === state.currentResult.id);
  const merged = {
    ...state.currentResult,
    xpAwarded: existingIndex >= 0 ? state.archive[existingIndex].xpAwarded : xpForResult(state.currentResult),
  };
  if (existingIndex >= 0) {
    state.archive[existingIndex] = merged;
  } else {
    state.archive.unshift(merged);
    awardXp(merged.xpAwarded, merged.rarity);
  }
  persist(storageKeys.archive, state.archive);
  renderArchive();
}

function buildCaptureMeta() {
  const width = Number(state.captureWidth) || 0;
  const height = Number(state.captureHeight) || 0;
  const orientationLabel = width >= height ? 'Querformat' : 'Hochformat';
  const cameraLabel = state.cameraFacingMode === 'environment' ? 'Rückkamera' : 'Frontkamera';
  const trackLabel = state.cameraStream?.getVideoTracks?.()[0]?.getSettings?.().deviceId ? 'Kamera-Stream' : 'Simulierte Quelle';
  return {
    width,
    height,
    orientationLabel,
    formatLabel: width > 0 && height > 0 ? `${width} × ${height}` : 'Unbekannt',
    deviceLabel: `${cameraLabel} · ${trackLabel}`,
  };
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
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  } catch (error) {
    if (key !== storageKeys.archive) throw error;
  }

  let compacted = compactArchiveForStorage(value);

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      localStorage.setItem(key, JSON.stringify(compacted));
      state.archive = compacted;
      return;
    } catch {
      if (attempt === 0) {
        compacted = compactArchiveForStorage(compacted, { maxEntries: 80, recentWithImages: 12 });
      } else if (attempt === 1) {
        compacted = compactArchiveForStorage(compacted, { maxEntries: 40, recentWithImages: 4 });
      } else {
        compacted = compactArchiveForStorage(compacted, { maxEntries: 20, recentWithImages: 0 });
      }
    }
  }

  console.warn('Archiv konnte wegen Storage-Limit nicht vollständig gespeichert werden.');
}

function compactArchiveForStorage(entries, overrideLimits = {}) {
  if (!Array.isArray(entries)) return [];
  const limits = {
    maxEntries: overrideLimits.maxEntries ?? archiveStorageLimits.maxEntries,
    recentWithImages: overrideLimits.recentWithImages ?? archiveStorageLimits.recentWithImages,
  };

  const sorted = [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const trimmed = sorted.slice(0, limits.maxEntries).map((entry, index) => {
    const hasTransformedImage = typeof entry.transformedImage === 'string' && entry.transformedImage.startsWith('data:image/');
    const hasCaptureImage = typeof entry.image === 'string' && entry.image.startsWith('data:image/');
    const keepImage = index < limits.recentWithImages;

    return {
      ...entry,
      image: keepImage ? entry.image : '',
      transformedImage: keepImage ? entry.transformedImage : '',
      hasImageFallback: keepImage ? false : hasTransformedImage || hasCaptureImage,
    };
  });

  return trimmed;
}

function getEntryImage(entry) {
  if (!entry) return buildArchivePlaceholder();
  return entry.transformedImage || entry.image || buildArchivePlaceholder(entry.hasImageFallback);
}

function buildArchivePlaceholder(hadImage = false) {
  const label = hadImage ? 'Bild aus Speichergründen entfernt' : 'Kein Bild gespeichert';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 750'>
  <defs><linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%230f1e38'/><stop offset='100%' stop-color='%23131a2a'/></linearGradient></defs>
  <rect fill='url(%23bg)' width='1200' height='750'/>
  <text x='50%' y='50%' fill='%23dce9ff' font-size='44' text-anchor='middle' dominant-baseline='middle' font-family='Arial, sans-serif'>${label}</text>
</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function randomFrom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function downloadCurrentResultImage() {
  if (!state.currentResult) return;
  downloadDataUrl(state.currentResult.transformedImage || state.currentResult.image, `critter-fund-${state.currentResult.id}.jpg`);
}

function downloadCurrentTransformImage() {
  if (!state.currentResult?.transformedImage) return;
  downloadDataUrl(state.currentResult.transformedImage, `critter-transform-${state.currentResult.id}.jpg`);
}

function downloadSelectedEntryImage() {
  const entry = state.archive.find((item) => item.id === state.selectedArchiveId);
  if (!entry) return;
  downloadDataUrl(entry.transformedImage || entry.image, `critter-archiv-${entry.id}.jpg`);
}

function downloadDataUrl(dataUrl, filename) {
  if (!dataUrl) return;
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
}

function dataUrlToFile(dataUrl, filename) {
  if (!dataUrl || !dataUrl.startsWith('data:')) return null;
  const [header, base64 = ''] = dataUrl.split(',');
  const mime = header.match(/^data:(.+);base64$/)?.[1] || 'image/jpeg';
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  } catch {
    return null;
  }
}
