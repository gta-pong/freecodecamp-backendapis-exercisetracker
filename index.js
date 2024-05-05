const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app
  .route("/users")
  .get(function (req, res) {
    console.log("/users get fired");
    return res.send({ obj: "/users get fired" });
  })
  .post(function (req, res) {
    console.log("/users post fired");
    return res.send({ obj: "/users post fired" });
  });

app.post("/users/:_id/exercises", function (req, res) {
  console.log("/users/:_id/exercises post fired");
  return res.send({ obj: "/users/:_id/exercises post fired" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
