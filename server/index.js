const server = require("./server.js");

server.listen(process.env.NODE_PORT || 1337, () => {
  console.log(
    "Server Listening - http://localhost:" + process.env.NODE_PORT ||
      1337 + ". " + process.env.NODE_ENV ||
      "development" + " environment"
  );
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception: ", error);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled rejection: ", error);
});
