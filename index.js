const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require('mongodb');
require("dotenv").config();

// Connection URL
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = 'test';

// Define function to connect to mongodb server
async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('exerciseusers');
  // Can add more code here:

  return 'done.';
};

// Execute server connection
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());


app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/users")
  .get(function (req, res) {
    console.log("/users get fired");
    return res.send({ obj: "/users get fired" });
  })
  .post(function (req, res) {
    console.log("/users post fired");
    return res.send({ obj: "/users post fired" });
  });

app.post("/users/:_id/exercises", function (req, res) {
  console.log("/users/:_id/exercises post fired");
  return res.send({ obj: "/users/:_id/exercises post fired" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
