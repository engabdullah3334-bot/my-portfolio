/**
 * Tech stack icon registry.
 *
 * Each entry has either:
 *  - `src`   → Devicon CDN image (real logo)
 *  - `emoji` → fallback for techs without a Devicon
 *
 * `invert: true` → applies CSS filter for icons that are black on transparent
 * `color`        → accent color used for emoji-badge background tint
 */

export const TECH_ICONS = {
  /* ── Languages ─────────────────────────────── */
  Python: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  'C / C++': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  },
  JavaScript: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },

  /* ── Backend / DB ───────────────────────────── */
  Flask: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
    invert: true,
  },
  MongoDB: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  },
  SQLite: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  },
  JWT: {
    emoji: '🔐',
    color: '#EF4444',
  },

  /* ── AI / ML ────────────────────────────────── */
  'LLaMA 3': {
    emoji: '🦙',
    color: '#7C3AED',
  },
  'NLLB-200': {
    emoji: '🌍',
    color: '#0EA5E9',
  },
  HuggingFace: {
    emoji: '🤗',
    color: '#FBBF24',
  },
  'Gemini API': {
    emoji: '✨',
    color: '#8B5CF6',
  },
  Grok: {
    emoji: '⚡',
    color: '#F59E0B',
  },
  Ollama: {
    emoji: '🤖',
    color: '#10B981',
  },
  'AI Agents': {
    emoji: '🧠',
    color: '#06B6D4',
  },
  YOLO: {
    emoji: '👁️',
    color: '#EF4444',
  },
  Streamlit: {
    emoji: '📊',
    color: '#FF4B4B',
  },

  /* ── Embedded ───────────────────────────────── */
  Arduino: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg',
  },
  'Circuit Design': {
    emoji: '🔌',
    color: '#10B981',
  },

  /* ── Tools ──────────────────────────────────── */
  'Git / GitHub': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
  PyMuPDF: {
    emoji: '📄',
    color: '#F87171',
  },
  OOP: {
    emoji: '⚙️',
    color: '#6366F1',
  },

  /* ── Fallback ───────────────────────────────── */
  'Stay Tuned': {
    emoji: '🔒',
    color: '#475569',
  },
}

/**
 * Returns icon metadata for a given tech name.
 * Falls back to a letter-badge if the tech is unknown.
 */
export function getTechIcon(name) {
  return TECH_ICONS[name] ?? { emoji: name.charAt(0).toUpperCase(), color: '#64748B' }
}
