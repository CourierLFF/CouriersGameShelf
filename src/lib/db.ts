import Database from 'better-sqlite3';
import { dev } from '$app/environment';

const db = new Database(dev ? 'dev.db' : 'prod.db');

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        release_date TEXT,
        genre TEXT,
        platforms TEXT,
        description TEXT,
        cover_art TEXT);
    `);
    
export default db;