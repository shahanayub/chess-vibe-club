import { describe, it, expect, beforeEach } from 'vitest';
import { Chess } from 'chess.js';
import {
  STORAGE_KEY_CURRENT,
  CURRENT_SCHEMA_VERSION,
  loadCurrentGame,
  saveCurrentGame,
  clearCurrentGame,
} from '../src/lib/storage';

// In-memory mock storage implementation for isolated unit testing
function createMockStorage(initialStore = {}) {
  let store = { ...initialStore };

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    getStore: () => store,
  };
}

describe('lib/storage.js persistence and safety (FR-008, NFR-005, TASK-009)', () => {
  let storage;

  beforeEach(() => {
    storage = createMockStorage();
  });

  it('returns null when storage is empty', () => {
    expect(loadCurrentGame(storage)).toBeNull();
  });

  it('saves and restores game state accurately (FR-008, AC-3)', () => {
    const chess = new Chess();
    chess.move('e4');
    chess.move('e5');
    chess.move('Nf3');
    const pgn = chess.pgn();

    // Save
    const saveResult = saveCurrentGame({ pgn, orientation: 'black' }, storage);
    expect(saveResult).toBe(true);

    // Verify raw JSON in storage conforms to database.md schema
    const raw = JSON.parse(storage.getItem(STORAGE_KEY_CURRENT));
    expect(raw.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(raw.pgn).toBe(pgn);
    expect(raw.orientation).toBe('black');
    expect(raw.updatedAt).toBeDefined();

    // Load
    const loaded = loadCurrentGame(storage);
    expect(loaded).not.toBeNull();
    expect(loaded.pgn).toBe(pgn);
    expect(loaded.orientation).toBe('black');

    // Verify chess instance restored from loaded PGN has identical state
    const restoredChess = new Chess();
    restoredChess.loadPgn(loaded.pgn);
    expect(restoredChess.history()).toEqual(['e4', 'e5', 'Nf3']);
    expect(restoredChess.turn()).toBe('b');
    expect(restoredChess.fen()).toBe(chess.fen());
  });

  it('clears saved game on clearCurrentGame (database.md)', () => {
    saveCurrentGame({ pgn: '1. e4', orientation: 'white' }, storage);
    expect(loadCurrentGame(storage)).not.toBeNull();

    clearCurrentGame(storage);
    expect(loadCurrentGame(storage)).toBeNull();
    expect(storage.getItem(STORAGE_KEY_CURRENT)).toBeNull();
  });

  describe('Corrupt storage resilience (NFR-005)', () => {
    it('gracefully handles malformed JSON without crashing', () => {
      storage.setItem(STORAGE_KEY_CURRENT, 'MALFORMED_{{{NOT_JSON');
      const loaded = loadCurrentGame(storage);
      expect(loaded).toBeNull();
    });

    it('rejects storage with incompatible schemaVersion', () => {
      storage.setItem(
        STORAGE_KEY_CURRENT,
        JSON.stringify({
          schemaVersion: 99,
          pgn: '1. e4',
          orientation: 'white',
        })
      );
      const loaded = loadCurrentGame(storage);
      expect(loaded).toBeNull();
    });

    it('rejects storage with unparseable / invalid chess PGN', () => {
      storage.setItem(
        STORAGE_KEY_CURRENT,
        JSON.stringify({
          schemaVersion: 1,
          pgn: '1. INVALID_CHESS_MOVE_THAT_CANNOT_EXIST',
          orientation: 'white',
        })
      );
      const loaded = loadCurrentGame(storage);
      expect(loaded).toBeNull();
    });

    it('rejects storage with non-string pgn field', () => {
      storage.setItem(
        STORAGE_KEY_CURRENT,
        JSON.stringify({
          schemaVersion: 1,
          pgn: 12345,
          orientation: 'white',
        })
      );
      const loaded = loadCurrentGame(storage);
      expect(loaded).toBeNull();
    });

    it('handles storage throwing quota or security errors safely', () => {
      const throwingStorage = {
        getItem: () => {
          throw new Error('Access denied (private browsing / quota)');
        },
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
        removeItem: () => {
          throw new Error('Storage disabled');
        },
      };

      expect(() => loadCurrentGame(throwingStorage)).not.toThrow();
      expect(loadCurrentGame(throwingStorage)).toBeNull();

      expect(() => saveCurrentGame({ pgn: '' }, throwingStorage)).not.toThrow();
      expect(saveCurrentGame({ pgn: '' }, throwingStorage)).toBe(false);

      expect(() => clearCurrentGame(throwingStorage)).not.toThrow();
      expect(clearCurrentGame(throwingStorage)).toBe(false);
    });
  });
});

