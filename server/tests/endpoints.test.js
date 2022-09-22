const { closeConnection } = require("../database/dbUtils");

afterAll(async () => {
  await closeConnection();
});

describe("Database functions", () => {
  /* eslint-disable */
  require("./dbFunctions/getProduct");
  require("./dbFunctions/getProducts");
  require("./dbFunctions/colors");
  require("./dbFunctions/sizes");
  require("./dbFunctions/categories");
});

describe("Endpoints", () => {
  require("./endpoints/get/products");
  require("./endpoints/post/products");
  /* eslint-enable */
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
