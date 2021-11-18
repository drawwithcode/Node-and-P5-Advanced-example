// create a global variable for socket
let clientSocket;

// create a global variable which will contain the color sent by the server
// we initialize it as white so the sketch can run even if the welcome message is
// not arrived yet
let myColor = "white";

// initialise the socket in preload function
// so it won't be loaded before the setup
function preload() {
  // Create a new connection using socket.io (imported in index.html)
  clientSocket = io();

  // define all the callbacks functions for each incoming message
  clientSocket.on("connect", connectFunction);
  clientSocket.on("welcome", welcomeFunction);
  clientSocket.on("mouseBroadcast", mouseBroadcastFunction);
  clientSocket.on("newUser", newUserFunction);
}

// function run at the firs connection
function connectFunction() {
  console.log("your id:", clientSocket.id);
}

// function run when a welcome message is received from the server
function welcomeFunction(data) {
  myColor = data;
  fill(myColor);
  textAlign(CENTER);
  text("Welcome " + clientSocket.id, width / 2, height / 2);
}

// when a broadcast message come containing data
// about the pointer of another user, draw a circle in that position
function mouseBroadcastFunction(dataReceived) {
  fill(dataReceived.color);
  circle(dataReceived.x, dataReceived.y, 20);
}

// when a new user connects, print a welcome text
function newUserFunction(data) {
  fill(data.color);
  text("New user: " + data.id, width / 2, height / 2);
}

// initialize the sketch
function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  noStroke();
}

// each draw cicle draw a semitransparent background
// to simulate a fade effect
function draw() {
  background(0, 0, 0, 5);
}

function mouseMoved() {
  // when the mouse is moved, draw a circle
  fill(myColor);
  circle(mouseX, mouseY, 10);

  // create an object containing the mouse position
  let message = {
    id: clientSocket.id,
    x: mouseX,
    y: mouseY,
  };

  // send the object to server,
  // tag it as "mouse" event
  clientSocket.emit("mouse", message);
}
