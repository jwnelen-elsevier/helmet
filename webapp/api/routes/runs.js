const express = require("express");
// const db = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const getConnection = require("../db/conn").getConnection;
const router = express.Router();

// GET /run
router.get("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  let result = await collection.find({}).toArray();
  res.send(result).status(200);
});

// POST /run
router.post("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  const newRun = req.body;
  // Parsing the date string to a date object
  newRun.date = new Date(newRun.date);
  let result = await collection.insertOne(newRun);
  res.send(result).status(200);
});

// GET /run/:id
router.get("/:id", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  const id = req.params.id;
  let result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result).status(200);
});

// DELETE /run/:id
router.delete("/:id", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  // dbo.collection<{_id: string}>("my-collection").deleteOne({ _id: id }, (err, obj) => {
  let result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  console.log("deleted", result);
  res.send(result).status(200);
});

// DELETE /run
router.delete("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  let result = await collection.deleteMany({});
  res.send(result).status(200);
});

module.exports = router;
