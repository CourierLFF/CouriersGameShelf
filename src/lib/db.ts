import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import type { Game } from './types';
import { formatDate } from "$lib/utils";

const db = new Database(dev ? 'dev.db' : 'prod.db');

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        release_date TEXT,
        genre TEXT,
        platforms TEXT,
        description TEXT,
        cover_art TEXT);
    `);
    
export default db;

export function getGamesFromDB(): Game[] {
    const dbGameData: Game[] = db.prepare('SELECT * FROM games').all() as Game[];
    return dbGameData;
}

export function addGameToDB(gameData: Game) {
       const gameAdd = db.prepare(
        `INSERT INTO games (name, release_date, genre, platforms, description, cover_art) 
         VALUES (?, ?, ?, ?, ?, ?)`
    );

        gameAdd.run(
            gameData.name,
            formatDate(gameData.release_date),
            JSON.stringify(gameData.genre),
            JSON.stringify(gameData.platforms),
            gameData.description,
            gameData.cover_art
        );
}