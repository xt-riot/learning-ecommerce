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

server.use(async (req, res, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  console.log(`${req.method} ${req.url} - ${duration}ms`);
});

server.use(cors(corsOptions));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));

require("./routes/user.routes.js")(server);

server.listen(port, () => {
  console.log(
    "Server Listening - http://localhost:" +
      port +
      ". " +
      environment +
      " environment"
  );
});
