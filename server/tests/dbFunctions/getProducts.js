const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: `${path.resolve(__dirname, "../../../.env")}`,
});

const dbFunctions = require("../../database/dbFunctions.js");

const product = {
  product_name: expect.any(String),
  product_description: expect.any(String),
  id: expect.any(Number),
  material: expect.any(String),
};

describe("getProducts function", () => {
  it("no parameters", async () => {
    const response = await dbFunctions.Products.getProducts();

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual({
        ...product,
      });
    });
  });

  it("parameters: limit = 20", async () => {
    const limit = 20;
    const response = await dbFunctions.Products.getProducts({ limit: limit });

    expect(response).toBeInstanceOf(Array);
    expect(response.length).toEqual(limit);

    response.forEach((item) => {
      expect(item).toEqual({
        ...product,
      });
    });
  });

  it("parameters: offset = 20", async () => {
    const offset = 20;
    const response = await dbFunctions.Products.getProducts({ offset: offset });

    expect(response).toBeInstanceOf(Array);
    expect(response[0].id).toEqual(offset + 1);

    response.forEach((item) => {
      expect(item).toEqual({
        ...product,
      });
    });
  });

  it("parameters: limit = 20, offset = 20", async () => {
    const offset = 20;
    const limit = 20;
    const response = await dbFunctions.Products.getProducts({
      limit: limit,
      offset: offset,
    });

    expect(response).toBeInstanceOf(Array);
    expect(response.length).toEqual(limit);
    expect(response[0].id).toEqual(offset + 1);

    response.forEach((item) => {
      expect(item).toEqual({
        ...product,
      });
    });
  });

  it("with faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await dbFunctions.Products.getProducts({
        test: "WHATEVER",
      });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });

  it("parameters: limit = -1, offset = 20 -- faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);
    const offset = 20;
    const limit = -1;

    try {
      await dbFunctions.Products.getProducts({
        limit: limit,
        offset: offset,
      });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });

  it("parameters: limit = -1, offset = -1 -- faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);
    const offset = -1;
    const limit = -1;

    try {
      await dbFunctions.Products.getProducts({
        limit: limit,
        offset: offset,
      });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });

  it("parameters: limit = 25, offset = -1 -- faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);
    const offset = -1;
    const limit = 25;

    try {
      await dbFunctions.Products.getProducts({
        limit: limit,
        offset: offset,
      });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });

  it("parameters: limit = 25, offset = 100000 -- faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);
    const offset = 2000;
    const limit = 25;

    try {
      await dbFunctions.Products.getProducts({
        limit: limit,
        offset: offset,
      });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });
});
