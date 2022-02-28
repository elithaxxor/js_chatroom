import "./styles.css";
import { io } from "socket.io-client";
// [SERVER SOCKET], PORT 3030 . (TCP, as it is a websocket. ) check my github for a UDP chatclient written in python
// sock.on = tcp listener and creates a ock contect manager (listes for connections and handle TCP io).
/*** note: socket is ued on server-side, sock is for clients  ***/

const connected_clients = [];
const msg_history = []; // may need to do str/jsonfify?
const PORT = window.prompt(
  "Enter the port for the server to listen on. \n default params \n\t\t[localhost:3030]"
);
PORT ?? (PORT = "http://localhost:3030");
let local_host = "http://localhost:" + PORT;
let message = "";
let room = "";

alert(`connecting to ${local_host}`);
try {
  const io = require("socket.io")(PORT);
  const socket = require("socket.io")(PORT, {
    cors: {
      origin: [`${local_host}`] // must be list [ ]
    }
  });
  connected_clients.push(socket.id) ||
    alert(
      "unable to establish tcp (SYN). Check port configuration & connection. "
    );
} catch (err) {
  console.log("error in socket io, see readystate below\n", err);
}

// // (this will BROADCAST socks--> sent messages are global will be global
// io.sockets.emit will send to all the clients
// socket.broadcast.emit will send the message to all the other clients except the newly created connection */
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("direct-message"); // listesn for dm from client
  io.emit("BROADCAST", message); //  broadcast.
  console.log(message); // may need to set up a loopback incase theres an erorr for (null) or empty values
  if (!message || message === null) {
    alert("message not received, sending broadcast call.");
    console.log(
      "message is either empty, null theres an error parsing db data"
    );
    socket.broadcast.emit(
      "[SERVER]: A message first must be sent, before it is received."
    );
  } else {
    socket.on("direct-message", (message, callback) => {
      // the callback param
      msg_history.push(socket.id + message);
      console.log("message recvd from", socket.id, "message: \n", message);
      socket.broadcast.to(room).emit(`${socket.id} - ${message}`);
      socket.join(room);
      callback(`joined ${room}`);
      // logic {if !broadcast in message received, then copy message and broadcast to all in chatroom}
      //socket.on("BROADCAST", message);
    });
  }
});
