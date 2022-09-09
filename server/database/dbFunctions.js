const db = require("./db.js");
const {
  findCategory,
  findColor,
  findSize,
  findProduct,
  createCategory,
  createColor,
  createSize,
  createProduct,
  findOption,
  createOption,
} = require("./dbUtils.js");

const Products = {
  getSizes: async function () {
    try {
      const connection = await db.pool.connect();
      const response = await connection.query(`SELECT size FROM product_sizes`);

      return response.rows.reduce((acc, size) => [...acc, size], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  getSize: async function (size) {
    try {
      const connection = await db.pool.connect();
      const response = await findSize(connection, { name: size });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  addSize: async function (size) {
    try {
      const response = await this.getSize(size);
      if (response?.statusCode === 404) {
        const connection = await db.pool.connect();
        const response = await createSize(connection, { name: size });

        return response;
      }

      throw { statusCode: 400, message: `Size already exists.` };
    } catch (e) {
      throw e;
    }
  },
  getColors: async function () {
    try {
      const connection = await db.pool.connect();
      const response = await connection.query(
        `SELECT color FROM product_colors`
      );

      return response.rows.reduce((acc, color) => [...acc, color], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  getColor: async function (color) {
    try {
      const connection = await db.pool.connect();
      const response = await findColor(connection, { name: color });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  addColor: async function (color) {
    const response = await this.getColor(color);
    if (response?.statusCode === 404) {
      const connection = await db.pool.connect();
      const response = await createColor(connection, { name: color });

      return response;
    }

    throw { statusCode: 400, message: `Color already exists.` };
  },
  getCategories: async function () {
    try {
      const connection = await db.pool.connect();
      const response = await connection.query(
        `SELECT categoryName FROM product_categories`
      );

      return response.rows.reduce((acc, category) => [...acc, category], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  getCategory: async function (category) {
    try {
      const connection = await db.pool.connect();
      const response = await findCategory(connection, { name: category });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  addCategory: async function (category) {
    const response = await this.getCategory(category.name || category);
    if (response?.statusCode === 404) {
      const connection = await db.pool.connect();
      const response = await createCategory(connection, {
        name: category.name || category,
        description: category.description || "",
      });

      return response;
    }

    throw { statusCode: 400, message: `Category already exists.` };
  },
  addProduct: async function (product) {
    try {
      let color = await this.getColor(product?.color);

      if (color?.statusCode === 404)
        throw {
          statusCode: 404,
          message: `Color '${
            product?.color ?? "NOT_SPECIFIED"
          }' not found. Please create the color to add the product.`,
        };

      let size = await this.getSize(product?.size);

      if (size?.statusCode === 404)
        throw {
          statusCode: 404,
          message: `Size '${
            product?.size ?? "NOT_SPECIFIED"
          }' not found. Please create the size to add the product.`,
        };

      let category = await this.getCategory(product?.category);

      if (category?.statusCode === 404) {
        throw {
          statusCode: 404,
          message: `Category '${product?.category}' not found. Please create the category to add the product.`,
        };
      }

      const connection = await db.pool.connect();
      let productHolder = await findProduct(connection, {
        name: product.name,
      });

      if (productHolder === undefined) {
        productHolder = await createProduct(connection, {
          name: product.name,
          desc: product.desc,
          category: category,
          material: product.material,
        });
      }

      const productConfigurationAlreadyExists = await findOption(connection, {
        id: product_id,
        name: product.name,
        color: color,
        size: size,
        category: category,
        image: product.image,
      });
      if (productConfigurationAlreadyExists !== undefined) {
        throw {
          statusCode: 400,
          message: `Product ${product?.name} already exists with those options. Please try updating the existing configuration.`,
        };
      }

      const response = await createOption(connection, {
        id: product_id,
        color: color,
        size: size,
        category: category,
        quantity: product?.quantity,
        price: product?.price,
        image: product?.image,
      });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e,
      };
    }
  },
  getProducts: async function (limit = 10, offset = 0) {
    try {
      const connection = await db.pool.connect();

      const response = await findProduct(connection, {
        id: null,
        name: null,
        limit: limit,
        offset: offset,
      });

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },
  getProduct: async function (product) {
    if (!product?.name && !product?.id) throw `Missing product information`;
    try {
      const connection = await db.pool.connect();

      const response = await findProduct(connection, {
        id: product.id || -1,
        name: product.name || "",
      });

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },
};

const Users = {
  addUser: function (user) {
    return "asd";
  },
};

module.exports = {
  Products,
  Users,
};
