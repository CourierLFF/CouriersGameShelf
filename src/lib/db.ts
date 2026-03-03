import Database from 'better-sqlite3';
import { dev } from '$app/environment';
import type { Game } from './types';
import { formatDate, isValidDateFormat, notifyDiscordBotAdd, notifyDiscordBotChange, notifyDiscordBotRatingChange } from "$lib/utils";
import { error } from '@sveltejs/kit';

const db = new Database(dev ? 'dev.db' : 'prod.db');

db.pragma('journal_mode = WAL');

db.exec(`
    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY,
        igdb_url TEXT,
        name TEXT,
        release_date TEXT,
        description TEXT,
        genres TEXT,
        platforms TEXT,
        cover_art TEXT,
        game_state TEXT DEFAULT 'backlog',
        date_completed TEXT DEFAULT NULL,
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
        `INSERT INTO games (id, igdb_url, name, release_date, description, genres, platforms, cover_art, game_state, date_completed, user_rating) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    let completionDate = '';
    if (state === 'Completed') {
        completionDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
    }

    try {
            const result = gameAdd.run(
            gameData.id,
            gameData.igdb_url,
            gameData.name,
            formatDate(gameData.release_date),
            gameData.description,
            gameData.genres,
            gameData.platforms,
            gameData.cover_art,
            state,
            completionDate,
            user_rating
        );

        notifyDiscordBotAdd(gameData);

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
    let gameStateChange;
    let result;

    if (newState != 'Completed') {
        gameStateChange = db.prepare(
            `UPDATE games SET game_state = ? WHERE id = ?`
        );
        result = gameStateChange.run(newState, gameID);
    } else {
        gameStateChange = db.prepare(
            `UPDATE games SET game_state = ?, date_completed = ? WHERE id = ?`
        );
        result = gameStateChange.run(newState, new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date()), gameID);
    }

    notifyDiscordBotChange(getGamesFromDB().find(game => game.id === gameID) as Game);

    return result;
}

export function changeGameRatingInDB(gameID: number, newRating: number) {
    if (newRating >= 0 && newRating <= 100 && newRating % 5 === 0) {
        const gameRatingChange = db.prepare(
            `UPDATE games SET user_rating = ? WHERE id = ?`
        );

        const result = gameRatingChange.run(newRating, gameID);

        notifyDiscordBotRatingChange(getGamesFromDB().find(game => game.id === gameID) as Game);

        return { error: false, data: result };
    } else {
        return { error: true, message: 'Invalid rating value.' };
    }
}

export function changeCompletionDateInDB(gameID: number, newDate: string) {
    if (isValidDateFormat(newDate)) {
        const gameDateChange = db.prepare(
            `UPDATE games SET date_completed = ? WHERE id = ?`
        );

        const result = gameDateChange.run(newDate, gameID);

        return { error: false, data: result };
    } else {
        return { error: true, message: 'Invalid date format. Expected YYYY-MM-DD.' };
    }
}