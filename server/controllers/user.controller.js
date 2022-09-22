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
exports.findProduct = async (req, res) => {
  const parseID = parseInt(req.query?.id, 10);
  const id = !Number.isNaN(parseID) ? parseID : null;

  const lim = parseInt(req.query?.limit, 10);
  const limit = !Number.isNaN(lim) && lim < 101 ? lim : 10;

  const page = parseInt(req.query?.p, 10);
  const pagination = !Number.isNaN(page) ? page : 0;

  const name = req.query.name || null;

  const category = req.query.category || null;

  try {
    if (category) {
      const response = await Products.getProductByCategory(
        category.replace(/"/g, "")
      );

      const products = response
        .map((product) =>
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
        )
        .map((product) => ({
          ...product,
          thumbnail: new URL(
            product.thumbnail,
            `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
          ).href,
          image: new URL(
            product.image,
            `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
          ).href,
        }));

      if (products.length === 0) {
        throw {
          statusCode: 404,
          message: `No products found under the category ${req.query.category}. Try again later or search another category.`,
        };
      }

      return res.status(200).json({ products });
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

      const nextPage = await new URL(
        "/products",
        `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
      );
      const previousPage = await new URL(
        "/products",
        `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
      );

      if (pagination > 2) {
        previousPage.searchParams.set("p", pagination - 1);
      }
      nextPage.searchParams.set("p", pagination + 1);

      if (req.query?.limit) {
        nextPage.searchParams.set("limit", limit);
        previousPage.searchParams.set("limit", limit);
      }

      products = products.map((product) => ({
        ...product,
        thumbnail: new URL(
          product.thumbnail,
          `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
        ).href,
        image: new URL(
          product.image,
          `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
        ).href,
      }));

      const message = {
        nextPage: nextPage.href,
        previousPage: previousPage.href,
        products,
      };

      return res.status(200).json(message);
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

    return res.status(200).json({
      ...product,
      thumbnail: new URL(
        product.thumbnail,
        `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
      ).href,
      image: new URL(
        product.image,
        `${process.env.NODE_HOST_URL}:${process.env.NODE_PORT}`
      ).href,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const product = req.body;
  try {
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

    const response = await Products.addProduct(product);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.statusCode || 500).json(error.message);
  }
};

exports.addSize = async (req, res) => {
  const { name: size } = req.body;
  try {
    if (size === undefined || typeof size !== "string") {
      throw {
        statusCode: 400,
        message: "Missing required information about size.",
      };
    }

    await Size.addSize({ name: size });

    return res.status(200).json(`Successfully created size '${req.body.name}'`);
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.addColor = async (req, res) => {
  const { name: color } = req.body;
  try {
    if (color === undefined || typeof color !== "string") {
      throw {
        statusCode: 400,
        message: "Missing required information about color.",
      };
    }
    await Color.addColor({ color });
    return res
      .status(200)
      .json(`Successfully created color '${req.body.name}'`);
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    if (
      name === undefined ||
      (typeof name !== "string" && typeof name !== "object")
    ) {
      throw {
        statusCode: 400,
        message: "Missing required information about category.",
      };
    }
    const response = await Category.addCategory({
      name: name.name || name,
    });

    return res
      .status(200)
      .json(
        `Successfully created category '${response.category || response.name}'`
      );
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.getCategories = async (req, res) => {
  try {
    const response = (await Category.getCategories()).map((category) => ({
      name: category.categoryname,
    }));
    return res.status(200).json({ categories: response });
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.getColors = async (req, res) => {
  try {
    const response = await Color.getColors();

    return res.status(200).json({ colors: response });
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.getSizes = async (req, res) => {
  try {
    const response = (await Size.getSizes()).map((size) => ({
      size: size.size,
    }));
    return res.status(200).json({ sizes: response });
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};

exports.changeProduct = async (req, res) => {
  const query = req.body;
  try {
    const dataKeys = Object.keys(query.data);
    const isDataValid = dataKeys
      .map((key) => productMapper.includes(key))
      .reduce((acc, item) => item && acc, true);

    if (!isDataValid) {
      throw { statusCode: 400, message: "Invalid data" };
    }

    const productConfig = await Products.getOption({ id: query.product.id });
    const productToChange = productConfig.find(
      (productToSearch) =>
        productToSearch.color === query.product.color &&
        productToSearch.size === query.product.size
    );

    if (!productToChange) {
      throw {
        statusCode: 400,
        message:
          "Could not find the product -- cannot continue with the update.",
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
        message:
          "Could not update the product. Please contact an administrator.",
      };
    }

    return res.status(204).end();
  } catch (e) {
    return res.status(e.statusCode || 500).json(e.message);
  }
};
