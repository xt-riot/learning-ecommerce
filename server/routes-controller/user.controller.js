const productMapper = [
  "id",
  "name",
  "desc",
  "price",
  "quantity",
  "image",
  "color",
];
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
exports.indexPage = () => {
  return { statusCode: 200, data: "<h1>Index page</h1>" };
};

exports.findProduct = (id) => {
  if (id === -1) return dummyProducts;

  return dummyProducts.products[id];
};

exports.changeProduct = (id, data) => {
  let product = dummyProducts.products.findIndex(
    (product) => product.id === id
  );
  const dataKeys = Object.keys(data);
  const isDataValid = dataKeys
    .map((key) => productMapper.includes(key))
    .reduce((acc, item) => item && acc, true);

  if (!isDataValid) return -1;

  dummyProducts.products[product] = {
    ...dummyProducts.products[product],
    ...data,
  };
  return dummyProducts.products[product];
};

//{"id": 0, "changeData": {"name": "hello", "test":"hacked"}}
