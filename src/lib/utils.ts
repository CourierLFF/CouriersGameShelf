import type { Game } from "./types";

export function formatDate(seconds: number): string {
    const date = new Date(seconds * 1000);
    
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
}

export function deFormatDate(dateString: string): number {
    if (isValidDateFormat(dateString)   === false) {
        throw new Error(`Invalid date format: ${dateString}. Expected format: YYYY-MM-DD`);
    }

    const splitDate = dateString.split('-');

    const day = Number(splitDate[2]);
    const month = Number(splitDate[1]);
    const year = Number(splitDate[0]);

    if (month < 1 || month > 12) throw new RangeError(`Invalid month: ${month}`);
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (day < 1 || day > daysInMonth) throw new RangeError(`Invalid day: ${day} for month: ${month} and year: ${year}`);

    return Math.floor(Date.UTC(year, month - 1, day) / 1000);
}

export function isValidDateFormat(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
}

export async function notifyDiscordBotAdd(game: Game) {
    try {
        const response = await fetch('http://localhost:8081', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: game.name,
                user_rating: game.user_rating,
                game_state: game.game_state,
                cover_art: game.cover_art,
        })
        });

        if (!response.ok) {
            console.error('Failed to notify Discord bot:', response.statusText);
        }
    } catch (error) {
        console.error('Error notifying Discord bot:', error);
    }
}

export async function notifyDiscordBotRatingChange(game: Game) {
    try {
        const response = await fetch('http://localhost:8081', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: game.name,
                user_rating: game.user_rating,
                game_state: 'Rating Changed',
                cover_art: game.cover_art,
        })
        });

        if (!response.ok) {
            console.error('Failed to notify Discord bot:', response.statusText);
        }
    } catch (error) {
        console.error('Error notifying Discord bot:', error);
    }
}