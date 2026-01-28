import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});


// temporary game state before db impl

let gameState = {
    phase: "night",
    dayCount: 0,
    players: [
        {id: 1, name: "Ethan", role: "MAFIA", state: "ALIVE", character: "avocado", isbot: false},
        {id: 2, name: "Henry", role: "TOWN", state: "ALIVE", character: "avocado", isbot: true},
        {id: 3, name: "Jason", role: "TOWN", state: "ALIVE", character: "avocado", isbot: true},
        {id: 4, name: "Lang", role: "TOWN", state: "ALIVE", character: "avocado", isbot: true}
    ],
    votes: {},
    story: "",
    
}

//socket represents a single connection from a player
io.on('connection', (socket) => {
    socket.on('gameStart', () => {
        const playerId = 1; 

        // Clear previous listeners to avoid duplicates
        socket.removeAllListeners("request_game_state");
        socket.removeAllListeners("request_player_id");
        socket.removeAllListeners("cast_vote");
        socket.removeAllListeners("kill");

        resetGame();

        socket.emit("joined_game", playerId);
        socket.emit('gameState', gameState);

        socket.on('request_game_state', () => {
            socket.emit('gameState', gameState);
        });

        socket.on('cast_vote', (vote) => {
            gameState.story = "";
            gameState.votes[vote.voterId] = vote.targetId;
            botsPlay();
            io.emit('updateGame', gameState); 

            setTimeout(() => {
                endDay();
            }, 2500);
        });


        socket.on("kill", (data) => {
            console.log("kill registered for:", data.victimID);
            startDay(data.victimID);
        });
    }); 
}); 


function resetGame(){
    gameState.phase = "night";
    gameState.dayCount = 0;
    gameState.votes = {};
    gameState.story = "";
    gameState.players.forEach(p => p.state = "ALIVE");
}


async function startDay(victimID){
        if (gameState.phase === "night") {
            console.log("starting day")

            let report;

            const victimName = gameState.players.find(p => {return p.id == victimID}).name; 
            console.log("generating report")
            //const report = await generateNightReport({victim: victimName});
            report = `${victimName} died XD`
            gameState.players.find(p => {return p.id == victimID}).state = "DEAD"

            const numAlive = gameState.players.filter(p => {return p.state == "ALIVE"}).length;
            const mafiaAlive = gameState.players.filter(p => {return (p.state == "ALIVE" && p.role == "MAFIA")}).length;

            gameState.phase = "day";
            gameState.dayCount++;
            gameState.story = report; 

            if(mafiaAlive == 0) gameEnd(1);
            else if(2 * mafiaAlive >= numAlive) gameEnd(-1);
           

            io.emit("updateGame", gameState);
        }
        else{
            console.log("lmao you messed up why is it calling startDay when its already day")
        }
    }

async function endDay(){
    if (gameState.phase === "day") {
        console.log("ending day")
        const victimID = voteResult(); 

        let report;

        if(victimID.length == 1){
            const victimName = gameState.players.find(p => {return p.id == victimID}).name; 
            console.log("generating report")
            report = `${victimName} was voted out`
            gameState.players.find(p => {return p.id == victimID}).state = "DEAD"
        }
        else{
            report = `no one died`
        }

        const numAlive = gameState.players.filter(p => {return p.state == "ALIVE"}).length;
        const mafiaAlive = gameState.players.filter(p => {return (p.state == "ALIVE" && p.role == "MAFIA")}).length;

        gameState.phase = "night";
        gameState.story = report; 

        if(mafiaAlive == 0) gameEnd(1);
        else if(2 * mafiaAlive >= numAlive) gameEnd(-1);

        io.emit("updateGame", gameState);
    }
    else{
        console.log("lmao you messed up why is it calling startDay when its already day")
    }
}

function gameEnd(ending){
    console.log("GAMEMER OVER 1")
    io.emit("gameEnd", ending);
}

function botsPlay() {


    for(const player of gameState.players){
        if(player.state == "ALIVE" && player.isbot){
            const alivePlayers = gameState.players.filter((p) => {return p.state == "ALIVE" && p.id != player.id});
            const randomIdx = Math.floor(Math.random() * alivePlayers.length);

            gameState.votes[player.id] = alivePlayers[randomIdx].id;
        }
    }

    io.emit('updateGame', gameState)

}

//assumes everyone has voted
function voteResult(){
    let voteCount = {}

    let votedOut = [];
    let mx = 0;

    for(const [voter, target] of Object.entries(gameState.votes)){
        Object.hasOwn(voteCount, target)? voteCount[target]++ : voteCount[target] = 1;

        if(voteCount[target] == mx) votedOut.push(target);
        else if(voteCount[target] > mx){
            mx = voteCount[target];
            votedOut.length = 0;
            votedOut.push(target);
        }
    }

    return votedOut;

}

httpServer.listen(PORT, () => {console.log("Server is running on port " + PORT)})