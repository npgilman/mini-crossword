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

    socket.on("start_game", (data) =>  { // Called when one user in a room presses Start Game
        // Tell other users in room to start the game

        // 1. Generate crossword
        //      not done (call function or something)

        // 2. prepare data

        const gameData = {
            room: data.room
            // add crossword answers and clues here
        }

        // 3. Send Data
        socket.to(data.room).emit("receive_game_start", gameData);
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