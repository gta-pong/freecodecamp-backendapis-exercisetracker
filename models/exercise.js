let mongoose = require("mongoose");

let exerciseSchema = new mongoose.Schema(
  {
    _id: String,
    description: String,
    duration: Number,
    date: String,
  },
  { collection: "exerciseusers" }
);

module.exports = mongoose.model("Exercise", exerciseSchema);
