const express = require("express");
// const db = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;
const getConnection = require("../db/conn").getConnection;
const router = express.Router();

// GET /runs
router.get("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  let result = await collection.find({}).sort({ date: -1 }).toArray();
  res.send(result).status(200);
});

// POST /runs
router.post("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  const newRun = req.body;
  newRun.date = new Date(newRun.date);
  let existingId = newRun?._id;
  let result;
  if (existingId) {
    console.log("existingId", existingId);
    const existingIdObj = new ObjectId(existingId);
    delete newRun._id;
    result = await collection.replaceOne({ _id: existingIdObj }, newRun, {
      upsert: false,
    });
  } else {
    result = await collection.insertOne(newRun);
  }

  res.send(result).status(200);
});

// GET /runs/:id
router.get("/:id", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  const id = req.params.id;
  let result = await collection.findOne({ _id: new ObjectId(id) });
  res.send(result).status(200);
});

// DELETE /runs/:id
router.delete("/:id", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("runs");
  // dbo.collection<{_id: string}>("my-collection").deleteOne({ _id: id }, (err, obj) => {
  let result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  console.log("deleted", result);
  res.send(result).status(200);
});

// DELETE /runs
router.delete("/", async function (req, res) {
  console.log(req.query);

  let db = await getConnection();
  let collection = await db.collection("runs");
  if (req.query.projectId) {
    let result = await collection.deleteMany({
      project_id: req.query.projectId,
    });
    res.send(result).status(200);
  } else {
    let result = await collection.deleteMany({});
    res.send(result).status(200);
  }
});

module.exports = router;
