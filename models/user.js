let mongoose = require("mongoose");


let userSchema = new mongoose.Schema(
  {
    username: String,
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
  { collection: "exerciseusers",
    versionKey:false,
   }
);

module.exports = mongoose.model("User", userSchema);
