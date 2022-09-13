const { findColor, createColor } = require("./dbUtils.js");

const Color = {
  getColors: async function () {
    try {
      const response = await findColor({ all: true });
      return response.rows.reduce((acc, color) => [...acc, color], []);
    } catch (e) {
      throw {
        statusCode: 500,
        message: e,
      };
    }
  },
  getColor: async function ({ color = "" } = {}, ...args) {
    if (args.length > 0 || color === "") {
      throw {
        statusCode: 400,
        message: `Invalid parameters. Please contact an administrator.`,
      };
    }
    try {
      const response = await findColor({ name: color });

      return response;
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e.message,
      };
    }
  },
  addColor: async function ({ color: name }) {
    const response = await this.getColor({ color: name });

    if (response?.statusCode === 404) {
      const response = await createColor({
        name: name,
      });

      return response;
    }

    throw { statusCode: 400, message: `Color already exists.` };
  },
};

module.exports = Color;
