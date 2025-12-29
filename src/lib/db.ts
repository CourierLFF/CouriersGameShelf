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
        description TEXT,
        cover_art TEXT,
        game_state TEXT DEFAULT 'backlog');
    `);
    
export default db;

export function getGamesFromDB(): Game[] {
    const dbGameData: Game[] = db.prepare('SELECT * FROM games').all() as Game[];
    return dbGameData;
}

export function addGameToDB(gameData: Game, state: string = 'backlog') {
       const gameAdd = db.prepare(
            `INSERT INTO games (name, release_date, description, cover_art, game_state) 
            VALUES (?, ?, ?, ?, ?)`
        );

        const result = gameAdd.run(
            gameData.name,
            formatDate(gameData.release_date),
            gameData.description,
            gameData.cover_art,
            state
        );

        return result;
}

export function removeGameFromDB(gameID: number) {
    const gameRemove = db.prepare(
        `DELETE FROM games WHERE id = ?`
    );

    const result = gameRemove.run(gameID);

    return result;
}