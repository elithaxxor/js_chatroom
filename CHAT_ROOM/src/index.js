// npm i socket.io -client
// npm i @socket.io/admin-ui (providea socket-io dashboard)
// [Client SOCK], PORT 3030 . (TCP, as it is a websocket. ) check my github for a UDP chatclient written in python
// sock.emit listents for custom event; the defined function will be pased
// Javascript sockets creates a unique ID for us. This unique id can be used to compartanlize users within groups

import { Socket } from "socket.io";
import { io } from "socket.io-client";
const joinRooomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");
const displayMessage = "";
const { instrument } = require("@Socket.io/admin-ui");

const client_id = "";
const msg_history = [];
const sock = io["http://localhost:3030"];

function displayMessage() {
  let msg = document.createElement("div");
  document.getElementById("message-container").append(div);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  if (message === "" || message === null) return;

  displayMessage(message);
  const message = messageInput.value;
  const room = roomInput.value;
});

// socket handler (socket.emit) to handle cutom events:  (server will listen for 'direct-message)
// socket listener
sock.on("connect", (sock) => {
  console.log(sock.io);
  console.log(sock.readyState); // add conditional here
  displayMessage(
    `[Current Connection]: ${sock.readyState}\n[USER-ID]${sock.id}\n [SERVER]${sock.id}`
  );
});

// listen for message
sock.on("receive-message", (message) => {
  client_id.push(sock.id);
  console.log("Client_id", sock.id);
  console.log("msg size : \n ", sock.bufferedAmount);
  displayMessage(message);
});

// event listener with a hook to join invidiual rooms.  socket keys are automatically set in jS sockets

joinRoomButton.addEventListener("click", () => {
  const room = roomInput.value;
  sock.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

//(User input)
// event listener, in (.form) simular to onSubmit()- preventDefault so ui does not overtly refresh
// establish direct-message through thi event litener.
form.addEventListener("submit", (e) => {
  // takes input from user.
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  console.log("Room", room, "buffered: \n ", sock.bufferedAmount);
  if (message === "") return;
  displayMessage(message);
  let broadcast_result = message.includes("$broadcast");
  if (broadcast_result) {
    sock.emit("direct-message", message, room);
    msg_history.push(sock.id);
    console.log(`${sock.id} ${message} History ${msg_history.length}`);
  } else {
    console.log(`request to broadcast message by: ${sock.id} 
    \n message: \n
    ${message} `);
    io.sock.broadcast(message);
    displayMessage(message);
  }
});
