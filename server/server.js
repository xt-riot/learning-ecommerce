require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const server = express();
var corsOptions = {
  origin: "http://localhost:5173",
  "Access-Control-Allow-Origin": "*",
};
var environment = process.env.NODE_ENV || "development";
var port = process.env.NODE_PORT || 1337;

server.use(async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    await next();
    return;
  }
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  console.log(`${req.method} ${req.url} - ${duration}ms`);
});

// server.use(cors(corsOptions));
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

require("./routes/user.routes.js")(server);

module.exports = server;
