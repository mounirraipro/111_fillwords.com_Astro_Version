import { CATEGORIES } from './levels.js';
import { WebHaptics, defaultPatterns } from 'https://esm.sh/web-haptics';

// ==========================================
// SOUND ENGINE
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.haptics = new WebHaptics();
  }
  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      this.ctx = new AudioContext();
    }
    this.haptics.trigger(defaultPatterns.light);
  }
  _note(freq, type, duration, volume, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
    gain.gain.setValueAtTime(volume, this.ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }
  click() { 
    this._note(600, 'sine', 0.1, 0.05); 
    this.haptics.trigger(defaultPatterns.light);
  }
  select() { 
    this._note(400, 'sine', 0.1, 0.02); 
    this.haptics.trigger(defaultPatterns.selection);
  }
  found() { 
    this._note(523.25, 'sine', 0.15, 0.1, 0); // C5
    this._note(659.25, 'sine', 0.15, 0.1, 0.1); // E5
    this._note(783.99, 'sine', 0.3, 0.1, 0.2); // G5
    this.haptics.trigger(defaultPatterns.success);
  }
  error() { 
    this._note(150, 'sawtooth', 0.2, 0.05); 
    this.haptics.trigger(defaultPatterns.error);
  }
  win() {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      this._note(freq, 'sine', 0.4, 0.1, i * 0.15);
    });
    this.haptics.trigger(defaultPatterns.success);
  }
  setMute(isMuted) {
    this.enabled = !isMuted;
  }
}

// ==========================================
// CONFETTI SYSTEM
// ==========================================
class ConfettiSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.running = false;
    this.colors = ['#FFD700', '#0ea5e9', '#e6b800', '#0e7490', '#ffffff'];
  }
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  burst(count = 100) {
    this.resize();
    for (let i = 0; i < count; i++) {
        this.particles.push({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20 - 5,
            size: Math.random() * 8 + 4,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            rotation: Math.random() * 360,
            rv: (Math.random() - 0.5) * 10
        });
    }
    if (!this.running) {
        this.running = true;
        this._animate();
    }
  }
  _animate() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let active = false;
    for (let p of this.particles) {
        p.vy += 0.4; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rv;
        if (p.y < this.canvas.height) active = true;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation * Math.PI / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        this.ctx.restore();
    }
    if (active) requestAnimationFrame(() => this._animate());
    else this.running = false;
  }
  stop() { this.running = false; this.particles = []; }
}

