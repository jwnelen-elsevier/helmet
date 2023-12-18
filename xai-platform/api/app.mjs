import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });
const port = process.env.PORT || 4000;

// Data
import defaultData from "./defaultValues.js";
let STATE = defaultData;

// Create the express app
var app = express();

//config
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Healty!"));

app.get("/explainer", (req, res) => {
  console.log("Got a request");
  res.json(STATE);
});

app.post("/empty-state", (req, res) => {
  STATE = [];
  res.status(200).send("State cleared");
});

app.post("/", function (req, res) {
  const newRun = req.body;
  STATE.push(newRun);
  res.send("Saved").status(200);
});

//startup
app.listen(port, async (err) => {
  console.log(`listening to localhost:${port}`);
});
