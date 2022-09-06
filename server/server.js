require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const server = express();
var corsOptions = {
  origin: "http://localhost:5173",
};
var environment = process.env.NODE_ENV || "development";
var port = process.env.NODE_PORT || config.port;

server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

server.listen(port, () => {
  console.log(
    "Server Listening - http://localhost:" +
      port +
      ". " +
      environment +
      " environment"
  );
});
