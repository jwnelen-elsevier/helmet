const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let _conn = null;

const getConnection = async () => {
  if (_conn == null) {
    _conn = await connect();
    return _conn;
  }
  return _conn;
};

const connect = async () => {
  try {
    const conn = await client.connect();
    console.log("Connected to the database");
    return conn.db("sample_training");
  } catch (e) {
    console.error(e);
    return null;
  }
};

exports.getConnection = getConnection;
