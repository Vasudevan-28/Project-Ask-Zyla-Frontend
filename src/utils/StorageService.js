// src/utils/StorageService.js
import seedData from "../data/seedData";

const LS_KEY = "askzyla_v1";

function deepClone(v){ return JSON.parse(JSON.stringify(v)); }

/**
 * Ensure todos structure is normalized:
 * - todos is an object keyed by ISO dates
 * - each value is an array of items with { id, text, checked(boolean), isDefault? }
 */
function normalizeTodos(rawTodos){
  if(!rawTodos || typeof rawTodos !== "object") return {};
  const out = {};
  for(const k of Object.keys(rawTodos)){
    const arr = Array.isArray(rawTodos[k]) ? rawTodos[k] : [];
    out[k] = arr.map(it => {
      if(!it || typeof it !== "object") return null;
      return {
        id: String(it.id || `${k}-u-${Date.now()}`),
        text: String(it.text || ""),
        checked: Boolean(it.checked),
        isDefault: Boolean(it.isDefault)
      };
    }).filter(Boolean);
  }
  return out;
}

function read(){
  try {
    const raw = localStorage.getItem(LS_KEY);
    if(!raw){
      // write seed data and return a deep clone
      const copy = deepClone(seedData || {});
      // normalize todos before saving
      copy.todos = normalizeTodos(copy.todos || {});
      localStorage.setItem(LS_KEY, JSON.stringify(copy));
      return deepClone(copy);
    }
    const parsed = JSON.parse(raw);
    // normalize structure to avoid old/broken copies
    parsed.todos = normalizeTodos(parsed.todos || {});
    // ensure other keys exist
    parsed.routines = parsed.routines || { morning: [], afternoon: [], evening: [] };
    parsed.streak = parsed.streak || { currentStreak: 0, lastStreakDate: null };
    parsed.settings = parsed.settings || { theme: "dark", notificationsEnabled: false };
    return deepClone(parsed);
  } catch(e){
    console.error("Storage read error", e);
    const copy = deepClone(seedData || {});
    copy.todos = normalizeTodos(copy.todos || {});
    localStorage.setItem(LS_KEY, JSON.stringify(copy));
    return deepClone(copy);
  }
}

function write(obj){
  localStorage.setItem(LS_KEY, JSON.stringify(obj));
}

export default {
  getState(){
    return read();
  },
  saveState(state){
    write(state);
  },

  // convenience helpers
  getTodos(){
    const s = read();
    return s.todos || {};
  },
  setTodos(todos){
    const s = read();
    s.todos = normalizeTodos(todos || {});
    write(s);
  },

  getRoutines(){
    const s = read();
    return s.routines || {morning:[], afternoon:[], evening:[]};
  },
  setRoutines(routines){
    const s = read();
    s.routines = routines || {morning:[], afternoon:[], evening:[]};
    write(s);
  },

  getStreak(){
    const s = read();
    return s.streak || {currentStreak:0, lastStreakDate: null};
  },
  setStreak(streak){
    const s = read();
    s.streak = streak;
    write(s);
  },

  getSettings(){
    const s = read();
    return s.settings || {theme:'dark', notificationsEnabled: false};
  },
  setSettings(settings){
    const s = read();
    s.settings = settings;
    write(s);
  }
};
