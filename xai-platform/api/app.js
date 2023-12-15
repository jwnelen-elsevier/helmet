//environment variables
require("dotenv").config();

//libraries
const path = require("path");
const port = process.env.PORT || 4000;

var express = require("express");
var app = express();
const cors = require("cors");
let STATE = [
  {
    text: "This is a test, you can at least see how it would look like",
    fAttribution: [0, 1, 0, 0.5, 0, 0, 0.1, 0, 0.8, 0, 0, 0, 0, 0, 0.6, 0],
    metaData: {
      model: "BERT",
      prompt: "prompt 1",
      date: new Date("2021-04-02"),
    },
  },
  {
    text: "This is a test, you can at least see how it would look like",
    fAttribution: [0, 0.4, 0, 0.5, 0, 0, 1, 0, 0.8, 0, 0, 0, 0, 0, 0.6, 1],
    metaData: {
      model: "Other Model",
      prompt: "prompt 2",
      date: new Date("2021-04-01 12:00:00"),
    },
  },
];

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
  res.send("Saved").status(200);
});

//fallback to the index file
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
// });

//startup
app.listen(port, async (err) => {
  console.log(`listening to localhost:${port}`);
});
