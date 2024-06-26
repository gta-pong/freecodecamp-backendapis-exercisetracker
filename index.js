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

  // Define test for enterd parameters
  function paramTest(bool) {
    let entered = null;
    if (typeof bool !== "undefined") {
      return true;
    } else {
      return false;
    }
  }

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

  function applyFilterDates(arr, from, to, limit) {
    console.log("applyFilterDates function fired");
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const filteredByDate = arr.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    // console.log(filteredByDate);
    return filteredByDate;
  }

  function applyFilterLimit(arr, from, to, limit) {
    console.log("applyFilterLimit function fired");
    let limitVar = null;
    limit ? (limitVar = limit) : (limitVar = 99);
    const limitedArr = doc.exercises.slice(0, limitVar);
    return limitedArr;
  }

  function applyFilterBoth(arr, from, to, limit) {
    console.log("applyFilterBoth function fired");
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const filteredByDate = arr.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    let limitVar = null;
    limit ? (limitVar = limit) : (limitVar = 99);
    // console.log(limitVar);
    const limitedArr = filteredByDate.slice(0, limitVar);
    return limitedArr;
  }

  let filteredLogsBoth = applyFilterBoth(doc.exercises, from, to, limit);
  let filteredLogsDate = applyFilterDates(doc.exercises, from, to, limit);
  let filteredLogsLimit = applyFilterLimit(doc.exercises, from, to, limit);


  
  let responseObj = {};
  responseObj._id = doc._id;
  responseObj.username = doc.username;
  responseObj.count = count;
  responseObj.log = [];

  //LEFT:Execute conditional array manipulation based on entered params (run it so see console.log responseobj)
  if (
    paramTest(req.query.from) === true &&
    paramTest(req.query.to) === true &&
    paramTest(req.query.limit) === true
  ) {
    console.log("all params");
    responseObj.log = filteredLogsBoth;
    console.log('filteredLogsBoth: ' + responseObj.log);

  } else if (
    (paramTest(req.query.from) === true || paramTest(req.query.to) === true) &&
    paramTest(req.query.limit) === false
  ) {
    console.log("dates but no limit");
    responseObj.log = filteredLogsDate;

    console.log('filteredLogsDate: ' + responseObj.log);

  } else if (
    (paramTest(req.query.from) === false ||
      paramTest(req.query.to) === false) &&
    paramTest(req.query.limit) === true
  ) {
    console.log("limit but no dates");
    responseObj.log = filteredLogsLimit;
    console.log('filteredLogsLimit: ' + responseObj.log);

  } else {
    console.log("no / invalid params");
    responseObj.log = [...doc.exercises]
    console.log('doc.exercises: ' + responseObj.log);
  }
  return res.json(responseObj);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
