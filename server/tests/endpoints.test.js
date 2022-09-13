const request = require("supertest");
const app = require("../server.js");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: `${path.resolve(__dirname, "../../.env")}` });

const { closeConnection } = require("../database/dbUtils.js");

afterAll(async () => {
  await closeConnection();
});

describe("Database functions", () => {
  require("./dbFunctions/getProduct.js");
  require("./dbFunctions/getProducts.js");
  require("./dbFunctions/colors.js");
  require("./dbFunctions/sizes.js");
  require("./dbFunctions/categories.js");
});

describe("Endpoints", () => {
  require("./endpoints/get/products.js");
  require("./endpoints/post/products.js");
});

// response.forEach((product) => {
//     expect(product).toMatchSnapshot({
//       product_name: expect.any(String),
//       product_description: expect.any(String),
//       category: expect.any(String),
//       thumbnail: expect.any(String),
//       image: expect.any(String),
//       color: expect.any(String),
//       size: expect.any(String),
//       price: expect.any(Number),
//       quantity: expect.any(Number),
//       id: expect.any(Number),
//       material: expect.any(String),
//     });
//   });
