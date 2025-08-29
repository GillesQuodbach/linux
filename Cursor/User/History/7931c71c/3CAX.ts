import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('growing.db');

// Initialize schema
db.execAsync?.(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS plants (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    cultureType TEXT NOT NULL CHECK (cultureType IN ('soil','hydro')),
    photoUri TEXT,
    nextWateringAt INTEGER,
    ph REAL,
    ec REAL,
    createdAt INTEGER
  );
  CREATE TABLE IF NOT EXISTS fertilizers (
    id TEXT PRIMARY KEY NOT NULL,
    plantId TEXT NOT NULL,
    type TEXT NOT NULL,
    quantity REAL NOT NULL,
    unit TEXT DEFAULT 'ml',
    appliedAt INTEGER NOT NULL,
    FOREIGN KEY (plantId) REFERENCES plants(id) ON DELETE CASCADE
  );
`);

