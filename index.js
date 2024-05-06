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
    let allUsers = {}
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
  // console.log(req);
  //LEFT: newExercise is not attaching to existing _id. Find a way to update one 
  //doc's id instead of creating new.
  const newExercise = new Exercise({
    _id: req.body[':_id'],
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
  });
  await newExercise.save();
  // console.log(newExercise);
  let oneUser = await User.find({ _id: req.body[':_id']});
  console.log(oneUser);
  return res.send('testobj');

  // return res.send({ obj: "/users/:_id/exercises post fired" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
