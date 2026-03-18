const root = document.documentElement;
const game = document.getElementById("game");
const worldElement = document.getElementById("world");
const target = document.getElementById("target");
const crosshair = document.getElementById("crosshair");
const hitCounter = document.getElementById("hitCounter");
const missCounter = document.getElementById("missCounter");
const stopwatch = document.getElementById("stopwatch");
const coinCounter = document.getElementById("coinCounter");
const fpsCounter = document.getElementById("fpsCounter");
const fpsPanel = document.getElementById("fpsPanel");
const restartButton = document.getElementById("restartButton");
const menuButton = document.getElementById("menuButton");
const resumeButton = document.getElementById("resumeButton");
const pauseOverlay = document.getElementById("pauseOverlay");
const pauseTitle = document.getElementById("pauseTitle");
const pauseSubtitle = document.getElementById("pauseSubtitle");
const gun = document.getElementById("gun");
const muzzleFlash = document.getElementById("muzzleFlash");
const hud = document.getElementById("hud");
const arena = document.getElementById("arena");
const gameActions = document.getElementById("gameActions");
const authScreen = document.getElementById("authScreen");
const startScreen = document.getElementById("startScreen");
const customizePanel = document.getElementById("customizePanel");
const settingsPanel = document.getElementById("settingsPanel");
const shopPanel = document.getElementById("shopPanel");
const statsPanel = document.getElementById("statsPanel");
const leaderboardPanel = document.getElementById("leaderboardPanel");
const adminPanel = document.getElementById("adminPanel");
const playButton = document.getElementById("playButton");
const openCustomizeButton = document.getElementById("openCustomizeButton");
const openSettingsButton = document.getElementById("openSettingsButton");
const openStatsButton = document.getElementById("openStatsButton");
const openLeaderboardButton = document.getElementById("openLeaderboardButton");
const openShopButton = document.getElementById("openShopButton");
const openAdminButton = document.getElementById("openAdminButton");
const inGameCustomizeButton = document.getElementById("inGameCustomizeButton");
const inGameSettingsButton = document.getElementById("inGameSettingsButton");
const closeCustomizeButton = document.getElementById("closeCustomizeButton");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const closeShopButton = document.getElementById("closeShopButton");
const closeStatsButton = document.getElementById("closeStatsButton");
const closeLeaderboardButton = document.getElementById("closeLeaderboardButton");
const closeAdminButton = document.getElementById("closeAdminButton");
const signInButton = document.getElementById("signInButton");
const createAccountButton = document.getElementById("createAccountButton");
const signOutButton = document.getElementById("signOutButton");
const sizeInput = document.getElementById("sizeInput");
const colorInput = document.getElementById("colorInput");
const shapeInput = document.getElementById("shapeInput");
const showFpsInput = document.getElementById("showFpsInput");
const fontInput = document.getElementById("fontInput");
const menuCoins = document.getElementById("menuCoins");
const shopCoins = document.getElementById("shopCoins");
const equippedSkinLabel = document.getElementById("equippedSkinLabel");
const shopGrid = document.getElementById("shopGrid");
const viewReadout = document.getElementById("viewReadout");
const adminAccountList = document.getElementById("adminAccountList");
const leaderboardList = document.getElementById("leaderboardList");
const statsLifetimeHits = document.getElementById("statsLifetimeHits");
const statsLifetimeMisses = document.getElementById("statsLifetimeMisses");
const statsAccuracy = document.getElementById("statsAccuracy");
const statsCoins = document.getElementById("statsCoins");
const statsRounds = document.getElementById("statsRounds");
const statsBestScore = document.getElementById("statsBestScore");
const matchHistoryList = document.getElementById("matchHistoryList");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authMessage = document.getElementById("authMessage");
const settingsUsername = document.getElementById("settingsUsername");
const settingsRole = document.getElementById("settingsRole");
const modeButtons = Array.from(document.querySelectorAll(".mode-button"));

const world = {
  targetSize: 48,
  aimScaleX: 760,
  aimScaleY: 540,
  maxYaw: 0.62,
  maxPitch: 0.38,
};

const modes = {
  10: { label: "10 Seconds", durationMs: 10_000 },
  30: { label: "30 Seconds", durationMs: 30_000 },
  60: { label: "1 Minute", durationMs: 60_000 },
};

const skins = [
  { key: "classic", label: "Classic Red", cost: 0, preview: "preview-classic" },
  { key: "blue", label: "Blue Burst", cost: 50, preview: "preview-blue" },
  { key: "green", label: "Green Pulse", cost: 100, preview: "preview-green" },
  { key: "gold", label: "Gold Rush", cost: 200, preview: "preview-gold" },
  { key: "rainbow", label: "Neon Rainbow", cost: 500, preview: "preview-rainbow" },
];

const defaultFont = "'Trebuchet MS', 'Segoe UI', sans-serif";

const state = {
  hits: 0,
  misses: 0,
  coins: 0,
  timeLeftMs: modes[10].durationMs,
  paused: false,
  started: false,
  fps: 0,
  lastFrame: null,
  yaw: 0,
  pitch: 0,
  crosshairSize: 42,
  crosshairColor: "#ffffff",
  crosshairShape: "cross",
  targetWorldX: 0,
  targetWorldY: 0,
  projectedTarget: null,
  selectedMode: 10,
  showFps: false,
  fontFamily: defaultFont,
  ownedSkins: new Set(["classic"]),
  equippedSkin: "classic",
  unlockIntent: false,
  currentUser: null,
  currentUid: null,
  isAdmin: false,
  banned: false,
  deleted: false,
  firebaseReady: false,
  authReady: false,
  pendingSaveTimer: null,
  leaderboard: [],
  managedUsers: [],
  stats: {
    lifetimeHits: 0,
    lifetimeMisses: 0,
    roundsPlayed: 0,
    bestScore: 0,
    totalCoinsEarned: 0,
    matchHistory: [],
  },
};

