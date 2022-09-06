const dummyProducts = {
  products: [
    {
      id: 0,
      name: "",
      desc: "",
      price: 0,
      quantity: 0,
      image: "/public/images/asd.png",
      color: ["black", "white", "red"],
    },
    {
      id: 1,
      name: "",
      desc: "",
      price: 0,
      quantity: 0,
      image: "/public/images/asd.png",
      color: ["black", "white", "red"],
    },
  ],
};
exports.indexPage = (req, res) => {
  res.status(200).send("<h1>Index page</h1>");
};

exports.products = (req, res) => {
  res.json(dummyProducts);
};

exports.productsByID = (req, res) => {
  res.json(dummyProducts.products[req.body.id]);
};
