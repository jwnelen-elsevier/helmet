//environment variables
require("dotenv").config();

//libraries
const path = require("path");
const port = process.env.PORT || 4000;

var express = require("express");
var app = express();
const cors = require("cors");
let STATE = {
  explainerName: "Explainer Name",
};

//config
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/explainer", (req, res) => {
  console.log("Got a request");
  res.json(STATE);
});

app.post("/", function (req, res) {
  newName = req.body;
  STATE = newName;
  res.send("Saved");
});

//fallback to the index file
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
// });

//startup
app.listen(port, async (err) => {
  console.log(`listening to localhost:${port}`);
});
