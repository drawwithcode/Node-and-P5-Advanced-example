console.log("hello world!");

const { Socket } = require("engine.io");
// load express
let express = require("express");

// create an app
let app = express();

// define the port where client files will be provided
let port = process.env.PORT || 3000;

// start to listen to that port
let server = app.listen(port);

// print the link in the termina
console.log("running server on http://localhost:" + port);

// provide static access to the files
// in the "public" folder
app.use(express.static("public"));

// load socket library
let serverSocket = require("socket.io");

// create a socket connection
let io = serverSocket(server);

// define which function should be called
// when a new connection is opened from client
io.on("connection", newConnection);

// creaet the object that will handle users colors
let userColors = {};

// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(newSocket) {
  // log the connection in terminal
  console.log("new connection:", newSocket.id);

  // generate a random hex code
  // function taken from https://css-tricks.com/snippets/javascript/random-hex-color/
  let newColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  // add the color to the userColor object
  // we will add a property named as the id of the client
  // and give as value the new color
  userColors[newSocket.id] = newColor;

  // send the color code
  io.to(newSocket.id).emit("welcome", newColor);

  // tell to all the others that a new user connectd
  newSocket.broadcast.emit("newUser", { id: newSocket.id, color: newColor });

  // when a message called "mouse" is received from one of the client,
  // call the incomingMouseMessage function
  newSocket.on("mouse", incomingMouseMessage);

  // callback function run when the "mouse" message is received
  function incomingMouseMessage(dataReceived) {
    // add to the data the colour
    dataReceived.color = userColors[dataReceived.id];
    // send it to all the clients
    newSocket.broadcast.emit("mouseBroadcast", dataReceived);
  }
}
