const { findSize, createSize } = require("./dbUtils");

const Size = {
  async getSizes() {
    try {
      const response = await findSize({ all: true });

      return response.rows.reduce((acc, size) => [...acc, size], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  async getSize({ size = "" } = {}, ...args) {
    if (args.length > 0 || size === "") {
      throw {
        statusCode: 400,
        message: "Invalid parameters. Please contact an administrator.",
      };
    }

    try {
      const response = await findSize({ name: size });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  async addSize({ name }) {
    let response = await this.getSize({ size: name });

    if (response?.statusCode === 404) {
      response = await createSize({
        name,
      });

      return response;
    }

    throw { statusCode: 400, message: "Size already exists." };
  },
};

module.exports = Size;
