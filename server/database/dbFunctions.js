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
} = require("./dbUtils.js");

const Products = {
  getSizes: async function () {
    try {
      const connection = await db.pool.connect();
      const response = await connection.query(`SELECT size FROM productsize`);

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
      const response = await connection.query(`SELECT color FROM productcolor`);

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
        `SELECT categoryname, description FROM productcategories`
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
      // FIND COLOR OR CREATE A NEW ONE --------------------------------------
      let color = await this.getColor(product?.color);

      if (color?.statusCode === 404)
        throw {
          statusCode: 404,
          message: `Color '${
            product?.color ?? "NOT_SPECIFIED"
          }' not found. Please create the color to add the product.`,
        };

      // FIND SIZE OR CREATE A NEW ONE --------------------------------------
      let size = await this.getSize(product?.size);

      if (size?.statusCode === 404)
        throw {
          statusCode: 404,
          message: `Size '${
            product?.size ?? "NOT_SPECIFIED"
          }' not found. Please create the size to add the product.`,
        };

      // FIND CATEGORY OR CREATE A NEW ONE --------------------------------------
      let category = await this.getCategory(product?.category);

      if (category?.statusCode === 404) {
        throw {
          statusCode: 404,
          message: `Category '${product?.category}' not found. Please create the category to add the product.`,
        };
      }

      const connection = await db.pool.connect();
      let productHolder = await findProduct(connection, {
        name: product?.name,
      });

      if (productHolder === undefined) {
        productHolder = await connection.query(
          `INSERT INTO product (productname, description, category_id)
            VALUES ('${product.name}', '${product.desc}', ${category})
            RETURNING id;`
        );
      }

      const product_id = productHolder?.id || productHolder?.rows[0].id;
      let response = await connection.query(
        `SELECT product.productname, product.description, productcategories.categoryname, productcategories.description, color, size, price, quantity, image
        FROM product_options
        INNER JOIN product ON product.id = ${product_id} AND product_options.color_id = ${color} AND product_options.size_id = ${size}
        INNER JOIN productcolor ON productcolor.id = ${color}
        INNER JOIN productsize ON productsize.id = ${size}
        INNER JOIN productcategories ON productcategories.id = product.category_id;`
      );

      if (response?.rows[0] !== undefined) {
        throw {
          statusCode: 400,
          message: `Product ${product?.name} already exists with those options. Please try updating the existing configuration.`,
        };
      }

      productHolder = await createProduct(connection, {
        id: product_id,
        color: color,
        size: size,
        category: category,
        quantity: product?.quantity,
        price: product?.price,
        image: product?.image,
      });

      return productHolder;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e,
      };
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
