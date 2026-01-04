import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import type { Game } from './types';
import { formatDate } from "$lib/utils";
import { error } from '@sveltejs/kit';

const db = new Database(dev ? 'dev.db' : 'prod.db');

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        name TEXT,
        release_date TEXT,
        description TEXT,
        genres TEXT,
        platforms TEXT,
        cover_art TEXT,
        game_state TEXT DEFAULT 'backlog',
        user_rating INTEGER);
    `);
    
export default db;

export function getGamesFromDB(): Game[] {
    const dbGameData: Game[] = db.prepare('SELECT * FROM games').all() as Game[];
    return dbGameData;
}

export function addGameToDB(gameData: Game, state: string = 'backlog', user_rating: number = 0) {

    const existingGame = db.prepare('SELECT id FROM games WHERE id = ?').get(gameData.id);
    if (existingGame) {
        return { error: true, message: 'Game already being tracked.' };
    }

    const gameAdd = db.prepare(
        `INSERT INTO games (id, name, release_date, description, genres, platforms, cover_art, game_state, user_rating) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    try {
            const result = gameAdd.run(
            gameData.id,
            gameData.name,
            formatDate(gameData.release_date),
            gameData.description,
            gameData.genres,
            gameData.platforms,
            gameData.cover_art,
            state,
            user_rating
        );

        return { error: false, success: true, data: result };
    } catch (error) {
        return { error: true, message: 'Failed to add game to database.' };
    }
}

export function removeGameFromDB(gameID: number) {
    const gameRemove = db.prepare(
        `DELETE FROM games WHERE id = ?`
    );

    const result = gameRemove.run(gameID);

    return result;
}

export function changeGameStateInDB(gameID: number, newState: string) {
    const gameStateChange = db.prepare(
        `UPDATE games SET game_state = ? WHERE id = ?`
    );

    const result = gameStateChange.run(newState, gameID);

    return result;
}   