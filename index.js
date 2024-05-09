require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const User = require("./models/user");
const Exercise = require("./models/exercise");

const url = process.env.MONGO_URI;
mongoose.connect(url);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", bodyParser.json());
app.use("/api/users/:_id/exercises", bodyParser.json());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Define Endpoints

app
  .route("/api/users")
  .get(async function (req, res) {
    console.log("/users get fired");
    let allUsers = {};
    allUsers = await User.find({});
    return res.send(allUsers);
  })
  .post(async function (req, res) {
    console.log("/users post fired");
    const newUser = new User({ username: req.body.username });
    await newUser.save();
    return res.send({ username: newUser.username, _id: newUser._id });
  });

app.post("/api/users/:_id/exercises", async function (req, res) {
  console.log("/users/:_id/exercises post fired");
  const filter = { _id: req.params._id };

  function checkDate() {
    if (req.body.date) {
      return new Date(req.body.date).toDateString();
    } else {
      console.log("default date used");
    }
  }

  const update = {
    $push: {
      exercises: new Exercise({
        description: req.body.description,
        duration: req.body.duration,
        date: checkDate(),
      }),
    },
  };

  let doc = await User.findOneAndUpdate(filter, update, { new: true });
  let responseObj = {};
  responseObj._id = doc._id;
  responseObj.username = doc.username;
  responseObj.description = update.$push.exercises.description;
  responseObj.duration = update.$push.exercises.duration;
  responseObj.date = update.$push.exercises.date;
  return res.status(200).json(responseObj);
});

app.get("/api/users/:_id/logs", async function (req, res) {
  console.log("/api/users/:_id/logs was hit");

  // Query by _id and count exercises

  const filter = { _id: req.params._id };
  let doc = await User.findOne(filter).exec();
  let count = doc.exercises.length;

  // Filter Exercises:

  // Redefine query parameters

  let from = req.query.from;
  let to = req.query.to;
  let limit = parseInt(req.query.limit);

  // Define new filteredArr

  let filteredArr = null;
  filteredArr = [...doc.exercises];

  // Define and execute query parameters to filteredArr

  function applyFilter(arr, from, to, limit) {
    console.log("applyFilter function fired");
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const filteredByDate = arr.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    const limitedArr = filteredByDate.slice(0, limit);
    return limitedArr;
  }

  // console.log(applyFilter(doc.exercises, from, to, limit));
  let filteredLogs = applyFilter(doc.exercises, from, to, limit);

  console.log(Object.keys(req.query).length);

  let responseObj = {};
  responseObj._id = doc._id;
  responseObj.username = doc.username;
  responseObj.count = count;
  responseObj.log = doc.exercises;
  responseObj.log = Object.keys(req.query).length === 0 ? doc.exercises : filteredLogs;
  // console.log(responseObj);
  return res.json(responseObj);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
