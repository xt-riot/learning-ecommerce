const controller = require("../routes-controller/user.controller.js");
const db = require("../database/dbFunctions.js");

module.exports = (server) => {
  server.get("/", async (req, res, next) => {
    const response = await controller.indexPage();
    return res.status(response.statusCode).send(response.data);
  });

  server.get("/products", async (req, res, next) => {
    const parseID = parseInt(req.query.id, 10);
    const id = !Number.isNaN(parseID) ? parseID : -1;

    const response = await controller.findProduct(id);

    return res.json(response);
  });

  server.post("/products", async (req, res, next) => {
    const parseID = parseInt(req.body.id, 10);
    const id = !Number.isNaN(parseID) ? parseID : -1;
    const data = req.body.changeData;

    if (id === -1 || !data)
      return res
        .status(400)
        .json({ error: "The id or changeData is required." });

    const response = await controller.changeProduct(id, data);
    if (response === -1)
      return res.status(400).json({ error: "Wrong changeData." });

    return res.json(response);
  });

  server.post("/addProduct", async (req, res, next) => {
    try {
      await db.Products.addProduct(
        "Iphone 14",
        "The newest Iphone in the market",
        1088,
        25,
        "./public/assets/iphone14.png"
      );
    } catch (error) {
      return res.status(error.statusCode).send(error.message);
    }
    console.log("running");
  });
};
