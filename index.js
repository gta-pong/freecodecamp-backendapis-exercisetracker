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
  // const updatedUser = await User.findOne({ _id: req.body[":_id"] });
  // console.log(req);
  console.log(typeof req.params._id);
  console.log(req.params._id);
  console.log(typeof req.body[":_id"]);
  // const filter = { _id: req.body[":_id"] };
  // const filter = { _id: req.params._id};
  const filter = { _id: req.params._id};
  console.log(filter);
  function checkDate() {
    if (req.body.date) {
      new Date(req.body.date).toDateString();
    } else {
      console.log("default date used");
    }
  }
  const update = {
    description: req.body.description,
    duration: req.body.duration,
    date: checkDate(),
  };

  let doc = await User.findOneAndUpdate(filter, update, { new: true });
  console.log(doc);
  res.json(doc);

//   try {
//     let doc = await User.findOneAndUpdate(filter, update, { new: true });
//     // Handle successful operation
//     //LEFT: i THINK u need to pass in a callback function after the options (new: true);
//     console.log(doc);
//     res.json(doc);
  
// } catch (error) {
//     // Handle error
//     res.status(500).json(error)
// }

//  res.send({ obj: "/users/:_id/exercises post fired" });

});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
