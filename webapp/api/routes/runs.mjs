import express from "express";
import db from "../db/conn.mjs";

const router = express.Router();

router.get("/", async function (req, res) {
  console.log("got get request");
  let collection = await db.collection("runs");
  let result = await collection.find({}).toArray();
  res.send(result).status(200);
});

router.post("/empty", (req, res) => {
  STATE.data = [];
  res.status(200).send("State cleared");
});

router.post("/", async function (req, res) {
  let collection = await db.collection("runs");
  const newRun = req.body;
  newRun.date = new Date();
  let result = await collection.insertOne(newRun);
  res.send(result).status(200);
});

export default router;
