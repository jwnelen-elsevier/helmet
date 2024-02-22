const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const getConnection = require("../db/conn").getConnection;
const router = express.Router();

router.get("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("projects");
  let result = await collection.find({}).sort({ date: -1 }).toArray();
  res.send(result).status(200);
});

router.post("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("projects");
  const newProject = req.body;
  newProject.date = new Date(newProject.date);
  let result = await collection.insertOne(newProject);
  res.send(result).status(200);
});

module.exports = router;
