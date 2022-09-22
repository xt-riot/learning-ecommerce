const controller = require("../controllers/user.controller");

module.exports = (server) => {
  server.get("/products", controller.findProduct);
  server.get("/categories", controller.getCategories);
  server.get("/colors", controller.getColors);
  server.get("/sizes", controller.getSizes);

  server.post("/products", controller.addProduct);
  server.post("/sizes", controller.addSize);
  server.post("/categories", controller.addCategory);
  server.post("/colors", controller.addColor);

  server.patch("/products", controller.changeProduct);
};

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
