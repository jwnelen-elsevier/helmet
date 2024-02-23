const express = require("express");
const getConnection = require("../db/conn").getConnection;
const router = express.Router();

router.get("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("projects");
  let result = await collection.find({}).sort({ date: -1 }).toArray();
  res.status(200).send(result);
});

router.post("/", async function (req, res) {
  let db = await getConnection();
  let collection = await db.collection("projects");
  const newProject = req.body;
  date = new Date();
  newProject.date = date;
  let result = await collection.insertOne(newProject);
  if (result.acknowledged === false) {
    res.status(500).send("Failed to create project");
    return;
  }
  newProject._id = result.insertedId;
  res.status(200).send(newProject);
});

module.exports = router;
