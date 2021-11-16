let clientSocket = io();

clientSocket.on("connect", newConnection);

function newConnection() {
  console.log("your id:", clientSocket.id);
}

function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  fill("red");
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

clientSocket.on("mouseBroadcast", otherMouse);

function otherMouse(dataReceived) {
  console.log(dataReceived);
  fill("yellow");
  circle(dataReceived.x, dataReceived.y, 20);
}
