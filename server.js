console.log("hello world!");

const { Socket } = require("engine.io");
// load express
let express = require("express");

// create an app
let app = express();

let port = process.env.PORT || 3000;

let server = app.listen(port);

console.log("running server on http://localhost:" + port);

app.use(express.static("public"));

let serverSocket = require("socket.io");

let io = serverSocket(server);

io.on("connection", newConnection);

let userColors = {};

function newConnection(newSocket) {
  // log the connection
  console.log("new connection:", newSocket.id);
  // generate a color
  // function taken from https://css-tricks.com/snippets/javascript/random-hex-color/
  let newColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  // add the color to the userColor object
  userColors[newSocket.id] = newColor;

  // send the color code
  io.to(newSocket.id).emit("welcome", newColor);

  // tell to all the others that a new user connectd
  newSocket.broadcast.emit("newUser", { id: newSocket.id, color: newColor });

  // when a message called "mouse" is received from one of the client,
  // call the incomingMouseMessage function
  newSocket.on("mouse", incomingMouseMessage);

  function incomingMouseMessage(dataReceived) {
    // add to the data the colour
    dataReceived.color = userColors[dataReceived.id];
    // send it to all the clients
    newSocket.broadcast.emit("mouseBroadcast", dataReceived);
  }
}
