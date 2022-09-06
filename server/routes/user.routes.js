const controller = require("../routes-controller/user.controller.js");

module.exports = (server) => {
  server.get("/", (req, res) => {
    controller.indexPage(req, res);
  });

  server
    .route("/products")
    .get((req, res, next) => {
      controller.products(req, res);
    })
    .post((req, res, next) => {
      controller.productsByID(req, res);
    });
};
