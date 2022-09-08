const db = require("../database/dbFunctions.js");

const productMapper = [
  "name",
  "desc",
  "price",
  "quantity",
  "category",
  "color",
  "size",
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

exports.addProduct = async (product) => {
  if (product === undefined) {
    throw {
      statusCode: 400,
      message: "Missing required information about product.",
    };
  }
  const dataKeys = Object.keys(product);
  const isDataValid = dataKeys
    .map((key) => productMapper.includes(key))
    .reduce((acc, item) => item && acc, true);

  if (!isDataValid) return -1;

  return await db.Products.addProduct(product);
  //{"name":"Iphone 11", "desc":"Iphone for dums", "quantity": 15, "price": 1000, "category":"Mobile", "color":"red"}
};

exports.addSize = async ({ size }) => {
  if (size === undefined || typeof size !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about size.",
    };
  }

  return await db.Products.addSize(size);
};

exports.addColor = async ({ color: color }) => {
  if (color === undefined || typeof color !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about color.",
    };
  }

  return await db.Products.addColor(color);
};

exports.addCategory = async ({ category }) => {
  if (
    category === undefined ||
    (typeof category !== "string" && typeof category !== "object")
  ) {
    throw {
      statusCode: 400,
      message: "Missing required information about category.",
    };
  }

  return await db.Products.addCategory({
    name: category.name || category,
    description: category.description || "",
  });
};
