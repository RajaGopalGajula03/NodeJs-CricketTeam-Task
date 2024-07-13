const express = require('express');
const path = require('path');
const {open} = require('sqlite');
const sqlite3 = require('sqlite3');
const app = express();
const port = 4445;
const dbPath = path.join(__dirname,"cricketTeam.db");

app.use(express.json());

let db = null;

const initializeDBAndServer = async()=>{
    try{
        db = await open({
            filename: dbPath,
            driver:sqlite3.Database,
        })
        app.listen(port,(req,res)=>{
            console.log(`DB started \nserver running at ${port}`)
        })
    }
    catch(error)
    {
        console.log(`Internal error ${error.message}`);
        process.exit(1);
    }
}

initializeDBAndServer();


// players api 
app.get("/players",async(req,res)=>{
    try{
        const getPlayerQuery = `SELECT * FROM cricket_team order by player_id`;
        const playerArray = await db.all(getPlayerQuery);
        return res.status(200).send(playerArray);
    }
    catch(error)
    {
        console.log("players",error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// players post api

app.post("/add-player",async(req,res)=>{
    const{player_name,jersey_number,role} = req.body;
    try{
        const addPlayerQuery = `INSERT INTO cricket_team(player_name,jersey_number,role)
        VALUES
        (
        '${player_name}',
        ${jersey_number},
        '${role}'
        );`;
        const player = await db.run(addPlayerQuery);
        const lastId = player.lastID;
        return res.status(200).send(`Player Added Successfully with Id ${lastId}`)
    }
    catch(error)
    {
        console.log("add-player",error.message);
        return res.status(500).send("Internal Server Error");
    }
})

// get specific player

app.get("/players/:playerId",async(req,res)=>{
    const {playerId} = req.params;
    try{
        const getPlayerQuery = `SELECT * FROM cricket_team where player_id = ${playerId};`;
        const player = await db.get(getPlayerQuery);
        return res.status(200).send(player);
    }
    catch(err)
    {
        console.log("players/playerId",err.message);
        return res.status(500).send("Internal Server Error");
    }
})

// update player api

app.put("/player-update/:playerId",async(req,res)=>{
    const {playerId} = req.params;
    const{playerName,jerseyNumber,role} = req.body;
    try{
        const updatePlayerQuery = `update cricket_team set player_name = '${playerName}',jersey_number = ${jerseyNumber},role = '${role}' where player_id = ${playerId};`;
        const updatedPlayer = await db.run(updatePlayerQuery);
        return res.status(200).send(`Player Details Updated With Id ${playerId}`);
    }
    catch(err)
    {
        console.log("player-update",err.message);
        return res.status(500).send("Internal Server Error");
    }
})

// Delete Player

app.delete("/delete-player/:playerId",async(req,res)=>{
    const{playerId} = req.params;
    try{
        const deletePlayerQuery = `DELETE FROM cricket_team where player_id = ${playerId};`;
        const deletedPlayer = await db.run(deletePlayerQuery);
        return res.status(200).send(`Player Removed Successfully with id ${playerId}`);
    }
    catch(err)
    {
        console.log("delete-player",err.message);
        res.status(500).send("Internal Server Error");
    }
})