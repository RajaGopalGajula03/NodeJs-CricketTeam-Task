CREATE TABLE cricket_team(player_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,player_name TEXT,jersey_number INTEGER,role TEXT);

PRAGMA TABLE_INFO(cricket_team);

select * from cricket_team;