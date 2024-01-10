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
let STATE = {
  data: defaultData,
  model: {
    givenname: "givenname",
  }, // givenname, modelname and task
};

// Create the express app
var app = express();

//config
app.use(cors());
app.use(express.json());

app.post("/model", (req, res) => {
  console.log("Got a request, model");
  const model = req.body;
  STATE.model = model;
  res.status(200).send("Model updated");
});

app.post("/empty-state", (req, res) => {
  STATE.data = [];
  res.status(200).send("State cleared");
});

app.post("/", function (req, res) {
  const newRun = req.body;
  STATE.data.push(newRun);
  res.send("Saved").status(200);
  console.log("Saved run", STATE);
});

app.get("/", (req, res) => res.status(200).send("Healty!"));

app.get("/compare", (req, res) => {
  console.log("Got a request, comparision");
  res.json(STATE);
});

app.get("/explainer", (req, res) => {
  console.log("Got a request");
  res.json(STATE);
});

//startup
app.listen(port, async (err) => {
  console.log(`listening to localhost:${port}`);
});
