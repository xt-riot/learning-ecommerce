const controller = require("../routes-controller/user.controller");

module.exports = (server) => {
  server.get("/", async (req, res) => {
    const response = await controller.indexPage();
    return res.status(response.statusCode).json(response.data);
  });

  server.get("/products", async (req, res) => {
    try {
      const response = await controller.findProduct(req.query);

      const message = response.products
        ? {
            nextPage: `/products?p=${response.pagination}${
              req.query?.limit ? `&limit=${response.limit}` : ""
            }`,
            products: response.products,
          }
        : response;

      return res.status(200).json(message);
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
      return res
        .status(error.statusCode || 500)
        .json({ message: error.message });
    }
  });

  // TODO: Implement this
  // server.post("/products", async (req, res) => {
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

  server.post("/products", async (req, res) => {
    try {
      const response = await controller.addProduct(req.body);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(error.statusCode || 500).json(error.message);
    }
  });

  server.post("/sizes", async (req, res) => {
    try {
      await controller.addSize(req.body);

      return res
        .status(200)
        .json(`Successfully created size '${req.body.name}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/colors", async (req, res) => {
    try {
      await controller.addColor(req.body);

      return res
        .status(200)
        .json(`Successfully created color '${req.body.name}'`);
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.post("/categories", async (req, res) => {
    try {
      const response = await controller.addCategory(req.body);

      return res
        .status(200)
        .json(
          `Successfully created category '${
            response.category || response.name
          }'`
        );
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/categories", async (req, res) => {
    try {
      const response = (await controller.getCategories()).map((category) => ({
        name: category.categoryname,
      }));
      return res.status(200).json({ categories: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/colors", async (req, res) => {
    try {
      const response = await controller.getColors();

      return res.status(200).json({ colors: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });

  server.get("/sizes", async (req, res) => {
    try {
      const response = (await controller.getSizes()).map((size) => ({
        size: size.size,
      }));
      return res.status(200).json({ sizes: response });
    } catch (e) {
      return res.status(e.statusCode || 500).json(e.message);
    }
  });
};
