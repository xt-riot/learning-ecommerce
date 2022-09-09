const controller = require("../routes-controller/user.controller.js");
const db = require("../database/dbFunctions.js");

module.exports = (server) => {
  server.get("/", async (req, res, next) => {
    const response = await controller.indexPage();
    return res.status(response.statusCode).send(response.data);
  });

  server.get("/products", async (req, res, next) => {
    try {
      const response = await controller.findProduct(req.query);

      const message = response.products
        ? {
            nextPage: `/products?p=${response.pagination}${
              req.query?.limit ? `&limit=${response.limit}` : ``
            }`,
            products: response.products,
          }
        : response;

      res.status(200).json(message);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  // TODO: Implement this
  // server.post("/products", async (req, res, next) => {
  //   const parseID = parseInt(req.body.id, 10);
  //   const id = !Number.isNaN(parseID) ? parseID : -1;
  //   const data = req.body.changeData;

  //   if (id === -1 || !data)
  //     return res
  //       .status(400)
  //       .json({ error: "The id or changeData is required." });

  //   const response = await controller.changeProduct(id, data);
  //   if (response === -1)
  //     return res.status(400).json({ error: "Wrong changeData." });

  //   return res.json(response);
  // });

  server.post("/products", async (req, res, next) => {
    try {
      const response = await controller.addProduct(req.body);

      res.status(200).json(response);
    } catch (error) {
      return res.status(error.statusCode || 500).send(error.message);
    }
  });

  server.post("/sizes", async (req, res, next) => {
    try {
      const response = await controller.addSize(req.body);

      return res
        .status(200)
        .json(`Successfully created size '${req.body.size}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/colors", async (req, res, next) => {
    try {
      const response = await controller.addColor(req.body);

      return res
        .status(200)
        .json(`Successfully created color '${req.body.color}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/categories", async (req, res, next) => {
    try {
      const response = await controller.addCategory(req.body);

      return res
        .status(200)
        .json(
          `Successfully created category '${
            req.body.category.name || req.body.category
          }'`
        );
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/categories", async (req, res, next) => {
    try {
      const response = (await controller.getCategories()).map((category) => {
        return { name: category.categoryname };
      });
      return res.status(200).json({ categories: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/colors", async (req, res, next) => {
    try {
      const response = (await controller.getColors()).map((color) => {
        return { name: color };
      });
      return res.status(200).json({ colors: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/sizes", async (req, res, next) => {
    try {
      const response = (await controller.getSizes()).map((size) => {
        return { name: size.size };
      });
      return res.status(200).json({ sizes: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });
};
