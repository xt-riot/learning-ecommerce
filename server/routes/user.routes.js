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
      const response = await db.Products.addProduct({
        name: "Iphone 9",
        desc: "The newest Iphone in the market",
        price: 1088,
        quantity: 25,
        image: "./public/assets/iphone14.png",
        color: "black",
        category: "Mobile1",
        size: "XXXL",
      });

      res.json(response);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  server.post("/addSize", async (req, res, next) => {
    const size = "XXXL";
    try {
      const response = await db.Products.addSize(size);

      return res.status(200).json(`Successfully created size '${size}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/addColor", async (req, res, next) => {
    const color = "white";
    try {
      const response = await db.Products.addColor(color);

      return res.status(200).json(`Successfully created color '${color}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/addCategory", async (req, res, next) => {
    const category = "Mobile1";
    try {
      const response = await db.Products.addCategory(category);

      return res
        .status(200)
        .json(`Successfully created category '${category}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });
};
