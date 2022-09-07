const db = require("./db.js");

const productMapper = ["name", "desc", "price", "quantity", "image"];
const productMapperTypes = ["string", "string", "number", "number", "string"];

const Products = {
  addProduct: async function (...args) {
    if (args.length !== productMapper.length)
      throw { statusCode: 400, message: "Missing product information." };

    const areValidTypes = args
      .map((item, index) => {
        if (typeof item === productMapperTypes[index] || Array.isArray(item))
          return true;

        return false;
      })
      .reduce((acc, item) => item && acc, true);

    if (!areValidTypes)
      throw { statusCode: 400, message: "Invalid type of data provided." };
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
