import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import runs from "./routes/runs.mjs";

const port = process.env.PORT || 4000;

// Create the express app
var app = express();

//config
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("Healty!"));

app.use("/runs", runs);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.");
});

// start the Express server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