let app = null;
let auth = null;
let db = null;
let initializeApp = null;
let browserLocalPersistence = null;
let createUserWithEmailAndPassword = null;
let getAuth = null;
let onAuthStateChanged = null;
let setPersistence = null;
let signInWithEmailAndPassword = null;
let firebaseSignOut = null;
let collection = null;
let doc = null;
let getDoc = null;
let getDocs = null;
let getFirestore = null;
let limit = null;
let orderBy = null;
let query = null;
let serverTimestampFn = null;
let setDoc = null;
let updateDoc = null;
let where = null;
const LOCAL_ACCOUNTS_KEY = "red-box-range-local-accounts-v2";
const LOCAL_SESSION_KEY = "red-box-range-local-session-v2";

function isFirebaseConfigured() {
  const config = window.RED_BOX_FIREBASE_CONFIG;
  return Boolean(
    config &&
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId
  );
}

function serverTimestamp() {
  return serverTimestampFn ? serverTimestampFn() : Date.now();
}

function defaultPlayerData() {
  return {
    coins: 0,
    selectedMode: 10,
    showFps: false,
    fontFamily: defaultFont,
    crosshairSize: 42,
    crosshairColor: "#ffffff",
    crosshairShape: "cross",
    ownedSkins: ["classic"],
    equippedSkin: "classic",
    stats: {
      lifetimeHits: 0,
      lifetimeMisses: 0,
      roundsPlayed: 0,
      bestScore: 0,
      totalCoinsEarned: 0,
      matchHistory: [],
    },
  };
}

function defaultUserRecord(username, authEmail, uid) {
  return {
    uid,
    username,
    usernameNormalized: normalizeUsername(username),
    authEmail,
    isAdmin: normalizeUsername(username) === "koil",
    banned: false,
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profile: defaultPlayerData(),
  };
}

function readLocalAccounts() {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeLocalAccounts(accounts) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

function getLocalSaveKey(username) {
  return `red-box-range-local-save-${normalizeUsername(username)}`;
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setHidden(element, hidden) {
  element.classList.toggle("hidden", hidden);
}

function setAuthMessage(message, isError = true) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "rgba(255, 210, 210, 0.9)" : "rgba(200, 255, 210, 0.92)";
}

function isCurrentUserAdmin() {
  return Boolean(state.currentUser && state.isAdmin && !state.deleted);
}

function isAnyPanelOpen() {
  return !customizePanel.classList.contains("hidden") ||
    !settingsPanel.classList.contains("hidden") ||
    !shopPanel.classList.contains("hidden") ||
    !statsPanel.classList.contains("hidden") ||
    !leaderboardPanel.classList.contains("hidden") ||
    !adminPanel.classList.contains("hidden");
}

function formatTime(ms) {
  const clamped = Math.max(0, ms);
  const totalTenths = Math.floor(clamped / 100);
  const minutes = Math.floor(totalTenths / 600);
  const seconds = Math.floor((totalTenths % 600) / 10);
  const tenths = totalTenths % 10;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function formatPercent(hits, misses) {
  const total = hits + misses;
  return `${total === 0 ? 0 : Math.round((hits / total) * 100)}%`;
}

function safeHistory(history) {
  return Array.isArray(history) ? history.slice(0, 50) : [];
}

function applyPlayerData(data) {
  const source = data && typeof data === "object" ? data : defaultPlayerData();
  state.coins = Number(source.coins) || 0;
  state.selectedMode = [10, 30, 60].includes(Number(source.selectedMode)) ? Number(source.selectedMode) : 10;
  state.showFps = Boolean(source.showFps);
  state.fontFamily = typeof source.fontFamily === "string" ? source.fontFamily : defaultFont;
  state.crosshairSize = clamp(Number(source.crosshairSize) || 42, 18, 72);
  state.crosshairColor = typeof source.crosshairColor === "string" ? source.crosshairColor : "#ffffff";
  state.crosshairShape = ["cross", "dot", "ring", "diamond"].includes(source.crosshairShape) ? source.crosshairShape : "cross";
  state.ownedSkins = new Set(Array.isArray(source.ownedSkins) && source.ownedSkins.length ? source.ownedSkins : ["classic"]);
  state.ownedSkins.add("classic");
  state.equippedSkin = state.ownedSkins.has(source.equippedSkin) ? source.equippedSkin : "classic";
  const stats = source.stats && typeof source.stats === "object" ? source.stats : {};
  state.stats = {
    lifetimeHits: Number(stats.lifetimeHits) || 0,
    lifetimeMisses: Number(stats.lifetimeMisses) || 0,
    roundsPlayed: Number(stats.roundsPlayed) || 0,
    bestScore: Number(stats.bestScore) || 0,
    totalCoinsEarned: Number(stats.totalCoinsEarned) || 0,
    matchHistory: safeHistory(stats.matchHistory),
  };
  state.timeLeftMs = modes[state.selectedMode].durationMs;
}

function getProfilePayload() {
  return {
    coins: state.coins,
    selectedMode: state.selectedMode,
    showFps: state.showFps,
    fontFamily: state.fontFamily,
    crosshairSize: state.crosshairSize,
    crosshairColor: state.crosshairColor,
    crosshairShape: state.crosshairShape,
    ownedSkins: Array.from(state.ownedSkins),
    equippedSkin: state.equippedSkin,
    stats: {
      lifetimeHits: state.stats.lifetimeHits,
      lifetimeMisses: state.stats.lifetimeMisses,
      roundsPlayed: state.stats.roundsPlayed,
      bestScore: state.stats.bestScore,
      totalCoinsEarned: state.stats.totalCoinsEarned,
      matchHistory: safeHistory(state.stats.matchHistory),
    },
  };
}

function loadLocalProfile(username) {
  try {
    const raw = localStorage.getItem(getLocalSaveKey(username));
    return raw ? JSON.parse(raw) : defaultPlayerData();
  } catch {
    return defaultPlayerData();
  }
}

function saveLocalProfile() {
  if (!state.currentUser) {
    return;
  }

  try {
    localStorage.setItem(getLocalSaveKey(state.currentUser), JSON.stringify(getProfilePayload()));
  } catch {}
}

function completeLocalLogin(username) {
  const normalized = normalizeUsername(username);
  const accounts = readLocalAccounts();
  const account = accounts[normalized];

  if (!account || account.deleted) {
    setAuthMessage("That account does not exist.", true);
    return;
  }

  if (account.banned) {
    setAuthMessage("This account is banned.", true);
    return;
  }

  state.currentUid = normalized;
  state.currentUser = account.username;
  state.isAdmin = Boolean(account.isAdmin || normalized === "koil");
  state.banned = Boolean(account.banned);
  state.deleted = false;
  applyPlayerData(loadLocalProfile(normalized));
  applyCrosshairSettings();
  applyTextSettings();
  applySkin();
  renderShop();
  updateModeButtons();
  updateHud();
  updateStatsPanel();
  renderAdminPanel();
  setHidden(authScreen, true);
  setHidden(startScreen, false);
  localStorage.setItem(LOCAL_SESSION_KEY, normalized);
  setAuthMessage("", false);
}

function tryLocalAutoLogin() {
  try {
    const remembered = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!remembered) {
      return;
    }
    completeLocalLogin(remembered);
  } catch {}
}

function updateHud() {
  hitCounter.textContent = String(state.hits);
  missCounter.textContent = String(state.misses);
  stopwatch.textContent = formatTime(state.timeLeftMs);
  coinCounter.textContent = String(state.coins);
  fpsCounter.textContent = String(state.fps);
  menuCoins.textContent = String(state.coins);
  shopCoins.textContent = String(state.coins);
  fpsPanel.classList.toggle("hidden", !state.showFps);
  settingsUsername.textContent = state.currentUser ?? "guest";
  settingsRole.textContent = `Role: ${state.isAdmin ? "Administrator" : "Player"}`;
  equippedSkinLabel.textContent = `Equipped: ${skins.find((skin) => skin.key === state.equippedSkin)?.label ?? "Classic Red"}`;
  openAdminButton.classList.toggle("hidden", !isCurrentUserAdmin());
}

function updateStatsPanel() {
  statsLifetimeHits.textContent = String(state.stats.lifetimeHits);
  statsLifetimeMisses.textContent = String(state.stats.lifetimeMisses);
  statsAccuracy.textContent = formatPercent(state.stats.lifetimeHits, state.stats.lifetimeMisses);
  statsCoins.textContent = String(state.stats.totalCoinsEarned);
  statsRounds.textContent = String(state.stats.roundsPlayed);
  statsBestScore.textContent = String(state.stats.bestScore);

  matchHistoryList.innerHTML = "";
  if (!state.stats.matchHistory.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "No completed matches yet.";
    matchHistoryList.append(empty);
    return;
  }

  state.stats.matchHistory.forEach((match) => {
    const item = document.createElement("div");
    item.className = "history-item";

    const title = document.createElement("strong");
    title.textContent = `${match.modeLabel} | ${match.hits} hits / ${match.misses} misses`;

    const meta = document.createElement("span");
    meta.textContent = `${match.timestamp} | +${match.coinsEarned} coins | Accuracy ${match.accuracy}%`;

    item.append(title, meta);
    matchHistoryList.append(item);
  });
}

function renderLeaderboard() {
  leaderboardList.innerHTML = "";

  if (!state.leaderboard.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = state.firebaseReady
      ? "No leaderboard scores yet."
      : "Set up Firebase to load the global leaderboard.";
    leaderboardList.append(empty);
    return;
  }

  state.leaderboard.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "history-item";

    const title = document.createElement("strong");
    title.textContent = `#${index + 1} ${entry.username}`;

    const meta = document.createElement("span");
    meta.textContent = `Best Score ${entry.bestScore} | Coins ${entry.totalCoinsEarned} | Accuracy ${entry.accuracy}`;

    item.append(title, meta);
    leaderboardList.append(item);
  });
}

function renderShop() {
  shopGrid.innerHTML = "";

  skins.forEach((skin) => {
    const item = document.createElement("div");
    item.className = "shop-item";

    const preview = document.createElement("div");
    preview.className = `shop-preview ${skin.preview}`;

    const title = document.createElement("h3");
    title.textContent = skin.label;

    const price = document.createElement("p");
    price.textContent = skin.cost === 0 ? "Free" : `${skin.cost} coins`;

    const button = document.createElement("button");
    button.className = "menu-button";

    if (state.equippedSkin === skin.key) {
      button.textContent = "Equipped";
      button.disabled = true;
    } else if (state.ownedSkins.has(skin.key)) {
      button.textContent = "Equip";
    } else {
      button.textContent = `Buy (${skin.cost})`;
      button.disabled = state.coins < skin.cost;
    }

    button.addEventListener("click", () => {
      if (!state.currentUid) {
        return;
      }

      if (!state.ownedSkins.has(skin.key)) {
        if (state.coins < skin.cost) {
          return;
        }
        state.coins -= skin.cost;
        state.ownedSkins.add(skin.key);
      }

      state.equippedSkin = skin.key;
      applySkin();
      updateHud();
      renderShop();
      queueProfileSave();
    });

    item.append(preview, title, price, button);
    shopGrid.append(item);
  });
}