// ==========================================
// BOARD GENERATOR — Smart dynamic algorithm
// Auto-sizes grid, prevents path conflicts,
// scoring-based placement with diagonal bias
// ==========================================
function generateBoard(cols, rows, words, layoutHint = {}) {
  const ALL_DIRS = [
    { dr: 0, dc: 1, key: 'right', axis: 'horizontal' },
    { dr: 0, dc: -1, key: 'left', axis: 'horizontal' },
    { dr: 1, dc: 0, key: 'down', axis: 'vertical' },
    { dr: -1, dc: 0, key: 'up', axis: 'vertical' },
    { dr: 1, dc: 1, key: 'down-right', axis: 'diagonal' },
    { dr: 1, dc: -1, key: 'down-left', axis: 'diagonal' },
    { dr: -1, dc: 1, key: 'up-right', axis: 'diagonal' },
    { dr: -1, dc: -1, key: 'up-left', axis: 'diagonal' }
  ];
  const AXES = ['horizontal', 'vertical', 'diagonal'];
  const maxWordLen = Math.max(...words.map(w => w.length));

  function getLayoutCandidates() {
    const candidates = [];
    const seen = new Set();
    const preferredAxis = layoutHint.preferredAxis === 'vertical' ? 'vertical' : 'horizontal';

    const addCandidate = (candidateCols, candidateRows) => {
      const key = `${candidateCols}x${candidateRows}`;
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push({ cols: candidateCols, rows: candidateRows });
    };

    addCandidate(cols, rows);

    if (maxWordLen > cols || maxWordLen > rows) {
      if (preferredAxis === 'vertical') {
        addCandidate(cols, Math.max(rows, maxWordLen));
        addCandidate(Math.max(cols, maxWordLen), rows);
      } else {
        addCandidate(Math.max(cols, maxWordLen), rows);
        addCandidate(cols, Math.max(rows, maxWordLen));
      }

      addCandidate(Math.max(cols, maxWordLen), Math.max(rows, maxWordLen));
    }

    return candidates;
  }

  function scoreLayout(result) {
    const targetAspect = Math.max(layoutHint.aspectRatio || 1, 0.1);
    const boardAspect = Math.max((result.cols || 1) / Math.max(result.rows || 1, 1), 0.1);
    const aspectPenalty = Math.abs(Math.log(boardAspect / targetAspect));
    const areaPenalty = (result.cols || 0) * (result.rows || 0);
    const expansionPenalty = Math.max(0, (result.cols || 0) - cols) + Math.max(0, (result.rows || 0) - rows);
    return areaPenalty * 10 + aspectPenalty * 50 + expansionPenalty * 5;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function cellKey(r, c) { return r * 1000 + c; }

  function createPlacementStats() {
    return {
      axis: { horizontal: 0, vertical: 0, diagonal: 0 },
      directions: Object.fromEntries(ALL_DIRS.map(dir => [dir.key, 0]))
    };
  }

  function registerPlacement(stats, direction) {
    stats.axis[direction.axis]++;
    stats.directions[direction.key]++;
  }

  function hasEnoughCoverage(placedWords) {
    const usedAxes = new Set(placedWords.map(placed => placed.direction.axis));
    const usedDirections = new Set(placedWords.map(placed => placed.direction.key));

    if (words.length >= AXES.length && usedAxes.size < AXES.length) return false;
    const minDirections = Math.min(words.length, 4);
    return usedDirections.size >= minDirections;
  }

  function canPlaceWord(grid, word, row, col, direction, effectiveRows, effectiveCols) {
    const endR = row + direction.dr * (word.length - 1);
    const endC = col + direction.dc * (word.length - 1);
    if (endR < 0 || endR >= effectiveRows || endC < 0 || endC >= effectiveCols) return null;

    const positions = [];
    let overlapCount = 0;
    for (let i = 0; i < word.length; i++) {
      const r = row + direction.dr * i;
      const c = col + direction.dc * i;
      const cell = grid[r][c];
      if (cell !== '' && cell !== word[i]) return null;
      if (cell !== '') overlapCount++;
      positions.push({ r, c });
    }

    return { positions, overlapCount };
  }

  function hasPathConflict(newPathSet, placedPaths) {
    for (const existingPath of placedPaths) {
      let newInExisting = true;
      for (const k of newPathSet) {
        if (!existingPath.has(k)) {
          newInExisting = false;
          break;
        }
      }

      let existingInNew = true;
      for (const k of existingPath) {
        if (!newPathSet.has(k)) {
          existingInNew = false;
          break;
        }
      }

      if (newInExisting || existingInNew) return true;

      let shared = 0;
      for (const k of newPathSet) {
        if (existingPath.has(k)) {
          shared++;
          if (shared > 1) return true;
        }
      }
    }

    return false;
  }

  function buildFallbackBoard(effectiveRows, effectiveCols, requireCoverage = true) {
    const grid = Array(effectiveRows).fill(null).map(() => Array(effectiveCols).fill(''));
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const placedWords = [];
    const placedPaths = [];
    const placementStats = createPlacementStats();

    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const dirOrder = [...ALL_DIRS].sort((a, b) => {
        return placementStats.axis[a.axis] - placementStats.axis[b.axis]
          || placementStats.directions[a.key] - placementStats.directions[b.key]
          || Math.random() - 0.5;
      });

      let placed = null;
      for (const direction of dirOrder) {
        for (let r = 0; r < effectiveRows && !placed; r++) {
          for (let c = 0; c < effectiveCols && !placed; c++) {
            const candidate = canPlaceWord(grid, w, r, c, direction, effectiveRows, effectiveCols);
            if (!candidate) continue;

            const pathSet = new Set(candidate.positions.map(pos => cellKey(pos.r, pos.c)));
            if (hasPathConflict(pathSet, placedPaths)) continue;

            placed = { positions: candidate.positions, direction, pathSet };
          }
        }
        if (placed) break;
      }

      if (!placed) {
        return null;
      }

      for (let i = 0; i < w.length; i++) {
        const pos = placed.positions[i];
        grid[pos.r][pos.c] = w[i];
      }

      registerPlacement(placementStats, placed.direction);
      placedWords.push({ word: w, positions: placed.positions, direction: placed.direction });
      placedPaths.push(placed.pathSet);
    }

    if (requireCoverage && !hasEnoughCoverage(placedWords)) return null;
    return { grid, placedWords };
  }

  function tryGenerate(effectiveRows, effectiveCols) {
    const grid = Array(effectiveRows).fill(null).map(() => Array(effectiveCols).fill(''));
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    const placedWords = [];
    const placedPaths = []; // array of Set<cellKey>
    const placementStats = createPlacementStats();

    for (const word of sortedWords) {
      const w = word.toUpperCase();
      const placement = findBestPlacement(grid, w, placedPaths, placementStats, effectiveRows, effectiveCols);
      if (!placement) return null; // retry entire board

      // Apply placement to grid
      const pathSet = new Set();
      for (let i = 0; i < w.length; i++) {
        const pos = placement.positions[i];
        grid[pos.r][pos.c] = w[i];
        pathSet.add(cellKey(pos.r, pos.c));
      }
      registerPlacement(placementStats, placement.direction);
      placedWords.push({ word: w, positions: placement.positions, direction: placement.direction });
      placedPaths.push(pathSet);
    }

    return hasEnoughCoverage(placedWords) ? { grid, placedWords } : null;
  }

  function findBestPlacement(grid, word, placedPaths, placementStats, effectiveRows, effectiveCols) {
    const candidates = [];

    // Shuffled start positions for randomness
    const starts = [];
    for (let r = 0; r < effectiveRows; r++)
      for (let c = 0; c < effectiveCols; c++)
        starts.push([r, c]);
    shuffle(starts);

    const dirs = shuffle([...ALL_DIRS]);

    for (const [r, c] of starts) {
      for (const direction of dirs) {
        const candidate = canPlaceWord(grid, word, r, c, direction, effectiveRows, effectiveCols);
        if (!candidate) continue;

        const newPathSet = new Set(candidate.positions.map(pos => cellKey(pos.r, pos.c)));
        if (hasPathConflict(newPathSet, placedPaths)) continue;

        const axisCount = placementStats.axis[direction.axis];
        const directionCount = placementStats.directions[direction.key];
        const score =
          (axisCount === 0 ? 18 : 0) +
          Math.max(0, 10 - axisCount * 4) +
          Math.max(0, 6 - directionCount * 2) +
          candidate.overlapCount * 2 +
          Math.random() * 4;

        candidates.push({ positions: candidate.positions, direction, score });

        // Limit candidates to keep performance reasonable
        if (candidates.length >= 200) break;
      }
      if (candidates.length >= 200) break;
    }

    if (candidates.length === 0) return null;

    // Pick from top candidates with some randomness
    candidates.sort((a, b) => b.score - a.score);
    const topN = Math.min(candidates.length, 12);
    return candidates[Math.floor(Math.random() * topN)];
  }

  function compactBoard(result) {
    const allPositions = result.placedWords.flatMap(placedWord => placedWord.positions);
    if (!allPositions.length) return result;

    const minRow = Math.min(...allPositions.map(pos => pos.r));
    const maxRow = Math.max(...allPositions.map(pos => pos.r));
    const minCol = Math.min(...allPositions.map(pos => pos.c));
    const maxCol = Math.max(...allPositions.map(pos => pos.c));

    const croppedGrid = [];
    for (let r = minRow; r <= maxRow; r++) {
      croppedGrid.push(result.grid[r].slice(minCol, maxCol + 1));
    }

    const croppedWords = result.placedWords.map(placedWord => ({
      ...placedWord,
      positions: placedWord.positions.map(pos => ({
        r: pos.r - minRow,
        c: pos.c - minCol
      }))
    }));

    return {
      ...result,
      grid: croppedGrid,
      placedWords: croppedWords,
      rows: croppedGrid.length,
      cols: croppedGrid[0]?.length || 0
    };
  }

  let bestResult = null;
  let bestScore = Infinity;

  for (const candidate of getLayoutCandidates()) {
    const effectiveCols = candidate.cols;
    const effectiveRows = candidate.rows;

    let result = null;
    for (let attempt = 0; attempt < 400; attempt++) {
      result = tryGenerate(effectiveRows, effectiveCols);
      if (result) break;
    }

    if (!result) {
      result = buildFallbackBoard(effectiveRows, effectiveCols);
    }
    if (!result) {
      result = buildFallbackBoard(effectiveRows, effectiveCols, false);
    }
    if (!result) {
      continue;
    }

    result = compactBoard(result);
    const compactRows = result.rows;
    const compactCols = result.cols;

    const FILL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < compactRows; r++) {
      for (let c = 0; c < compactCols; c++) {
        if (result.grid[r][c] === '') {
          result.grid[r][c] = FILL[Math.floor(Math.random() * FILL.length)];
        }
      }
    }

    result.cols = compactCols;
    result.rows = compactRows;

    const score = scoreLayout(result);
    if (score < bestScore) {
      bestScore = score;
      bestResult = result;
    }
  }

  if (bestResult) {
    return bestResult;
  }

  throw new Error('Unable to generate board layout');
}

