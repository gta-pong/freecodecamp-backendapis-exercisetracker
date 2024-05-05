require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const User = require("./models/user");

const url = process.env.MONGO_URI;
mongoose.connect(url);
// const db = mongoose.connection;
// console.log(db.collection);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // Connection successful
//   // Accessing specific collection
//   const usersCollection = db.collection('users');
//   // Now you can perform operations on MyCollection
// });
// console.log(usersCollection);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", bodyParser.json());

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
    const newUser = new User({ username: req.body.username});
    console.log(newUser);
    await newUser.save();

    return res.send({ obj: "/users post fired" });
  });

app.post("/api/users/:_id/exercises", function (req, res) {
  console.log("/users/:_id/exercises post fired");

  return res.send({ obj: "/users/:_id/exercises post fired" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
