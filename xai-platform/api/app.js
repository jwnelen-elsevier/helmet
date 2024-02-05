const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();

// import runs from "./routes/runs.mjs";

const port = process.env.PORT || 4000;

// Create the express app
var app = express();

//config
app.use(cors());
app.use(bodyParser.json());

const State = require("./state");
const s = new State();

app.get("/status", (req, res) => {
  console.log("polled");
  res.send("OK");
});

app.get("/model", (req, res) => {
  const m = s.getState();
  res.send(m);
});

app.post("/update_model", (req, res) => {
  console.log(req.body);
  s.setModel(req.body);
  res.status(200).send("Updated!");
});

// app.get("/model", (req, res) => {
//   res.status(200).send(state.model);
// });

// app.use("/runs", runs);

// Global error handling
app.use((err, _req, res, next) => {
  console.log("error", err);
  res.status(500).send("An unexpected error occured.");
});

// // start the Express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
