const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require('cors')
const fileUpload = require('express-fileupload')
const user = require("./routes/user");
const post = require("./routes/post");
const upload = require("./routes/upload");


const options = {
  origin : "http://localhost:3000"
}
const app = express();
app.use(cors())
app.use(fileUpload({useTempFiles:true}))
app.use(express.json())

// -------- DB Config ------//

// go to process.env and get the mongo url
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,

  useUnifiedTopology: true,
});

// when connection occurs execute the function and
mongoose.connection.on("connected", () => {
  console.log("Connected to database"); //display a message
});

// error
mongoose.connection.on("error", (err) => {
  // if there is an error
  console.error(`Failed to connect to database: ${err}`); //display a message
});

// -------- Middlewares------//
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// -------- Routes ------//
app.use("/user", user);
app.use("/user/post", post);
app.use("/user/upload", upload);

module.exports = app;
