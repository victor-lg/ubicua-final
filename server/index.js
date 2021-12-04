const express = require('express');
const app = express();
const {Server} = require("socket.io");
const server = require("http").createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


server.listen(3000, () => console.log('server started'));