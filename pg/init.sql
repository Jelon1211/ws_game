CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    name TEXT,
    level INT DEFAULT 1
);