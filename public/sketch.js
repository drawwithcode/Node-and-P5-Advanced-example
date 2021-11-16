// create a global variable for socket
let clientSocket;
//create a global variable which will contain the color sent by the server
let myColor = "white";

// initialise the socket in preload function
// so it won't be loaded before the setup
function preload() {
  clientSocket = io();
  clientSocket.on("connect", newConnection);
  clientSocket.on("welcome", welcomeFunction);
  clientSocket.on("mouseBroadcast", otherMouse);
  clientSocket.on("newUser", welcomeNewUser);
}

// function run when a new user connects
function welcomeNewUser(data) {
  fill(data.color);
  text("New user: " + data.id, width / 2, height / 2);
}

// function run at the firs connection
function newConnection() {
  console.log("your id:", clientSocket.id);
}

// function run when a "welcome message is received from the server
function welcomeFunction(data) {
  myColor = data;

  fill(myColor);
  textAlign(CENTER);
  text("Welcome " + clientSocket.id, width / 2, height / 2);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

function draw() {
  background(0, 0, 0, 5);
  fill(myColor);
  circle(mouseX, mouseY, 10);
}

function mouseMoved() {
  let message = {
    id: clientSocket.id,
    x: mouseX,
    y: mouseY,
  };

  clientSocket.emit("mouse", message);
}

function otherMouse(dataReceived) {
  fill(dataReceived.color);
  circle(dataReceived.x, dataReceived.y, 20);
}
