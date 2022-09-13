const Products = require("../database/dbProduct.js");
const Size = require("../database/dbSize.js");
const Color = require("../database/dbColor.js");
const Category = require("../database/dbCategory.js");

exports.indexPage = () => {
  return { statusCode: 200, data: "<h1>Index page</h1>" };
};

exports.findProduct = async (query) => {
  const parseID = parseInt(query?.id, 10);
  const id = !Number.isNaN(parseID) ? parseID : null;

  const lim = parseInt(query?.limit, 10);
  const limit = !Number.isNaN(lim) ? (lim < 101 ? lim : 10) : 10; // TODO: do we need to throw or inform the client he can't search for more than 100 items at once?

  const page = parseInt(query?.p, 10);
  const pagination = !Number.isNaN(page) ? page : 0;

  const name = query.name || null;

  if (id === null && !name) {
    const response = await Products.getProducts(limit, pagination * limit);

    let products = await Promise.all(
      response.map(async (product) => {
        return await Products.getOption({
          id: product.id,
          name: product.product_name,
        });
      })
    );

    products = products.map((product) => {
      return product.reduce(
        (acc, item) => {
          return {
            ...acc,
            ...item,
            color: [...acc.color, item.color],
            size: [...acc.size, item.size],
            price: [...acc.price, item.price],
            quantity: [...acc.quantity, item.quantity],
          };
        },
        { color: [], size: [], price: [], quantity: [] }
      );
    });
    // console.log(products);

    return { products: products, pagination: pagination + 1, limit: limit };
  }

  const response = await Products.getProduct({
    id: id,
    name: name?.replace(/"/g, "").replace(/\s\s+/g, " ").trim() || "",
  });

  if (response?.statusCode === 400) {
    throw response;
  }

  let product = await Products.getOption({
    id: response.id,
    name: response.product_name,
  });

  product = product.reduce(
    (acc, item) => {
      return {
        ...acc,
        ...item,
        color: [...acc.color, item.color],
        size: [...acc.size, item.size],
        price: [...acc.price, item.price],
        quantity: [...acc.quantity, item.quantity],
      };
    },
    { color: [], size: [], price: [], quantity: [] }
  );

  return product;
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

const productMapper = [
  "name",
  "desc",
  "price",
  "quantity",
  "category",
  "color",
  "size",
  "material",
];

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

  return await Products.addProduct(product);
};

exports.addSize = async ({ name: size }) => {
  if (size === undefined || typeof size !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about size.",
    };
  }

  return await Size.addSize({ name: size });
};

exports.addColor = async ({ name: color }) => {
  if (color === undefined || typeof color !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about color.",
    };
  }

  return await Color.addColor({ color: color });
};

exports.addCategory = async ({ name }) => {
  if (
    name === undefined ||
    (typeof name !== "string" && typeof name !== "object")
  ) {
    throw {
      statusCode: 400,
      message: "Missing required information about category.",
    };
  }

  return await Category.addCategory({
    name: name.name || name,
  });
};

exports.getCategories = async () => {
  const response = await Category.getCategories();

  return response;
};

exports.getColors = async () => {
  const response = await Color.getColors();

  return response;
};

exports.getSizes = async () => {
  const response = await Size.getSizes();

  return response;
};
