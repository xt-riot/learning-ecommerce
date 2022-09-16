const Products = require("../database/dbProduct");
const Size = require("../database/dbSize");
const Color = require("../database/dbColor");
const Category = require("../database/dbCategory");

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

exports.indexPage = () => ({ statusCode: 200, data: "<h1>Index page</h1>" });

exports.findProduct = async (query) => {
  const parseID = parseInt(query?.id, 10);
  const id = !Number.isNaN(parseID) ? parseID : null;

  const lim = parseInt(query?.limit, 10);
  const limit = !Number.isNaN(lim) && lim < 101 ? lim : 10;

  const page = parseInt(query?.p, 10);
  const pagination = !Number.isNaN(page) ? page : 0;

  const name = query.name || null;

  const category = query.category || null;

  if (category) {
    const response = await Products.getProductByCategory(
      category.replace(/"/g, "")
    );

    // console.log(response);
    const products = response.map((product) =>
      product.reduce(
        (acc, item) => ({
          ...acc,
          ...item,
          color: [...acc.color, item.color],
          size: [...acc.size, item.size],
          price: [...acc.price, item.price],
          quantity: [...acc.quantity, item.quantity],
        }),
        {
          color: [],
          size: [],
          price: [],
          quantity: [],
        }
      )
    );

    return products;
  }

  if (id === null && !name) {
    const response = await Products.getProducts({
      limit,
      offset: pagination * limit,
    });

    let products = await Promise.all(
      response.map(async (product) =>
        Products.getOption({
          id: product.id,
          name: product.product_name,
        })
      )
    );

    products = products.map((product) =>
      product.reduce(
        (acc, item) => ({
          ...acc,
          ...item,
          color: [...acc.color, item.color],
          size: [...acc.size, item.size],
          price: [...acc.price, item.price],
          quantity: [...acc.quantity, item.quantity],
        }),
        {
          color: [],
          size: [],
          price: [],
          quantity: [],
        }
      )
    );

    return { products, pagination: pagination + 1, limit };
  }

  const response = await Products.getProduct({
    id,
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
    (acc, item) => ({
      ...acc,
      ...item,
      color: [...acc.color, item.color],
      size: [...acc.size, item.size],
      price: [...acc.price, item.price],
      quantity: [...acc.quantity, item.quantity],
    }),
    {
      color: [],
      size: [],
      price: [],
      quantity: [],
    }
  );

  return product;
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

  return Products.addProduct(product);
};

exports.addSize = async ({ name: size }) => {
  if (size === undefined || typeof size !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about size.",
    };
  }

  return Size.addSize({ name: size });
};

exports.addColor = async ({ name: color }) => {
  if (color === undefined || typeof color !== "string") {
    throw {
      statusCode: 400,
      message: "Missing required information about color.",
    };
  }

  return Color.addColor({ color });
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

  return Category.addCategory({
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

exports.changeProduct = async (query) => {
  const dataKeys = Object.keys(query.data);
  const isDataValid = dataKeys
    .map((key) => productMapper.includes(key))
    .reduce((acc, item) => item && acc, true);

  if (!isDataValid) {
    throw { statusCode: 400, message: "Invalid data" };
  }

  const productConfig = await Products.getOption({ id: query.product.id });
  console.log(productConfig);
  const productToChange = productConfig.find(
    (productToSearch) =>
      productToSearch.color === query.product.color &&
      productToSearch.size === query.product.size
  );

  if (!productToChange) {
    throw {
      statusCode: 400,
      message: "Could not find the product -- cannot continue with the update.",
    };
  }

  const productChanged = await Products.updateProduct({
    oldProduct: productToChange,
    color: query.data.color,
    size: query.data.size,
    price: query.data.price,
    quantity: query.data.quantity,
  });

  if (!productChanged) {
    throw {
      statusCode: 500,
      message: "Could not update the product. Please contact an administrator.",
    };
  }
};
