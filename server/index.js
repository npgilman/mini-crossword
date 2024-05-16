
const generator = require("./CrosswordGenerator/index.js");

const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    console.log("User Connected: " + socket.id);

    socket.on("join_room", (data) => { // called when user joins a game
        socket.nickname = data.username;
        socket.join(data.room); // puts user in room
        console.log("User with ID: " + socket.id + " and username: '" + data.username + "' joined room: '" + data.room + "'");

        const userInfo = {
            username: data.username,
            room: data.room,
            id: data.id
        }

        socket.to(data.room).emit("announce_player", userInfo); // tell users in room someone has joined
    });

    socket.on("send_name", async (data) => {
        console.log(data.fromUsername + " just sent their name.")
        socket.to(data.room).emit("receive_name", data);
    });

    socket.on("send_message", (data) => {
        console.log(data.message);
        io.in(data.room).emit("receive_message", data.message);
    });

    socket.on("send_finish", (data) => {
        console.log(data.username  + " just finished");
        io.in(data.room).emit("receive_winner", data);
    });

    socket.on("start_game", async (data) =>  { // Called when one user in a room presses Start Game
        // Tell other users in room to start the game

        // 1. Generate crossword
        //      not done (call function or something)
            let generatorResults = await generator();
            let clues = generatorResults[1];
            let words = generatorResults[0];
            //console.log(words);
            //console.log(clues);
            // for (let i = 0; i < clues.length; i++)
            // {
            //     console.log("HI");
            //     console.log(((i)%5+1) + ". " + ((i < 5) ? "Across" : "Down") + ": " + clues[i]);
            // }

        // 2. prepare data
        // preparing words
            let answers = [];
            for (let i = 0; i < words.length; i++) {
                let word = "";
                for (let j = 0; j < 5; j++) {
                    word = word + words[i][j];
                }
                //console.log(word);
                answers.push(word.toLowerCase());
            }

        // preparing clues
            let across = [];
            let down = [];
            for (let i = 0; i < clues.length; i++) {
                if (i < 5) {
                    across.push(clues[i]);
                }
                else {
                    down.push(clues[i]);
                }
            }
            //console.log(across);
            //console.log(down);

        const gameData = {
            room: data.room,
            // add crossword answers and clues here
            ans: answers,
            acrossClues: across,
            downClues: down
        }

        // 3. Send Data
        //socket.to(data.room).emit("receive_game_start", gameData);
        io.sockets.in(data.room).emit("receive_game_start", gameData);
    });

    socket.on("send_board", (data) => {
        socket.to(data.room).emit("receive_board", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


server.listen(3001, () => {
    console.log("+==== Server Running :) ====+");
})