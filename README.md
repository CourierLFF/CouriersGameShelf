# Courier's Game Shelf
Courier's API for tracking and organizing game backlogs and completions.

Still a WIP

Will require an .env file made in the project root that has these lines in it.
```
ADMINUSER="" # Username you want for the app
ADMINPASSWORD="" # Password you want for the app
IGDBID="" # Your IGBD ID
IGDBSECRET="" # Your IGDB Secret
```

## API Routes
This API currently only offers one route, located at /api/getGames. At the moment this is the only route I need for my website so it's the only one implemented. I'll probably make more later.

/api/getGames will simply just return all the games currently in the database.  
Example Response from /api/getGames:

```
[
  {
    "id": 8492,
    "igdb_url": "https://www.igdb.com/games/lisa-the-painful",
    "name": "Lisa: The Painful",
    "release_date": "15-12-2014",
    "description": "Lisa is a quirky side-scrolling RPG set in a post-apocalyptic wasteland. Beneath the charming and funny exterior is a world full of disgust and moral destruction. Players will learn what kind of person they are by being FORCED to make choices. These choices permanently effect the game play. If you want to save a party member from death, you will have to sacrifice the strength of your character. Whether it's taking a beating for them, or chopping off limbs, or some other inhuman way. You will learn that in this world being selfish and heartless is the only way to survive...",
    "genres": "Role-playing (RPG), Turn-based strategy (TBS), Adventure, Indie",
    "platforms": "PC (Microsoft Windows), Linux, Mac",
    "cover_art": "https://images.igdb.com/igdb/image/upload/t_cover_big/co1odr.webp",
    "game_state": "Completed",
    "date_completed": "2026-01-26",
    "user_rating": 100
  },
  {
    "id": 13212,
    "igdb_url": "https://www.igdb.com/games/the-beginners-guide",
    "name": "The Beginner's Guide",
    "release_date": "01-10-2015",
    "description": "A metafictional account of Davey Wreden, creator of the Stanley Parable (2013), who takes the player through the games of his old friend, Coda, while giving his commentary and interpretations of them, in order to understand why he makes the bizarre, often melancholic games that he makes, and decipher Coda's personality and inner struggles.",
    "genres": "Adventure, Indie",
    "platforms": "PC (Microsoft Windows), Linux, Mac",
    "cover_art": "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rz1.webp",
    "game_state": "Completed",
    "date_completed": "2026-01-27",
    "user_rating": 100
  }
]
```
