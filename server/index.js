const { on } = require('events');
const express = require('express');
const { emit } = require('process');
const app = express();
const server = require("http").Server(app);

const connections = [];

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", function (socket) {
  // console.log("new connection" + socket.id)
  var role;
  var userID;
  var email;

  //Register DESKTOP and send to users connected
  socket.on("registerDesktop", function (data) {
    if (data) {
      role = "Desktop";
      userID = socket.id;
      email = data;

      console.log("New Desktop User:", data);

      var find = false;
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].email === data) {
          connections[i].DesktopId = socket.id;
          io.to(connections[i].MobileId).emit("newUser");
          io.to(connections[i].DesktopId).emit("oldUser");
          find = true;
        }
      }
      if (!find) {
        var newPair = {
          email: data,
          DesktopId: socket.id,
          MobileId: null
        }
        connections.push(newPair);
      }
      console.log(connections);
    }
  });

  //Register MOBILE and send to users connected
  socket.on("registerMobile", function (data) {
    if (data) {
      role = "Mobile";
      userID = socket.id;
      email = data;
      console.log("New Mobile User:", data);

      var find = false;
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].email === data) {
          connections[i].MobileId = socket.id;
          io.to(connections[i].DesktopId).emit("newUser");
          io.to(connections[i].MobileId).emit("oldUser");
          find = true;
        }
      }
      if (!find) {
        var newPair = {
          email: data,
          DesktopId: null,
          MobileId: socket.id
        }
        connections.push(newPair);
      }
      console.log(connections);
    }
  });


  socket.on("action", function (data) {
    console.log("Accion:",data);
    for (var i = 0; i < connections.length; i++) {
      if (role === "Mobile") {
        if (connections[i].email === email) {
          io.to(connections[i].DesktopId).emit("doAction", data);
        }
      } else if (role === "Desktop") {
        if (connections[i].email === email) {
          io.to(connections[i].MobileId).emit("doAction", data);
        }
      }
    }
  });

  //disconect user and delete it
  socket.on('disconnect', function () {
    if (userID != undefined) {
      console.log("Disconnect:", email);
      for (var i = 0; i < connections.length; i++) {
        if (connections[i].DesktopId === userID) {
          connections[i].DesktopId = null;
          io.to(connections[i].MobileId).emit("disconnectPartner");
        }
        if (connections[i].MobileId === userID) {
          connections[i].MobileId = null;
          io.to(connections[i].DesktopId).emit("disconnectPartner");
        }
      }
      console.log(connections);
    }
  });
});

server.listen(3500, () => console.log("[Server Started]"));