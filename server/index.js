const { on } = require('events');
const express = require('express');
const { emit } = require('process');
const app = express();
const server = require("http").Server(app);

const users = [];

const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

io.on("connection", function (socket) {
    // console.log("User Connected: " + socket.id);
    var role;
    var userID = socket.id;

    //Register user and send to users connected
    socket.on("register", function (data) {
        role = data;
        console.log("New User: " + role);
        var newUser = {
        role: data,
        id: socket.id
        }
        users.push(newUser);

        for (var i = 0; i < users.length; i++) {
          if(role === "Mobile"){
            if (users[i].role === "Desktop") {
              io.to(users[i].id).emit("newUser");
            }
          } else if(role === "Desktop") {
            if (users[i].role === "Mobile") {
              io.to(users[i].id).emit("newUser");
            }
          }
        }
  });


  socket.on("mensaje", function (data) {
    for (var i = 0; i < users.length; i++) {
      if(role === "Mobile"){
        if (users[i].role === "Desktop") {
          io.to(users[i].id).emit("mensaje2", data);
        }
      } else if(role === "Desktop") {
        if (users[i].role === "Mobile") {
          io.to(users[i].id).emit("mensaje2", data);
        }
      }
    }
});

    //disconect user and delete it
    socket.on('disconnect', function () {
        if (role != undefined) {
          console.log("Disconnect:", role, userID);
          for (var i = 0; i < users.length; i++) {
            if (users[i].id === userID) {
                users.splice(i, 1);
            }
          }
        }
    });
});

server.listen(3500, () => console.log("[Server Started]"));