// ==========================================
// GAME ENGINE
// ==========================================
// Color palette for found words (cycles through these)
const WORD_COLORS = ['yellow', 'purple', 'lightblue'];

class GameEngine {
  constructor() {
    this.sound = new SoundEngine();
    this.confetti = new ConfettiSystem(document.getElementById('confetti-canvas'));
    this.state = {
        level: null,
        board: null, // {grid, placedWords}
        foundWords: new Set(),
        tileWordCounts: {}, // tracks how many found words use each tile: "r,c" -> count
        levelRecords: this.loadLevelRecords(),
        
        // Interaction state
        isDragging: false,
        startTile: null,
        currentPath: [], // Array of {r,c}
        currentDirection: null,
        activePointerId: null,
        pathHasCrossing: false, // true when swiping over already-selected tile
        svgLines: [], // permanently drawn lines for found words (full path arrays)
        levelStartedAt: 0,
        mistakeCount: 0,
        idleHintsUsed: 0,
        lastWinResult: null,
        currentCategory: null,
        
        // Progress & Tutorial
        unlockedLevels: this.loadProgress(),
        tutorialShown: localStorage.getItem('fillwords_tutorial') === 'true'
    };
    
    this.initDOM();
    this.bindEvents();
    this.renderMenu();
  }

  initDOM() {
    this.screens = {
        menu: document.getElementById('menu-screen'),
        collections: document.getElementById('collection-screen'),
        level: document.getElementById('level-screen'),
        game: document.getElementById('game-screen'),
        win: document.getElementById('win-screen')
    };
    
    // Toggles
    this.soundToggles = document.querySelectorAll('.sound-toggle');
    this.volumeSliders = document.querySelectorAll('input[type="range"]');
    
    // UI elements
    this.catGrid = document.getElementById('category-grid');
    this.collectionGrid = document.getElementById('collection-grid');
    this.lvlGrid = document.getElementById('level-grid');
    
    // Game elements
    this.boardPanel = document.querySelector('.board-panel');
    this.boardContainer = document.getElementById('board-container');
    this.gridEl = document.getElementById('letter-grid');
    this.wordListEl = document.getElementById('word-list');
    this.svgOverlay = document.getElementById('swipe-overlay');
    this.tutorialEl = document.getElementById('game-tutorial');
  }

  fitBoardToViewport() {
    if (!this.state.board || !this.boardPanel || !this.boardContainer) return;

    const cols = this.state.board.cols || this.state.level?.cols || 0;
    const rows = this.state.board.rows || this.state.level?.rows || 0;
    if (!cols || !rows) return;

    const styles = getComputedStyle(this.boardContainer);
    const baseTileSize = parseFloat(styles.getPropertyValue('--tile-size-base')) || 48;
    const baseFontSize = parseFloat(styles.getPropertyValue('--tile-font-size-base')) || 21;
    const baseGap = parseFloat(styles.getPropertyValue('--board-gap-base')) || 7;
    const basePadding = parseFloat(styles.getPropertyValue('--board-padding-base')) || 16;

    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const safetyBuffer = 12;
    const availableWidth = Math.max(0, Math.min(this.boardPanel.clientWidth, viewportWidth) - safetyBuffer);
    const availableHeight = Math.max(0, Math.min(this.boardPanel.clientHeight, viewportHeight) - safetyBuffer);

    const boardWidth = cols * baseTileSize + Math.max(0, cols - 1) * baseGap + basePadding * 2 + 4;
    const boardHeight = rows * baseTileSize + Math.max(0, rows - 1) * baseGap + basePadding * 2 + 4;
    const scale = Math.min(1, availableWidth / boardWidth, availableHeight / boardHeight);
    const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;

    const scaledTileSize = baseTileSize * safeScale;
    const scaledFontSize = Math.max(9, baseFontSize * safeScale);
    const scaledGap = baseGap * safeScale;
    const scaledPadding = basePadding * safeScale;
    const scaledWidth = cols * scaledTileSize + Math.max(0, cols - 1) * scaledGap + scaledPadding * 2 + 4;
    const scaledHeight = rows * scaledTileSize + Math.max(0, rows - 1) * scaledGap + scaledPadding * 2 + 4;

    this.boardContainer.style.setProperty('--tile-size', `${scaledTileSize}px`);
    this.boardContainer.style.setProperty('--tile-font-size', `${scaledFontSize}px`);
    this.boardContainer.style.setProperty('--board-gap', `${scaledGap}px`);
    this.boardContainer.style.setProperty('--board-padding', `${scaledPadding}px`);
    this.boardContainer.style.width = `${scaledWidth}px`;
    this.boardContainer.style.height = `${scaledHeight}px`;
  }

  getBoardLayoutHint(level) {
    const panelWidth = this.boardPanel?.clientWidth || window.innerWidth;
    const panelHeight = this.boardPanel?.clientHeight || window.innerHeight;
    const aspectRatio = panelWidth / Math.max(panelHeight, 1);
    const maxWordLen = Math.max(...level.words.map(word => word.length));
    const preferredAxis = aspectRatio < 0.9 ? 'vertical' : 'horizontal';

    return {
      aspectRatio,
      preferredAxis,
      maxWordLen
    };
  }

