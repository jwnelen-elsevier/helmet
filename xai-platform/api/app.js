// import "./loadEnvironment.mjs";
// import runs from "./routes/runs.mjs";
const http = require("http");
const port = process.env.PORT || 4000;
const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");

// const state = {
//   state: "idle",
//   model: {
//     name: null,
//     checkpoint: null,
//   },
// };

// Create the express app
var app = express();
app.use(cors());

const io = new Server(app.Server, {
  port: 3001,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  socket.on("chat message", (message) => {
    io.emit("chat message", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.listen(3001, () => {
  console.log("WebSocket server listening on port 3001");
});

//config
// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => res.status(200).send("Healty!"));

// app.post("/update_model", (req, res) => {
//   console.log(req.data);

//   res.status(200).send("Updated!");
// });

// app.get("/model", (req, res) => {
//   res.status(200).send(state.model);
// });

// app.use("/runs", runs);

// // Global error handling
// app.use((err, _req, res, next) => {
//   res.status(500).send("Uh oh! An unexpected error occured.");
// });

// // start the Express server
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });
