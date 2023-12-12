//environment variables
require("dotenv").config();

//libraries
const path = require("path");

var express = require("express");
var app = express();
const cors = require("cors");
let STATE = {
  explainerName: "Explainer Name",
};

//config
app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve(__dirname, "..", "public")));

app.get("/explainer", (req, res) => {
  console.log("Got a request");
  res.json(STATE);
});

//startup
app.listen(process.env.WEB_PORT || 3000, async (err) => {
  console.log(`listening to localhost:${process.env.WEB_PORT || 3000}`);
});

app.post("/", function (req, res) {
  newName = req.body;
  STATE = newName;
  res.send("Saved");
});

//fallback to the index file
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});
