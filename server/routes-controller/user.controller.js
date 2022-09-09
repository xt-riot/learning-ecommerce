const db = require("../database/dbFunctions.js");

exports.indexPage = () => {
  return { statusCode: 200, data: "<h1>Index page</h1>" };
};

exports.findProduct = async (query) => {
  const parseID = parseInt(query?.id, 10);
  const id = !Number.isNaN(parseID) ? parseID : -1;

  const lim = parseInt(query?.limit, 10);
  const limit = !Number.isNaN(lim) ? (lim < 101 ? lim : 10) : 10; // TODO: do we need to throw or inform the client he can't search for more than 100 items at once?

  const page = parseInt(query?.p, 10);
  const pagination = !Number.isNaN(page) ? page : 0;

  const name = query.name || null;

  if (id === -1 && !name) {
    const response = await db.Products.getProducts(limit, pagination * limit);

    return { products: response, pagination: pagination + 1, limit: limit };
  }

  const response = await db.Products.getProduct({
    id: id,
    name: name?.replace(/"/g, "").replace(/\s\s+/g, " ").trim() || "",
  });

  return response;
};

// TODO: Implement this

// const productMapper = [
//   "name",
//   "desc",
//   "price",
//   "quantity",
//   "category",
//   "color",
//   "size",
// ];
// exports.changeProduct = (id, data) => {
//   let product = dummyProducts.products.findIndex(
//     (product) => product.id === id
//   );
//   const dataKeys = Object.keys(data);
//   const isDataValid = dataKeys
//     .map((key) => productMapper.includes(key))
//     .reduce((acc, item) => item && acc, true);

//   if (!isDataValid) return -1;

//   dummyProducts.products[product] = {
//     ...dummyProducts.products[product],
//     ...data,
//   };
//   return dummyProducts.products[product];
// };

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

exports.getCategories = async () => {
  const response = await db.Products.getCategories();

  return response;
};

exports.getColors = async () => {
  const response = await db.Products.getColors();

  return response;
};

exports.getSizes = async () => {
  const response = await db.Products.getSizes();

  return response;
};
