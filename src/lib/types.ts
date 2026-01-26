export type Game = {
    id: number;
    igdb_url: string;
    name: string;
    release_date: number;
    description: string;
    genres: string;
    platforms: string;
    cover_art: string; 
    game_state: string;
    date_completed: string;
    user_rating: number;
};

export type CoverData = {
    gameID: number;
    coverURL: string;
}