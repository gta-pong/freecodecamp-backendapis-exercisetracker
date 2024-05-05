require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const User = require("./models/user");

const url = process.env.MONGO_URI;
mongoose.connect(url);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", bodyParser.json());



// // Connection URL
// const url = process.env.MONGO_URI;
// const client = new MongoClient(url);

// // Database Name
// const dbName = "test";
// const collectionName = "exerciseusers";

// // Define function to connect to mongodb server
// async function main() {
//   await client.connect();
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   const collection = db.collection("collectionName");
//   // Can add more code here:
//   return "done.";
// }

// // Execute server connection
// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Define Endpoints

app
  .route("/api/users")
  .get(function (req, res) {
    console.log("/users get fired");
    return res.send({ obj: "/users get fired" });
  })
  .post(async function (req, res) {
    console.log("/users post fired");
    console.log(req.body.username);

    // try {
    //   const userData = req.body.username;

    //   const db = client.db(dbName);
    //   const usersCollection = db.collection(collectionName);
    //   const result = await usersCollection.insertOne({userData});
    //   res
    //     .status(201)
    //     .json({
    //       message: "User created successfully",
    //       insertedUser: result.ops[0],
    //     });
    // } catch (error) {
    //   console.error("Error inserting user:", error);
    //   res.status(500).json({ message: "Internal server error" });
    // }

    return res.send({ obj: "/users post fired" });
  });

app.post("/api/users/:_id/exercises", function (req, res) {
  console.log("/users/:_id/exercises post fired");

  return res.send({ obj: "/users/:_id/exercises post fired" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
