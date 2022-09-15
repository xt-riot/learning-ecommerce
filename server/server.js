require("dotenv").config();
const express = require("express");
// const path = require('path');
const bodyParser = require("body-parser");
// const cors = require('cors');

const server = express();
// var corsOptions = {
//   origin: "http://localhost:5173",
//   "Access-Control-Allow-Origin": "*",
// };

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
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
// server.use(express.static('public'));

require("./routes/user.routes")(server);

module.exports = server;
