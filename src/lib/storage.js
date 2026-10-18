import { Chess } from 'chess.js';

export const STORAGE_KEY_CURRENT = 'chess:v1:current';
export const STORAGE_KEY_ARCHIVE = 'chess:v1:archive';
export const CURRENT_SCHEMA_VERSION = 1;

/**
 * Loads and validates the current game from storage (FR-008, NFR-005, database.md).
 * Returns { pgn, orientation, updatedAt } if valid, or null if missing/corrupt.
 * Never throws exceptions (RULE-006, RULE-011).
 *
 * @param {Storage} [storage] - Optional storage implementation (defaults to window.localStorage)
 * @returns {{ pgn: string, orientation: string, updatedAt: string } | null}
 */
export function loadCurrentGame(
  storage = typeof window !== 'undefined' ? window.localStorage : null
) {
  if (!storage) return null;

  try {
    const raw = storage.getItem(STORAGE_KEY_CURRENT);
    if (!raw) return null;

    const data = JSON.parse(raw);

    // Schema version check (must equal 1 per database.md)
    if (!data || data.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      console.warn('Invalid or unknown storage schemaVersion, falling back to fresh game');
      return null;
    }

    // Validate PGN string
    if (typeof data.pgn !== 'string') {
      return null;
    }

    // Validate that chess.js can load the PGN without throwing
    if (data.pgn.trim() !== '') {
      const testChess = new Chess();
      testChess.loadPgn(data.pgn);
    }

    const orientation = data.orientation === 'black' ? 'black' : 'white';

    return {
      pgn: data.pgn,
      orientation,
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  } catch (err) {
    // Corrupt JSON or invalid chess PGN caught gracefully (NFR-005, RULE-011)
    console.warn('Failed to load current game from storage, falling back to fresh game:', err);
    return null;
  }
}

/**
 * Saves current game to storage per schema in database.md (FR-008, TR-005).
 * Always wrapped in try/catch to handle storage quota / private browsing errors.
 *
 * @param {{ pgn: string, orientation: string }} gameData
 * @param {Storage} [storage]
 * @returns {boolean}
 */
export function saveCurrentGame(
  { pgn = '', orientation = 'white' },
  storage = typeof window !== 'undefined' ? window.localStorage : null
) {
  if (!storage) return false;

  try {
    const payload = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      pgn: typeof pgn === 'string' ? pgn : '',
      orientation: orientation === 'black' ? 'black' : 'white',
      updatedAt: new Date().toISOString(),
    };

    storage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(payload));
    return true;
  } catch (err) {
    console.warn('Failed to save current game to storage:', err);
    return false;
  }
}

/**
 * Clears current game from storage on New Game (database.md Section 5).
 *
 * @param {Storage} [storage]
 * @returns {boolean}
 */
export function clearCurrentGame(
  storage = typeof window !== 'undefined' ? window.localStorage : null
) {
  if (!storage) return false;

  try {
    storage.removeItem(STORAGE_KEY_CURRENT);
    return true;
  } catch (err) {
    console.warn('Failed to clear current game from storage:', err);
    return false;
  }
}
