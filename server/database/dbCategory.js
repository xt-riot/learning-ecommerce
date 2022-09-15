const { findCategory, createCategory } = require('./dbUtils');

const Category = {
  async getCategories() {
    try {
      const response = await findCategory({ all: true });

      return response.rows.reduce((acc, category) => [...acc, category], []);
    } catch (e) {
      throw new Error({
        statusCode: 500,
        message: e,
      });
    }
  },
  async getCategory({ name = '' } = {}, ...args) {
    if (args.length > 0 || name === '') {
      throw new Error({
        statusCode: 400,
        message: 'Invalid parameters. Please contact an administrator.',
      });
    }

    try {
      const response = await findCategory({ name });

      return response;
    } catch (e) {
      throw new Error({
        statusCode: e.statusCode || 500,
        message: e.message,
      });
    }
  },
  async addCategory({ name }) {
    let response = await this.getCategory({ name });

    if (response?.statusCode === 404) {
      response = await createCategory({
        name,
      });

      return response;
    }

    throw new Error({ statusCode: 400, message: 'Category already exists.' });
  },
};

module.exports = Category;