function renderAdminPanel() {
  adminAccountList.innerHTML = "";

  if (!isCurrentUserAdmin()) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "Admin access required.";
    adminAccountList.append(empty);
    return;
  }

  if (!state.managedUsers.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "No player accounts loaded yet.";
    adminAccountList.append(empty);
    return;
  }

  state.managedUsers.forEach((record) => {
    const item = document.createElement("div");
    item.className = "admin-item";

    const title = document.createElement("strong");
    title.textContent = record.username;

    const meta = document.createElement("span");
    meta.textContent = `${record.isAdmin ? "Admin" : "Player"} | ${record.banned ? "Banned" : "Active"} | Best ${record.bestScore}`;

    const actions = document.createElement("div");
    actions.className = "admin-actions";

    const renameButton = document.createElement("button");
    renameButton.className = "menu-button small";
    renameButton.textContent = "Rename";
    renameButton.disabled = record.deleted;
    renameButton.addEventListener("click", async () => {
      const nextName = window.prompt("New username:", record.username);
      if (!nextName) {
        return;
      }
      await renameAccount(record.uid, nextName);
    });

    const resetButton = document.createElement("button");
    resetButton.className = "menu-button small";
    resetButton.textContent = "Reset Stats";
    resetButton.disabled = record.deleted;
    resetButton.addEventListener("click", async () => {
      await resetAccount(record.uid);
    });

    const adminButton = document.createElement("button");
    adminButton.className = "menu-button small";
    adminButton.textContent = record.isAdmin ? "Remove Admin" : "Make Admin";
    adminButton.disabled = normalizeUsername(record.username) === "koil" || record.deleted;
    adminButton.addEventListener("click", async () => {
      await toggleAdmin(record.uid, !record.isAdmin);
    });

    const banButton = document.createElement("button");
    banButton.className = "menu-button small";
    banButton.textContent = record.banned ? "Unban" : "Ban";
    banButton.disabled = normalizeUsername(record.username) === "koil";
    banButton.addEventListener("click", async () => {
      await toggleBan(record.uid, !record.banned);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "menu-button small";
    deleteButton.textContent = "Remove";
    deleteButton.disabled = normalizeUsername(record.username) === "koil" || record.deleted;
    deleteButton.addEventListener("click", async () => {
      await softDeleteAccount(record.uid, record.username);
    });

    actions.append(renameButton, resetButton, adminButton, banButton, deleteButton);
    item.append(title, meta, actions);
    adminAccountList.append(item);
  });
}

function updateModeButtons() {
  modeButtons.forEach((button) => {
    const mode = Number(button.dataset.mode);
    button.classList.toggle("active", mode === state.selectedMode);
  });
}

function applyCrosshairSettings() {
  root.style.setProperty("--crosshair-size", `${state.crosshairSize}px`);
  root.style.setProperty("--crosshair-color", state.crosshairColor);
  crosshair.className = `crosshair shape-${state.crosshairShape}`;
  sizeInput.value = String(state.crosshairSize);
  colorInput.value = state.crosshairColor;
  shapeInput.value = state.crosshairShape;
}

function applyTextSettings() {
  root.style.setProperty("--ui-font", state.fontFamily);
  showFpsInput.checked = state.showFps;
  fontInput.value = state.fontFamily;
  updateHud();
}

function applySkin() {
  target.className = `target target-3d skin-${state.equippedSkin}`;
  updateHud();
}

function syncCursorMode() {
  const shouldHideCursor =
    state.started &&
    !state.paused &&
    !isAnyPanelOpen() &&
    document.pointerLockElement === arena;
  game.classList.toggle("playing", shouldHideCursor);
}

function updateGunAim() {
  const offsetX = state.yaw * 120;
  const offsetY = state.pitch * 90;
  if (!gun.classList.contains("recoil")) {
    gun.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.08}deg)`;
  }
}

function updateWorldView() {
  const panX = -state.yaw * 90;
  const panY = -state.pitch * 70;
  const tiltY = state.yaw * 8;
  const tiltX = state.pitch * 6;
  worldElement.style.transform = `translate(${panX}px, ${panY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.06)`;
}

function updateViewReadout() {
  viewReadout.textContent = `Yaw ${Math.round(state.yaw * 100)} | Pitch ${Math.round(state.pitch * 100)}`;
}

function requestGamePointerLock() {
  if (!state.started || state.paused || isAnyPanelOpen()) {
    return;
  }

  if (document.pointerLockElement !== arena && arena.requestPointerLock) {
    arena.requestPointerLock();
  }
}

function releasePointerLock(intentional = false) {
  if (intentional) {
    state.unlockIntent = true;
  }

  if (document.pointerLockElement) {
    document.exitPointerLock();
  }
}

function randomTargetPosition() {
  state.targetWorldX = (Math.random() * 2 - 1) * world.maxYaw;
  state.targetWorldY = (Math.random() * 2 - 1) * world.maxPitch;
}

function projectTarget() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const screenX = centerX + (state.targetWorldX - state.yaw) * world.aimScaleX;
  const screenY = centerY + (state.targetWorldY - state.pitch) * world.aimScaleY;
  const left = screenX - world.targetSize / 2;
  const top = screenY - world.targetSize / 2;
  const visible =
    left + world.targetSize >= 0 &&
    left <= window.innerWidth &&
    top + world.targetSize >= 0 &&
    top <= window.innerHeight;

  state.projectedTarget = { left, top, size: world.targetSize, visible };
  target.style.width = `${world.targetSize}px`;
  target.style.height = `${world.targetSize}px`;
  target.style.left = `${left}px`;
  target.style.top = `${top}px`;
  target.style.opacity = visible ? "1" : "0";
  target.style.transform = "perspective(900px) rotateY(-16deg) rotateX(10deg)";
}

function isCrosshairOnTarget() {
  if (!state.projectedTarget || !state.projectedTarget.visible) {
    return false;
  }

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const { left, top, size } = state.projectedTarget;
  return centerX >= left && centerX <= left + size && centerY >= top && centerY <= top + size;
}

function triggerShotFeedback() {
  gun.classList.remove("recoil");
  muzzleFlash.classList.remove("active");
  void gun.offsetWidth;
  gun.classList.add("recoil");
  muzzleFlash.classList.add("active");

  window.setTimeout(() => {
    gun.classList.remove("recoil");
    muzzleFlash.classList.remove("active");
  }, 110);
}

function openPanel(panel) {
  setHidden(customizePanel, panel !== customizePanel);
  setHidden(settingsPanel, panel !== settingsPanel);
  setHidden(shopPanel, panel !== shopPanel);
  setHidden(statsPanel, panel !== statsPanel);
  setHidden(leaderboardPanel, panel !== leaderboardPanel);
  setHidden(adminPanel, panel !== adminPanel);
  releasePointerLock(true);
  syncCursorMode();
}

function closePanels() {
  setHidden(customizePanel, true);
  setHidden(settingsPanel, true);
  setHidden(shopPanel, true);
  setHidden(statsPanel, true);
  setHidden(leaderboardPanel, true);
  setHidden(adminPanel, true);
  syncCursorMode();
}

function setPauseOverlay(title, subtitle, allowResume) {
  pauseTitle.textContent = title;
  pauseSubtitle.textContent = subtitle;
  resumeButton.classList.toggle("hidden", !allowResume);
}

function recordFinishedMatch() {
  const accuracy = formatPercent(state.hits, state.misses).replace("%", "");
  state.stats.matchHistory.unshift({
    mode: state.selectedMode,
    modeLabel: modes[state.selectedMode].label,
    hits: state.hits,
    misses: state.misses,
    accuracy,
    coinsEarned: state.hits * 5,
    timestamp: new Date().toLocaleString(),
  });
  state.stats.matchHistory = state.stats.matchHistory.slice(0, 30);
}

function queueProfileSave() {
  if (!state.currentUid || state.deleted) {
    return;
  }

  if (!state.firebaseReady || !db) {
    saveLocalProfile();
    return;
  }

  if (state.pendingSaveTimer) {
    window.clearTimeout(state.pendingSaveTimer);
  }

  state.pendingSaveTimer = window.setTimeout(async () => {
    try {
      await updateDoc(doc(db, "users", state.currentUid), {
        profile: getProfilePayload(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  }, 150);
}

function handleShot() {
  if (state.paused || !state.started || isAnyPanelOpen()) {
    return;
  }

  triggerShotFeedback();

  if (!isCrosshairOnTarget()) {
    state.misses += 1;
    state.stats.lifetimeMisses += 1;
    updateHud();
    updateStatsPanel();
    queueProfileSave();
    return;
  }

  state.hits += 1;
  state.coins += 5;
  state.stats.lifetimeHits += 1;
  state.stats.totalCoinsEarned += 5;
  updateHud();
  updateStatsPanel();
  renderShop();
  queueProfileSave();
  target.classList.remove("hit");
  void target.offsetWidth;
  target.classList.add("hit");
  randomTargetPosition();
  projectTarget();
}

function resetRound() {
  state.hits = 0;
  state.misses = 0;
  state.timeLeftMs = modes[state.selectedMode].durationMs;
  state.lastFrame = performance.now();
  state.yaw = 0;
  state.pitch = 0;
  state.stats.roundsPlayed += 1;
  updateHud();
  updateStatsPanel();
  updateViewReadout();
  randomTargetPosition();
  projectTarget();
  updateGunAim();
  updateWorldView();
  setPauseOverlay("Paused", "Press Esc to resume or go to menu", true);
  queueProfileSave();
}

function setPaused(nextPaused) {
  if (!state.started) {
    return;
  }

  state.paused = nextPaused;
  setHidden(pauseOverlay, !nextPaused);
  syncCursorMode();

  if (nextPaused) {
    releasePointerLock(true);
  } else {
    state.lastFrame = performance.now();
    requestGamePointerLock();
  }
}

function finishRound() {
  state.paused = true;
  state.stats.bestScore = Math.max(state.stats.bestScore, state.hits);
  recordFinishedMatch();
  setPauseOverlay("Round Over", `${modes[state.selectedMode].label} finished`, false);
  setHidden(pauseOverlay, false);
  releasePointerLock(true);
  syncCursorMode();
  updateStatsPanel();
  queueProfileSave();
  refreshLeaderboard();
}

function returnToMenu() {
  state.started = false;
  state.paused = false;
  state.hits = 0;
  state.misses = 0;
  state.timeLeftMs = modes[state.selectedMode].durationMs;
  state.yaw = 0;
  state.pitch = 0;
  closePanels();
  releasePointerLock(true);
  setHidden(startScreen, false);
  setHidden(hud, true);
  setHidden(arena, true);
  setHidden(gameActions, true);
  setHidden(pauseOverlay, true);
  updateHud();
  updateViewReadout();
  updateGunAim();
  updateWorldView();
  updateModeButtons();
  renderShop();
  syncCursorMode();
  updateStatsPanel();
  queueProfileSave();
}

function startGame() {
  if (!state.currentUid || state.banned || state.deleted) {
    return;
  }

  state.started = true;
  state.paused = false;
  closePanels();
  setHidden(startScreen, true);
  setHidden(hud, false);
  setHidden(arena, false);
  setHidden(gameActions, false);
  setHidden(pauseOverlay, true);
  syncCursorMode();
  resetRound();
  requestGamePointerLock();
}

function resetSessionState() {
  state.started = false;
  state.paused = false;
  state.hits = 0;
  state.misses = 0;
  state.yaw = 0;
  state.pitch = 0;
  state.currentUser = null;
  state.currentUid = null;
  state.isAdmin = false;
  state.banned = false;
  state.deleted = false;
  applyPlayerData(defaultPlayerData());
  applyCrosshairSettings();
  applyTextSettings();
  applySkin();
  renderShop();
  updateModeButtons();
  updateHud();
  updateStatsPanel();
  closePanels();
  releasePointerLock(true);
  setHidden(hud, true);
  setHidden(arena, true);
  setHidden(gameActions, true);
  setHidden(pauseOverlay, true);
  setHidden(startScreen, true);
  setHidden(authScreen, false);
  if (!state.firebaseReady) {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
    } catch {}
  }
  syncCursorMode();
}

function applyUserRecord(uid, userDoc) {
  const profile = userDoc.profile || defaultPlayerData();
  state.currentUid = uid;
  state.currentUser = userDoc.username || "player";
  state.isAdmin = Boolean(userDoc.isAdmin);
  state.banned = Boolean(userDoc.banned);
  state.deleted = Boolean(userDoc.deleted);
  applyPlayerData(profile);
  applyCrosshairSettings();
  applyTextSettings();
  applySkin();
  renderShop();
  updateModeButtons();
  updateHud();
  updateStatsPanel();
  renderAdminPanel();
  renderLeaderboard();

  if (state.banned || state.deleted) {
    setAuthMessage("This account is not allowed to play.", true);
    firebaseSignOut(auth).catch(() => {});
    return;
  }

  setHidden(authScreen, true);
  setHidden(startScreen, false);
  setAuthMessage("");
}

function makeSyntheticEmail(username) {
  const base = normalizeUsername(username).replace(/[^a-z0-9]/g, "");
  return `${base || "player"}-${Date.now()}-${Math.floor(Math.random() * 10_000)}@redboxrange.app`;
}

function usernameQuery(username) {
  return query(collection(db, "users"), where("usernameNormalized", "==", normalizeUsername(username)), limit(1));
}

async function loadUserByUsername(username) {
  const snapshot = await getDocs(usernameQuery(username));
  if (snapshot.empty) {
    return null;
  }
  const record = snapshot.docs[0];
  return { id: record.id, ...record.data() };
}

async function refreshLeaderboard() {
  if (!state.firebaseReady) {
    state.leaderboard = [];
    renderLeaderboard();
    return;
  }

  try {
    const leaderboardQuery = query(collection(db, "users"), orderBy("profile.stats.bestScore", "desc"), limit(25));
    const snapshot = await getDocs(leaderboardQuery);
    state.leaderboard = snapshot.docs
      .map((entry) => {
        const data = entry.data();
        const stats = data.profile?.stats || {};
        return {
          username: data.username || "unknown",
          deleted: Boolean(data.deleted),
          bestScore: Number(stats.bestScore) || 0,
          totalCoinsEarned: Number(stats.totalCoinsEarned) || 0,
          accuracy: formatPercent(Number(stats.lifetimeHits) || 0, Number(stats.lifetimeMisses) || 0),
        };
      })
      .filter((entry) => !entry.deleted)
      .slice(0, 10);
  } catch (error) {
    console.error("Failed to load leaderboard", error);
    state.leaderboard = [];
  }

  renderLeaderboard();
}

async function refreshAdminUsers() {
  if (!state.firebaseReady || !isCurrentUserAdmin()) {
    state.managedUsers = [];
    renderAdminPanel();
    return;
  }

  try {
    const userQuery = query(collection(db, "users"), orderBy("usernameNormalized"), limit(100));
    const snapshot = await getDocs(userQuery);
    state.managedUsers = snapshot.docs.map((entry) => {
      const data = entry.data();
      return {
        uid: entry.id,
        username: data.username || "unknown",
        isAdmin: Boolean(data.isAdmin),
        banned: Boolean(data.banned),
        deleted: Boolean(data.deleted),
        bestScore: Number(data.profile?.stats?.bestScore) || 0,
      };
    });
  } catch (error) {
    console.error("Failed to load admin users", error);
    state.managedUsers = [];
  }

  renderAdminPanel();
}

async function renameAccount(uid, nextUsername) {
  const normalized = normalizeUsername(nextUsername);
  if (!normalized || normalized.length < 3) {
    setAuthMessage("Username must be at least 3 characters.", true);
    return;
  }

  const existing = await loadUserByUsername(normalized);
  if (existing && existing.id !== uid) {
    setAuthMessage("That username already exists.", true);
    return;
  }

  const payload = {
    username: nextUsername.trim(),
    usernameNormalized: normalized,
    updatedAt: serverTimestamp(),
  };

  if (normalized === "koil") {
    payload.isAdmin = true;
  }

  await updateDoc(doc(db, "users", uid), payload);
  setAuthMessage("Username updated.", false);
  await refreshAdminUsers();
  await refreshLeaderboard();
}

async function resetAccount(uid) {
  await updateDoc(doc(db, "users", uid), {
    profile: defaultPlayerData(),
    updatedAt: serverTimestamp(),
  });
  setAuthMessage("Account progress reset.", false);
  await refreshAdminUsers();
  await refreshLeaderboard();
}

async function toggleAdmin(uid, makeAdmin) {
  await updateDoc(doc(db, "users", uid), {
    isAdmin: makeAdmin,
    updatedAt: serverTimestamp(),
  });
  setAuthMessage(makeAdmin ? "Admin granted." : "Admin removed.", false);
  await refreshAdminUsers();
}

async function toggleBan(uid, banned) {
  await updateDoc(doc(db, "users", uid), {
    banned,
    updatedAt: serverTimestamp(),
  });
  setAuthMessage(banned ? "Account banned." : "Account unbanned.", false);
  await refreshAdminUsers();

  if (uid === state.currentUid && banned) {
    firebaseSignOut(auth).catch(() => {});
  }
}

async function softDeleteAccount(uid, username) {
  await updateDoc(doc(db, "users", uid), {
    username: `deleted-${uid.slice(0, 8)}`,
    usernameNormalized: `deleted-${uid}`,
    banned: true,
    deleted: true,
    isAdmin: false,
    updatedAt: serverTimestamp(),
  });
  setAuthMessage(`${username} was removed.`, false);
  await refreshAdminUsers();
  await refreshLeaderboard();
}

function tick(timestamp) {
  if (state.lastFrame === null) {
    state.lastFrame = timestamp;
  }

  const frameDelta = timestamp - state.lastFrame;
  if (frameDelta > 0) {
    state.fps = Math.round(1000 / frameDelta);
  }

  if (state.started && !state.paused && !isAnyPanelOpen()) {
    state.timeLeftMs -= frameDelta;
    if (state.timeLeftMs <= 0) {
      state.timeLeftMs = 0;
      updateHud();
      finishRound();
    } else {
      projectTarget();
      updateHud();
      updateGunAim();
      updateWorldView();
      updateViewReadout();
    }
  } else {
    updateHud();
  }

  state.lastFrame = timestamp;
  requestAnimationFrame(tick);
}

async function initFirebase() {
  if (!isFirebaseConfigured()) {
    setAuthMessage("Firebase is not configured yet. Local accounts are enabled for now.", false);
    return;
  }

  if (window.location.protocol === "file:") {
    setAuthMessage("Firebase needs a local server or hosted site. Local accounts are enabled for now.", false);
    return;
  }

  try {
    const appModule = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js");
    const authModule = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js");
    const firestoreModule = await import("https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js");

    initializeApp = appModule.initializeApp;
    browserLocalPersistence = authModule.browserLocalPersistence;
    createUserWithEmailAndPassword = authModule.createUserWithEmailAndPassword;
    getAuth = authModule.getAuth;
    onAuthStateChanged = authModule.onAuthStateChanged;
    setPersistence = authModule.setPersistence;
    signInWithEmailAndPassword = authModule.signInWithEmailAndPassword;
    firebaseSignOut = authModule.signOut;
    collection = firestoreModule.collection;
    doc = firestoreModule.doc;
    getDoc = firestoreModule.getDoc;
    getDocs = firestoreModule.getDocs;
    getFirestore = firestoreModule.getFirestore;
    limit = firestoreModule.limit;
    orderBy = firestoreModule.orderBy;
    query = firestoreModule.query;
    serverTimestampFn = firestoreModule.serverTimestamp;
    setDoc = firestoreModule.setDoc;
    updateDoc = firestoreModule.updateDoc;
    where = firestoreModule.where;

    app = initializeApp(window.RED_BOX_FIREBASE_CONFIG);
    auth = getAuth(app);
    db = getFirestore(app);
    state.firebaseReady = true;

    await setPersistence(auth, browserLocalPersistence);

    onAuthStateChanged(auth, async (user) => {
      state.authReady = true;

      if (!user) {
        resetSessionState();
        tryLocalAutoLogin();
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, "users", user.uid));
        if (!snapshot.exists()) {
          setAuthMessage("Your account record was not found in Firebase.", true);
          await firebaseSignOut(auth);
          return;
        }

        applyUserRecord(user.uid, snapshot.data());
        await refreshLeaderboard();
        await refreshAdminUsers();
      } catch (error) {
        console.error("Failed to load signed-in user", error);
        setAuthMessage("Could not load your account right now.", true);
        resetSessionState();
        tryLocalAutoLogin();
      }
    });
  } catch (error) {
    console.error("Firebase failed to initialize", error);
    state.firebaseReady = false;
    setAuthMessage("Firebase could not start here, so local accounts are enabled for now.", false);
  }
}

window.addEventListener("mousemove", (event) => {
  if (!state.started || state.paused || isAnyPanelOpen()) {
    return;
  }

  if (document.pointerLockElement === arena) {
    state.yaw = clamp(state.yaw + event.movementX * 0.0018, -world.maxYaw, world.maxYaw);
    state.pitch = clamp(state.pitch + event.movementY * 0.0016, -world.maxPitch, world.maxPitch);
  } else {
    const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2;
    const normalizedY = (event.clientY / window.innerHeight - 0.5) * 2;
    state.yaw = clamp(normalizedX * world.maxYaw, -world.maxYaw, world.maxYaw);
    state.pitch = clamp(normalizedY * world.maxPitch, -world.maxPitch, world.maxPitch);
  }

  projectTarget();
  updateGunAim();
  updateWorldView();
  updateViewReadout();
});

arena.addEventListener("pointerdown", () => {
  if (state.started && !state.paused && !isAnyPanelOpen()) {
    requestGamePointerLock();
    handleShot();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();

    if (!state.started) {
      if (isAnyPanelOpen()) {
        closePanels();
      }
      return;
    }

    if (isAnyPanelOpen()) {
      closePanels();
      state.lastFrame = performance.now();
      requestGamePointerLock();
      return;
    }

    if (state.paused) {
      returnToMenu();
    } else {
      setPauseOverlay("Paused", "Press Esc to resume or go to menu", true);
      setPaused(true);
    }
    return;
  }

  if (event.code === "AltLeft") {
    event.preventDefault();

    if (!state.started || state.paused || isAnyPanelOpen()) {
      return;
    }

    if (document.pointerLockElement === arena) {
      releasePointerLock(true);
      syncCursorMode();
    } else {
      requestGamePointerLock();
    }
    return;
  }

  if (!state.started || state.paused) {
    return;
  }

  const step = 0.05;
  if (event.key.toLowerCase() === "a") {
    state.yaw = clamp(state.yaw - step, -world.maxYaw, world.maxYaw);
  } else if (event.key.toLowerCase() === "d") {
    state.yaw = clamp(state.yaw + step, -world.maxYaw, world.maxYaw);
  } else if (event.key.toLowerCase() === "w") {
    state.pitch = clamp(state.pitch - step, -world.maxPitch, world.maxPitch);
  } else if (event.key.toLowerCase() === "s") {
    state.pitch = clamp(state.pitch + step, -world.maxPitch, world.maxPitch);
  } else {
    return;
  }

  projectTarget();
  updateGunAim();
  updateWorldView();
  updateViewReadout();
});

window.addEventListener("resize", () => {
  projectTarget();
  updateGunAim();
  updateWorldView();
});

document.addEventListener("pointerlockchange", () => {
  if (
    state.started &&
    !state.paused &&
    !isAnyPanelOpen() &&
    document.pointerLockElement !== arena &&
    !state.unlockIntent
  ) {
    setPauseOverlay("Paused", "Press Esc to resume or go to menu", true);
    state.paused = true;
    setHidden(pauseOverlay, false);
  }

  state.unlockIntent = false;
  syncCursorMode();
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedMode = Number(button.dataset.mode);
    state.timeLeftMs = modes[state.selectedMode].durationMs;
    updateModeButtons();
    updateHud();
    queueProfileSave();
  });
});

playButton.addEventListener("click", startGame);
openCustomizeButton.addEventListener("click", () => openPanel(customizePanel));
openSettingsButton.addEventListener("click", () => openPanel(settingsPanel));
openStatsButton.addEventListener("click", () => {
  updateStatsPanel();
  openPanel(statsPanel);
});
openLeaderboardButton.addEventListener("click", async () => {
  await refreshLeaderboard();
  openPanel(leaderboardPanel);
});
openShopButton.addEventListener("click", () => openPanel(shopPanel));
openAdminButton.addEventListener("click", async () => {
  await refreshAdminUsers();
  openPanel(adminPanel);
});
inGameCustomizeButton.addEventListener("click", () => openPanel(customizePanel));
inGameSettingsButton.addEventListener("click", () => openPanel(settingsPanel));

closeCustomizeButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

closeSettingsButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

closeShopButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

closeStatsButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

closeLeaderboardButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

closeAdminButton.addEventListener("click", () => {
  closePanels();
  if (state.started && !state.paused) {
    requestGamePointerLock();
  }
});

showFpsInput.addEventListener("change", (event) => {
  state.showFps = event.target.checked;
  updateHud();
  queueProfileSave();
});

fontInput.addEventListener("change", (event) => {
  state.fontFamily = event.target.value;
  applyTextSettings();
  queueProfileSave();
});

sizeInput.addEventListener("input", (event) => {
  state.crosshairSize = Number(event.target.value);
  applyCrosshairSettings();
  queueProfileSave();
});

colorInput.addEventListener("input", (event) => {
  state.crosshairColor = event.target.value;
  applyCrosshairSettings();
  queueProfileSave();
});

shapeInput.addEventListener("change", (event) => {
  state.crosshairShape = event.target.value;
  applyCrosshairSettings();
  queueProfileSave();
});

restartButton.addEventListener("click", () => {
  if (state.paused) {
    state.paused = false;
    setHidden(pauseOverlay, true);
  }
  resetRound();
  requestGamePointerLock();
  syncCursorMode();
});

resumeButton.addEventListener("click", () => {
  setPaused(false);
});

menuButton.addEventListener("click", returnToMenu);

signOutButton.addEventListener("click", async () => {
  if (!state.firebaseReady || !auth) {
    resetSessionState();
    return;
  }

  await firebaseSignOut(auth);
});

signInButton.addEventListener("click", async () => {
  const username = normalizeUsername(authUsername.value);
  const password = authPassword.value;
  if (!username || !password) {
    setAuthMessage("Enter a username and password.", true);
    return;
  }

  if (!state.firebaseReady || !auth || !db) {
    const accounts = readLocalAccounts();
    if (!accounts[username] || accounts[username].password !== password) {
      setAuthMessage("Wrong username or password.", true);
      return;
    }
    completeLocalLogin(username);
    return;
  }

  try {
    const userRecord = await loadUserByUsername(username);
    if (!userRecord || !userRecord.authEmail || userRecord.deleted) {
      setAuthMessage("That account does not exist.", true);
      return;
    }
    if (userRecord.banned) {
      setAuthMessage("This account is banned.", true);
      return;
    }
    await signInWithEmailAndPassword(auth, userRecord.authEmail, password);
    setAuthMessage("Signed in.", false);
  } catch (error) {
    console.error("Sign in failed", error);
    setAuthMessage("Wrong username or password.", true);
  }
});

createAccountButton.addEventListener("click", async () => {
  const username = authUsername.value.trim();
  const normalized = normalizeUsername(username);
  const password = authPassword.value;
  if (!normalized || !password) {
    setAuthMessage("Enter a username and password.", true);
    return;
  }
  if (normalized.length < 3) {
    setAuthMessage("Username must be at least 3 characters.", true);
    return;
  }
  if (password.length < 6) {
    setAuthMessage("Password must be at least 6 characters.", true);
    return;
  }

  if (!state.firebaseReady || !auth || !db) {
    const accounts = readLocalAccounts();
    if (accounts[normalized] && !accounts[normalized].deleted) {
      setAuthMessage("That username already exists.", true);
      return;
    }

    accounts[normalized] = {
      username,
      password,
      isAdmin: normalized === "koil",
      banned: false,
      deleted: false,
    };
    writeLocalAccounts(accounts);
    localStorage.setItem(getLocalSaveKey(normalized), JSON.stringify(defaultPlayerData()));
    completeLocalLogin(normalized);
    setAuthMessage("Local account created. Add Firebase later to make it global.", false);
    return;
  }

  try {
    const existing = await loadUserByUsername(normalized);
    if (existing && !existing.deleted) {
      setAuthMessage("That username already exists.", true);
      return;
    }

    const authEmail = makeSyntheticEmail(username);
    const credential = await createUserWithEmailAndPassword(auth, authEmail, password);
    await setDoc(doc(db, "users", credential.user.uid), defaultUserRecord(username, authEmail, credential.user.uid));
    setAuthMessage("Account created.", false);
  } catch (error) {
    console.error("Create account failed", error);
    setAuthMessage("Could not create that account right now.", true);
  }
});

applyPlayerData(defaultPlayerData());
applyCrosshairSettings();
applyTextSettings();
applySkin();
renderShop();
updateModeButtons();
updateHud();
updateStatsPanel();
renderLeaderboard();
renderAdminPanel();
updateViewReadout();
projectTarget();
updateWorldView();
syncCursorMode();
tryLocalAutoLogin();
initFirebase();
requestAnimationFrame(tick);