  refreshBoardLayout() {
    if (!this.state.board) return;
    requestAnimationFrame(() => {
      this.fitBoardToViewport();
      this.updateSVG();
    });
  }

  loadProgress() {
    let saved = {};
    try {
      const raw = localStorage.getItem('fillwords_progress');
      if (raw) saved = JSON.parse(raw);
    } catch {}
    // Merge: ensure every category has at least its first level unlocked
    const progress = { ...saved };
    CATEGORIES.forEach(cat => {
      const firstLevelId = cat.levels[0]?.id;
      if (!Array.isArray(progress[cat.slug])) {
        progress[cat.slug] = firstLevelId != null ? [firstLevelId] : [];
        return;
      }
      if (firstLevelId != null && !progress[cat.slug].includes(firstLevelId)) {
        progress[cat.slug].unshift(firstLevelId);
      }
    });
    return progress;
  }

  loadStats() {
    try {
      const saved = localStorage.getItem('fillwords_stats');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { levelsCompleted: 0, wordsFound: 0, lastPlayedDate: null, streak: 0 };
  }

  saveStats(stats) {
    localStorage.setItem('fillwords_stats', JSON.stringify(stats));
  }

  loadLevelRecords() {
    try {
      const saved = localStorage.getItem('fillwords_level_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  }

  saveLevelRecords() {
    localStorage.setItem('fillwords_level_records', JSON.stringify(this.state.levelRecords));
  }

  getLevelRecord(levelId) {
    return this.state.levelRecords[levelId] || null;
  }

  formatDuration(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds || 0));
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getNormalParTime(level) {
    return Math.max(25, level.words.length * 9 + level.cols * level.rows * 1.2);
  }

  calculateNormalStars(level, result) {
    let stars = 1;
    if (result.idleHintsUsed === 0) stars = 2;
    if (result.idleHintsUsed === 0 && result.mistakes === 0 && result.elapsedSeconds <= this.getNormalParTime(level)) {
      stars = 3;
    }
    return stars;
  }

  recordLevelResult(level, result) {
    const previous = this.getLevelRecord(level.id);
    const updated = {
      stars: Math.max(previous?.stars || 0, result.stars),
      bestTime: previous?.bestTime != null ? Math.min(previous.bestTime, result.elapsedSeconds) : result.elapsedSeconds,
      bestMistakes: previous?.bestMistakes != null ? Math.min(previous.bestMistakes, result.mistakes) : result.mistakes,
      bestHintRun: previous?.bestHintRun != null ? Math.min(previous.bestHintRun, result.idleHintsUsed) : result.idleHintsUsed,
      plays: (previous?.plays || 0) + 1,
      lastPlayedAt: Date.now()
    };

    this.state.levelRecords[level.id] = updated;
    this.saveLevelRecords();

    return {
      record: updated,
      isNewBestTime: !previous || previous.bestTime == null || result.elapsedSeconds < previous.bestTime,
      isNewStarRecord: result.stars > (previous?.stars || 0)
    };
  }

  renderStars(count) {
    return Array.from({ length: 3 }, (_, index) => {
      const filled = index < count;
      return `<span class="star-chip${filled ? ' filled' : ''}">${filled ? '★' : '☆'}</span>`;
    }).join('');
  }

  getNormalReplayLabel(record) {
    if (!record) return 'First Clear';
    if (record.stars >= 3) return 'Perfect Run';
    if (record.stars === 2) return 'Go For 3 Stars';
    return 'Beat Your Best';
  }

  getCategoryProgress(cat) {
    const totalLevels = cat.levels.length;
    let completedLevels = 0;
    let earnedStars = 0;
    let perfectedLevels = 0;

    cat.levels.forEach(level => {
      const record = this.getLevelRecord(level.id);
      if (record) {
        completedLevels++;
        earnedStars += record.stars || 0;
        if ((record.stars || 0) >= 3) perfectedLevels++;
      }
    });

    const totalStars = totalLevels * 3;
    const isComplete = completedLevels === totalLevels;
    const isPerfected = perfectedLevels === totalLevels && totalLevels > 0;
    const masteryLabel = isPerfected ? 'Perfected' : isComplete ? 'Mastered' : 'In Progress';

    return {
      completedLevels,
      totalLevels,
      earnedStars,
      totalStars,
      perfectedLevels,
      completionPct: Math.round((completedLevels / totalLevels) * 100),
      isComplete,
      isPerfected,
      masteryLabel
    };
  }

  getCategoryStatusNote(progress) {
    if (progress.isPerfected) return 'Collection Perfected';
    if (progress.isComplete) return 'Collection Mastered';
    return `${progress.totalLevels - progress.completedLevels} levels left`;
  }

  renderCategoryMastery(progress) {
    const pills = [];
    pills.push(`<span class="mastery-pill">${progress.masteryLabel}</span>`);
    pills.push(`<span class="mastery-pill subtle">${progress.perfectedLevels}/${progress.totalLevels} perfect</span>`);
    pills.push(`<span class="mastery-pill subtle">${progress.earnedStars}/${progress.totalStars} stars</span>`);
    return pills.join('');
  }

  renderCollectionShelf() {
    this.switchScreen('collections');
    this.collectionGrid.innerHTML = '';

    CATEGORIES.forEach(cat => {
      this.ensureCategoryUnlocked(cat);
      const progress = this.getCategoryProgress(cat);
      const card = document.createElement('button');
      card.className = `collection-card ${progress.isPerfected ? 'perfected' : ''}`;
      card.innerHTML = `
        <div class="collection-top">
          <div>
            <div class="collection-title">${cat.emoji || '🔤'} ${cat.name}</div>
            <div class="collection-status">${progress.masteryLabel}</div>
          </div>
          <div class="level-stars">${this.renderStars(Math.min(progress.perfectedLevels, 3))}</div>
        </div>
        <div class="cat-progress-bar"><span style="width:${progress.completionPct}%"></span></div>
        <div class="collection-stats">
          <span class="collection-stat">${progress.completedLevels}/${progress.totalLevels} cleared</span>
          <span class="collection-stat">${progress.perfectedLevels}/${progress.totalLevels} perfect</span>
          <span class="collection-stat">${progress.earnedStars}/${progress.totalStars} stars</span>
        </div>
      `;
      card.addEventListener('click', () => {
        this.sound.click();
        this.renderLevelSelect(cat);
      });
      this.collectionGrid.appendChild(card);
    });
  }

  ensureCategoryUnlocked(cat) {
    if (!cat?.levels?.length) return;
    if (!this.state.unlockedLevels[cat.slug]) this.state.unlockedLevels[cat.slug] = [];
    const firstLevelId = cat.levels[0].id;
    if (!this.state.unlockedLevels[cat.slug].includes(firstLevelId)) {
      this.state.unlockedLevels[cat.slug].push(firstLevelId);
      this.saveProgress();
    }
  }

  updateStats(wordsFoundInLevel) {
    const stats = this.loadStats();
    stats.levelsCompleted = (stats.levelsCompleted || 0) + 1;
    stats.wordsFound = (stats.wordsFound || 0) + wordsFoundInLevel;
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastPlayedDate === today) {
      // already played today, streak stays
    } else if (stats.lastPlayedDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
      stats.streak = (stats.streak || 0) + 1;
    } else {
      stats.streak = 1;
    }
    stats.lastPlayedDate = today;
    this.saveStats(stats);
  }

  getDailyPuzzle() {
    // Seed by day: YYYYMMDD → index into all levels across all categories
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const allLevels = CATEGORIES.flatMap(cat => cat.levels.map(lvl => ({ cat, lvl })));

    const dailyPool = allLevels.filter(({ lvl }) => {
      const longestWord = Math.max(...lvl.words.map(word => word.length));
      return lvl.cols * lvl.rows <= 49 && longestWord <= 7;
    });

    const source = dailyPool.length > 0 ? dailyPool : allLevels;
    const idx = seed % source.length;
    return source[idx];
  }

  saveProgress() {
    localStorage.setItem('fillwords_progress', JSON.stringify(this.state.unlockedLevels));
  }
  
  unlockNextLevel(currentLevel) {
    let catSlug = null;
    let nextLvlId = null;
    
    // Find category and next level
    for (const cat of CATEGORIES) {
      const idx = cat.levels.findIndex(l => l.id === currentLevel.id);
      if (idx !== -1) {
        catSlug = cat.slug;
        if (idx < cat.levels.length - 1) {
          nextLvlId = cat.levels[idx + 1].id;
        }
        break;
      }
    }
    
    if (catSlug && nextLvlId) {
      if (!this.state.unlockedLevels[catSlug]) this.state.unlockedLevels[catSlug] = [];
      if (!this.state.unlockedLevels[catSlug].includes(nextLvlId)) {
        this.state.unlockedLevels[catSlug].push(nextLvlId);
        this.saveProgress();
      }
    }
  }

  switchScreen(id) {
    Object.values(this.screens).forEach(s => s.classList.remove('active'));
    this.screens[id].classList.add('active');
  }

  bindEvents() {
    // Nav buttons
    document.getElementById('back-to-menu').addEventListener('click', () => {
        this.sound.click(); this.renderMenu();
    });
    document.getElementById('open-collection-shelf').addEventListener('click', () => {
        this.sound.init(); this.sound.click(); this.renderCollectionShelf();
    });
    document.getElementById('back-from-collections').addEventListener('click', () => {
        this.sound.click(); this.renderMenu();
    });
    document.getElementById('back-to-levels').addEventListener('click', () => {
        this.sound.click();
        if (this.state.currentCategory) this.renderLevelSelect(this.state.currentCategory);
        else this.renderMenu();
    });
    
    document.getElementById('back-to-menu-win').addEventListener('click', () => {
        this.sound.click(); this.renderMenu();
    });
    document.getElementById('play-again').addEventListener('click', () => {
        this.sound.click(); this.loadLevel(this.state.level);
    });
    document.getElementById('next-level').addEventListener('click', () => {
        this.sound.click();
        const cat = CATEGORIES.find(c => c.levels.some(l => l.id === this.state.level.id));
        const idx = cat.levels.findIndex(l => l.id === this.state.level.id);
        if (idx < cat.levels.length - 1) {
            this.loadLevel(cat.levels[idx + 1]);
        } else {
            this.renderMenu();
        }
    });

    // Sound Toggles
    this.soundToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if(e.target.tagName.toLowerCase() === 'input') return;
        this.sound.enabled = !this.sound.enabled;
        this.updateSoundToggles();
        if (this.sound.enabled) { this.sound.init(); this.sound.click(); }
      });
    });

    // Board interaction
    const boardPanel = document.getElementById('board-container');
    boardPanel.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerUp.bind(this));
    
    // Prevent context menu
    boardPanel.addEventListener('contextmenu', e => e.preventDefault());
  }

  updateSoundToggles() {
    this.soundToggles.forEach(btn => {
      if (this.sound.enabled) {
        btn.classList.add('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound On";
      } else {
        btn.classList.remove('active');
        const lb = btn.querySelector('span');
        if (lb) lb.innerText = "Sound Off";
      }
    });
  }

  // --- Rendering UI --- //
  renderMenu() {
    this.state.currentCategory = null;
    this.switchScreen('menu');
    // Populate inline stats
    const stats = this.loadStats();
    const el = (id) => document.getElementById(id);
    if (el('stat-levels')) el('stat-levels').textContent = stats.levelsCompleted || 0;
    if (el('stat-words')) el('stat-words').textContent = stats.wordsFound || 0;
    if (el('stat-streak')) el('stat-streak').textContent = stats.streak || 0;

    // Hero play button = Puzzle of the Day
    const daily = this.getDailyPuzzle();
    if (el('potd-title')) el('potd-title').textContent = `▶  Play Today's Puzzle`;
    if (el('potd-meta')) el('potd-meta').textContent = `${daily.cat.name} · ${daily.lvl.title} · ${daily.lvl.difficulty}`;
    const potdBtn = el('potd-play-btn');
    if (potdBtn) {
      potdBtn.onclick = () => {
        this.sound.init();
        this.sound.click();
        if (!this.state.unlockedLevels[daily.cat.slug]) this.state.unlockedLevels[daily.cat.slug] = [];
        if (!this.state.unlockedLevels[daily.cat.slug].includes(daily.lvl.id)) {
          this.state.unlockedLevels[daily.cat.slug].push(daily.lvl.id);
          this.saveProgress();
        }
        this.loadLevel(daily.lvl);
      };
    }

    // Category pills
    this.catGrid.innerHTML = '';
    CATEGORIES.forEach(cat => {
      this.ensureCategoryUnlocked(cat);
      const progress = this.getCategoryProgress(cat);
      const pill = document.createElement('div');
      pill.className = `category-card ${progress.isPerfected ? 'perfected' : ''}`;
      pill.innerHTML = `
        <div class="cat-body">
          <span class="cat-emoji">${cat.emoji || '🔤'}</span>
          <div class="cat-copy">
            <span class="cat-name">${cat.name}</span>
            <div class="cat-visuals">
              <div class="cat-progress-bar"><span style="width:${progress.completionPct}%"></span></div>
              <span class="cat-progress">${progress.completedLevels}/${progress.totalLevels}</span>
              <span class="cat-stars-mini">${progress.earnedStars}/${progress.totalStars}★</span>
            </div>
            <span class="cat-mastery-badge">${this.getCategoryStatusNote(progress)}</span>
          </div>
        </div>
      `;
      pill.addEventListener('click', () => {
        this.sound.init();
        this.sound.click();
        this.renderLevelSelect(cat);
      });
      this.catGrid.appendChild(pill);
    });
  }

  renderLevelSelect(cat) {
    this.ensureCategoryUnlocked(cat);
    this.state.currentCategory = cat;
    const progress = this.getCategoryProgress(cat);
    document.getElementById('level-cat-name').textContent = `${cat.emoji || ''} ${cat.name}`;
    document.getElementById('level-cat-desc').textContent = `${progress.completedLevels}/${progress.totalLevels} cleared · ${progress.earnedStars}/${progress.totalStars} stars`;
    document.getElementById('level-cat-mastery').innerHTML = this.renderCategoryMastery(progress);
    this.lvlGrid.innerHTML = '';
    
    cat.levels.forEach((lvl) => {
      const isUnlocked = this.state.unlockedLevels[cat.slug]?.includes(lvl.id);
      const record = this.getLevelRecord(lvl.id);
      const stars = record?.stars || 0;
      const bestLine = record?.bestTime != null
        ? `<div class="level-best">Best ${this.formatDuration(record.bestTime)}</div>`
        : '<div class="level-best">Unplayed</div>';
      const badge = record
        ? (record.stars >= 3 ? 'Perfect' : record.stars === 2 ? 'Clean' : 'Best')
        : 'New';
      
      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? '' : 'locked'}`;
      card.innerHTML = `
        <div class="level-meta-left">
          <div class="level-title">
            ${isUnlocked ? '' : '🔒 '}
            ${lvl.title}
          </div>
          <div class="level-stars">${this.renderStars(stars)}</div>
          ${bestLine}
         </div>
         <div class="level-meta-right">
           <span class="level-badge">${badge}</span>
           <span class="level-diff">${lvl.difficulty}</span>
         </div>
      `;
      
      if (isUnlocked) {
        card.addEventListener('click', () => {
          this.sound.click();
          this.loadLevel(lvl);
        });
      }
      this.lvlGrid.appendChild(card);
    });
    
    this.switchScreen('level');
  }

  // --- Game State --- //
  loadLevel(level) {
    this.state.level = level;
    this.state.foundWords.clear();
    this.state.svgLines = [];
    this.state.tileWordCounts = {};
    this.state.currentDirection = null;
    this.state.activePointerId = null;
    this.state.levelStartedAt = Date.now();
    this.state.mistakeCount = 0;
    this.state.idleHintsUsed = 0;
    this.state.lastWinResult = null;
    this.switchScreen('game');
    this.state.board = generateBoard(level.cols, level.rows, level.words, this.getBoardLayoutHint(level));
    
    // Use actual board dimensions (may be auto-expanded for long words)
    const actualCols = this.state.board.cols || level.cols;
    const actualRows = this.state.board.rows || level.rows;
    
    document.getElementById('game-level-title').textContent = level.title;
    const levelRecord = this.getLevelRecord(level.id);
    document.getElementById('game-level-best').textContent = levelRecord?.bestTime != null
      ? `Best ${this.formatDuration(levelRecord.bestTime)} · ${levelRecord.stars}/3 stars`
      : 'New level';
    
    // Setup Grid UI
    this.gridEl.style.gridTemplateColumns = `repeat(${actualCols}, 1fr)`;
    this.gridEl.innerHTML = '';
    
    for (let r=0; r<actualRows; r++) {
        for (let c=0; c<actualCols; c++) {
            const tile = document.createElement('div');
            tile.className = 'letter-tile';
            tile.dataset.r = r;
            tile.dataset.c = c;
            tile.textContent = this.state.board.grid[r][c];
            this.gridEl.appendChild(tile);
        }
    }
    
    // Setup Word List UI
    this.wordListEl.innerHTML = '';
    level.words.forEach(word => {
        const span = document.createElement('div');
        span.className = 'word-item';
        span.id = `word-${word}`;
        span.textContent = word;
        this.wordListEl.appendChild(span);
    });
    
    this.refreshBoardLayout();
    
    // GSAP Intro
    gsap.fromTo('.letter-tile', 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, stagger: 0.02, duration: 0.4, ease: 'back.out(1.5)' }
    );
    
    this.showTutorialIfNeeded();
  }

  showTutorialIfNeeded() {
    // Show tutorial only on the first level
    if (this.state.level.id !== 1 || this.state.foundWords.size > 0) return;
    
    const wordObj = this.state.board.placedWords[0];
    if (!wordObj) return;

    // We only show tutorial once
    this.tutorialEl.style.display = 'flex';
    this.tutorialEl.style.opacity = '1';
    
    // Animate hand over the first word
    const startPos = this.getTileCenter(wordObj.positions[0].r, wordObj.positions[0].c);
    const endPos = this.getTileCenter(wordObj.positions[wordObj.positions.length-1].r, wordObj.positions[wordObj.positions.length-1].c);
    
    if (startPos && endPos) {
      const hand = document.getElementById('tutorial-hand');
      
      const overlayBox = this.svgOverlay.getBoundingClientRect();
      const parentBox = this.tutorialEl.getBoundingClientRect();
      
      // We offset the finger tip slightly
      const sX = overlayBox.left + startPos.x - parentBox.left - 10;
      const sY = overlayBox.top + startPos.y - parentBox.top + 10;
      const eX = overlayBox.left + endPos.x - parentBox.left - 10;
      const eY = overlayBox.top + endPos.y - parentBox.top + 10;
      
      gsap.set(hand, { x: sX + 40, y: sY + 40, opacity: 0, scale: 0.5 });
      
      this.tutorialAnim = gsap.timeline({ repeat: -1, repeatDelay: 0.8 })
        .to(hand, { x: sX, y: sY, opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
        .to(hand, { scale: 0.9, duration: 0.2 })
        .to(hand, { x: eX, y: eY, duration: 1.2, ease: 'power1.inOut' })
        .to(hand, { scale: 1, opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }
  
  hideTutorial() {
    if (this.tutorialEl.style.display !== 'none') {
      if (this.tutorialAnim) this.tutorialAnim.kill();
      gsap.to(this.tutorialEl, { opacity: 0, duration: 0.3, onComplete: () => {
        this.tutorialEl.style.display = 'none';
      }});
    }
  }

  // --- Interaction --- //
  resetIdleTimer() {
    if (this._idleTimer) clearTimeout(this._idleTimer);
    if (this.state.foundWords.size === this.state.level?.words.length) return; // game over
    
    this._idleTimer = setTimeout(() => {
        this.showHint();
    }, 10000); // 10 seconds
  }

  showHint() {
    if (this.state.isDragging) return;
    
    // Find an un-found word
    const expectedWords = this.state.level.words;
    const missingWord = expectedWords.find(w => !this.state.foundWords.has(w));
    if (!missingWord) return;
    
    // Find its positions
    const wordObj = this.state.board.placedWords.find(pw => pw.word === missingWord);
    if (wordObj && wordObj.positions.length > 0) {
        this.state.idleHintsUsed++;
        // Shake the first letter
        const startPos = wordObj.positions[0];
        const el = this.getTileElement(startPos.r, startPos.c);
        if (el) {
            el.classList.add('hint-shake');
            setTimeout(() => el.classList.remove('hint-shake'), 600);
        }
    }
    this.resetIdleTimer();
  }

  getTileFromEvent(e) {
    const touch = e.touches ? e.touches[0] : e;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('letter-tile')) {
        return {
            r: parseInt(el.dataset.r),
            c: parseInt(el.dataset.c),
            el: el
        };
    }
    return null;
  }

  onPointerDown(e) {
    const tile = this.getTileFromEvent(e);
    if (!tile) return;

    this.resetIdleTimer();
    this.hideTutorial();

    this.sound.init(); // ensure active
    if (e.currentTarget && typeof e.currentTarget.setPointerCapture === 'function') {
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    
    this.state.isDragging = true;
    this.state.activePointerId = e.pointerId;
    this.state.startTile = tile;
    this.state.currentPath = [tile];
    this.state.currentDirection = null;
    this.sound.select();
    this.highlightPath();
  }

  onPointerMove(e) {
    if (!this.state.isDragging) return;
    if (this.state.activePointerId !== null && e.pointerId !== this.state.activePointerId) return;
    e.preventDefault(); // prevent scrolling
    const tile = this.getTileFromEvent(e);
    if (!tile) return;
    
    const path = this.state.currentPath;
    const last = path[path.length - 1];

    const existingIndex = path.findIndex(p => p.r === tile.r && p.c === tile.c);
    if (existingIndex !== -1) {
      if (existingIndex === path.length - 1) return;
      path.splice(existingIndex + 1);
      this.state.currentDirection = path.length >= 2
        ? this.getStepBetween(path[path.length - 2], path[path.length - 1])
        : null;
      this.state.pathHasCrossing = false;
      this.sound.select();
      this.highlightPath();
      this.resetIdleTimer();
      return;
    }

    const step = this.getStepBetween(last, tile);
    if (!step) return;
    if (this.state.currentDirection && (step.dr !== this.state.currentDirection.dr || step.dc !== this.state.currentDirection.dc)) {
      return;
    }

    let nextR = last.r + step.dr;
    let nextC = last.c + step.dc;
    while (nextR !== tile.r || nextC !== tile.c) {
      path.push({ r: nextR, c: nextC });
      nextR += step.dr;
      nextC += step.dc;
    }
    path.push({ r: tile.r, c: tile.c });
    this.state.currentDirection = step;
    this.state.pathHasCrossing = false;
    this.sound.select();
    this.highlightPath();
    this.resetIdleTimer();
  }

  _pathHasDuplicates(path) {
    const seen = new Set();
    for (const p of path) {
      const key = p.r * 1000 + p.c;
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  }

  getStepBetween(from, to) {
    const dr = to.r - from.r;
    const dc = to.c - from.c;
    if (dr === 0 && dc === 0) return null;

    const absDr = Math.abs(dr);
    const absDc = Math.abs(dc);
    const isStraight = dr === 0 || dc === 0 || absDr === absDc;
    if (!isStraight) return null;

    return {
      dr: Math.sign(dr),
      dc: Math.sign(dc)
    };
  }

  pathsMatch(pathA, pathB) {
    if (!pathA || !pathB || pathA.length !== pathB.length) return false;
    for (let i = 0; i < pathA.length; i++) {
      if (pathA[i].r !== pathB[i].r || pathA[i].c !== pathB[i].c) return false;
    }
    return true;
  }

  findMatchedWord(path) {
    if (!this.state.board) return null;

    for (const placedWord of this.state.board.placedWords) {
      if (this.state.foundWords.has(placedWord.word)) continue;
      if (this.pathsMatch(path, placedWord.positions)) return placedWord.word;
      if (this.pathsMatch(path, [...placedWord.positions].reverse())) return placedWord.word;
    }

    return null;
  }

  onPointerUp(e) {
    if (!this.state.isDragging) return;
    if (this.state.activePointerId !== null && e.pointerId !== this.state.activePointerId) return;
    this.state.isDragging = false;
    this.state.activePointerId = null;
    
    const text = this.findMatchedWord(this.state.currentPath);
    const found = Boolean(text);
    
    if (found) {
        this.sound.found();
        this.state.foundWords.add(text);
        
        // Assign rotating color
        const colorIdx = this.state.svgLines.length % WORD_COLORS.length;
        const colorClass = `word-color-${WORD_COLORS[colorIdx]}`;
        
        // Mark UI list with color
        const wordEl = document.getElementById(`word-${text}`);
        wordEl.classList.add('found', colorClass);
        
        // Save full path in SVG with color
        this.state.svgLines.push({ path: [...this.state.currentPath], colorIndex: colorIdx });
        
        // Trigger tile animations with color
        this.state.currentPath.forEach(p => {
          const key = `${p.r},${p.c}`;
          this.state.tileWordCounts[key] = (this.state.tileWordCounts[key] || 0) + 1;
          const el = this.getTileElement(p.r, p.c);
          
          if (this.state.tileWordCounts[key] >= 2) {
            // Shared tile: remove any single-word color and apply shared style
            el.classList.remove('word-color-yellow', 'word-color-purple', 'word-color-lightblue');
            el.classList.add('found', 'word-shared');
          } else {
            el.classList.add('found', colorClass);
          }
          gsap.fromTo(el, {scale: 1.2}, {scale: 1, duration: 0.3, ease: 'bounce.out'});
        });
        
        this.checkWin();
    } else {
        if(this.state.currentPath.length > 1) {
          this.sound.error();
          this.state.mistakeCount++;
        }
    }
    
    // Reset selection
    this.state.currentPath = [];
    this.state.currentDirection = null;
    this.state.pathHasCrossing = false;
    this.highlightPath(); // clears selection
  }

  highlightPath() {
    // Reset all selection and crossing
    document.querySelectorAll('.letter-tile').forEach(el => {
      el.classList.remove('selected', 'crossing');
    });
    
    const hasCrossing = this.state.pathHasCrossing;
    
    // Highlight current
    this.state.currentPath.forEach(p => {
        const el = this.getTileElement(p.r, p.c);
        if (el) {
          el.classList.add('selected');
          if (hasCrossing) el.classList.add('crossing');
        }
    });
    
    this.updateSVG();
  }

  getTileElement(r, c) {
    return document.querySelector(`.letter-tile[data-r="${r}"][data-c="${c}"]`);
  }

  updateSVG() {
    let html = '';
    
    // Render permanently found lines as polylines with rotating colors
    this.state.svgLines.forEach(line => {
      const points = line.path.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      if (points.length >= 2) {
        const colorClass = `found-line-${WORD_COLORS[line.colorIndex]}`;
        html += `<polyline points="${points.join(' ')}" class="found-line ${colorClass}"></polyline>`;
      }
    });
    
    // Render current drag line as polyline
    if (this.state.currentPath.length > 0) {
      const points = this.state.currentPath.map(p => {
        const c = this.getTileCenter(p.r, p.c);
        return c ? `${c.x},${c.y}` : null;
      }).filter(Boolean);
      if (points.length >= 2) {
        const crossClass = this.state.pathHasCrossing ? ' crossing' : '';
        html += `<polyline points="${points.join(' ')}" class="swipe-line${crossClass}"></polyline>`;
      }
    }
    
    this.svgOverlay.innerHTML = html;
  }

  getTileCenter(r, c) {
    const el = this.getTileElement(r, c);
    if (!el) return null;
    
    const overlayRect = this.svgOverlay.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left - overlayRect.left + rect.width / 2,
        y: rect.top - overlayRect.top + rect.height / 2
    };
  }

  checkWin() {
    if (this.state.foundWords.size === this.state.level.words.length) {
        const elapsedSeconds = (Date.now() - this.state.levelStartedAt) / 1000;
        const result = {
          elapsedSeconds,
          mistakes: this.state.mistakeCount,
          idleHintsUsed: this.state.idleHintsUsed
        };
        result.stars = this.calculateNormalStars(this.state.level, result);
        const recordUpdate = this.recordLevelResult(this.state.level, result);
        this.state.lastWinResult = { ...result, ...recordUpdate };
        const category = CATEGORIES.find(cat => cat.levels.some(level => level.id === this.state.level.id));
        const categoryProgress = category ? this.getCategoryProgress(category) : null;

        // Save stats
        this.updateStats(this.state.foundWords.size);
        // Unlock next level
        this.unlockNextLevel(this.state.level);
        if (this._idleTimer) clearTimeout(this._idleTimer);
        
        // Hide overlay lines
        this.svgOverlay.style.opacity = '0';
        
        // Make all tiles fall
        const tiles = document.querySelectorAll('.letter-tile');
        tiles.forEach((tile) => {
            setTimeout(() => {
                tile.classList.add('tile-fall');
            }, Math.random() * 400);
        });

        setTimeout(() => {
            this.sound.win();
            this.confetti.burst(150);
            
            document.getElementById('win-words-found').textContent = this.state.foundWords.size;
            document.getElementById('win-time').textContent = this.formatDuration(result.elapsedSeconds);
            document.getElementById('win-mistakes').textContent = this.state.mistakeCount;
            document.getElementById('win-hints').textContent = this.state.idleHintsUsed;
            document.getElementById('win-best-time').textContent = this.formatDuration(this.state.lastWinResult.record.bestTime);
            document.getElementById('win-stars').innerHTML = this.renderStars(result.stars);
            document.getElementById('win-record-note').textContent = this.state.lastWinResult.isNewBestTime
              ? 'New best time!'
              : this.state.lastWinResult.isNewStarRecord
                ? 'New star rating!'
                : `Best stars: ${this.state.lastWinResult.record.stars}/3`;
            document.getElementById('win-collection-note').textContent = categoryProgress?.isPerfected
              ? `${category.name} collection perfected`
              : categoryProgress?.isComplete
                ? `${category.name} collection mastered`
                : '';
            document.getElementById('win-replay-prompt').textContent = this.getNormalReplayLabel(this.state.lastWinResult.record);
            this.switchScreen('win');
        }, 1200);
    }
  }
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  window.game = new GameEngine();
});

// Update SVG when resizing window
window.addEventListener('resize', () => {
   if (window.game && window.game.state.board) {
        window.game.refreshBoardLayout();
    }
});

window.visualViewport?.addEventListener('resize', () => {
   if (window.game && window.game.state.board) {
       window.game.refreshBoardLayout();
   }
});
