let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  username: String,
}, 
{ collection: 'exerciseusers'});

module.exports = mongoose.model("User", userSchema);
