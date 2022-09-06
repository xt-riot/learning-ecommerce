require("./server.js");

process.on("uncaughtException", (error) => {
  console.log("Uncaught exception: ", error);
});

process.on("unhandledRejection", (error) => {
  console.log("Unhandled rejection: ", error);
});
