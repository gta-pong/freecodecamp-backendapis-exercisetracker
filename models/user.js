let mongoose = require("mongoose");

let exerciseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      default: ".",
    },
    duration: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: () => new Date().toDateString(),
    },
  },
  { collection: "exerciseusers", versionKey: false }
);

let userSchema = new mongoose.Schema(
  {
    username: String,
    exercises: {
      type: [exerciseSchema],
    },
  },
  { collection: "exerciseusers", versionKey: false }
);

module.exports = mongoose.model("User", userSchema);
