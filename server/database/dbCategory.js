const { findCategory, createCategory } = require("./dbUtils.js");

const Category = {
  getCategories: async function () {
    try {
      const response = await findCategory({ all: true });

      return response.rows.reduce((acc, category) => [...acc, category], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  getCategory: async function ({ name = "" } = {}, ...args) {
    if (args.length > 0 || name === "") {
      throw {
        statusCode: 400,
        message: `Invalid parameters. Please contact an administrator.`,
      };
    }

    try {
      const response = await findCategory({ name: name });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  addCategory: async function ({ name }) {
    const response = await this.getCategory({ name: name });

    if (response?.statusCode === 404) {
      const response = await createCategory({
        name: name,
      });

      return response;
    }

    throw { statusCode: 400, message: `Category already exists.` };
  },
};

module.exports = Category;
