const { findColor, createColor } = require('./dbUtils');

const Color = {
  async getColors() {
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
  async getColor({ color = '' } = {}, ...args) {
    if (args.length > 0 || color === '') {
      throw {
        statusCode: 400,
        message: 'Invalid parameters. Please contact an administrator.',
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
  async addColor({ color: name }) {
    let response = await this.getColor({ color: name });

    if (response?.statusCode === 404) {
      response = await createColor({
        name,
      });

      return response;
    }

    throw { statusCode: 400, message: 'Color already exists.' };
  },
};

module.exports = Color;
