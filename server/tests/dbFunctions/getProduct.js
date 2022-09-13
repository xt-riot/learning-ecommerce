const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: `${path.resolve(__dirname, "../../../.env")}`,
});

const Products = require("../../database/dbProduct.js");

const product = {
  product_name: expect.any(String),
  product_description: expect.any(String),
  id: expect.any(Number),
  material: expect.any(String),
};

const getProduct_Test = describe("getProduct function", () => {
  it("parameters: {id}", async () => {
    const response = await Products.getProduct({ id: 11 });

    expect(response).toStrictEqual({
      ...product,
      id: 11,
      product_name: "Unbranded Fresh Fish",
    });
  });

  it("parameters: {name}", async () => {
    const response = await Products.getProduct({
      name: "Unbranded Fresh Fish",
    });

    expect(response).toStrictEqual({
      ...product,
      id: 11,
      product_name: "Unbranded Fresh Fish",
    });
  });

  it("parameters: {id, name}", async () => {
    const response = await Products.getProduct({
      id: 11,
      name: "Unbranded Fresh Fish",
    });

    expect(response).toStrictEqual({
      ...product,
      id: 11,
      product_name: "Unbranded Fresh Fish",
    });
  });

  it("parameters: {} -- search product with no parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Products.getProduct({ test: "WHATEVER" });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });

  it("parameters: {id, name} -- incorrect parameters(id points to different product from name) -- THROWS ERROR", async () => {
    expect.assertions(2);
    const response = await Products.getProduct({
      id: 9,
      name: "Unbranded Fresh Fish",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.message).toEqual(
      "Could not find the product with those parameters."
    );
  });

  it("parameters: {id, name} -- incorrect parameters(id points to different product from name) -- THROWS ERROR", async () => {
    expect.assertions(2);

    const response = await Products.getProduct({
      id: 11,
      name: "1231",
    });

    expect(response.statusCode).toEqual(400);
    expect(response.message).toEqual(
      "Could not find the product with those parameters."
    );
  });

  it("parameters: {id, name} -- wrong id(id is out of range) -- THROWS ERROR", async () => {
    expect.assertions(2);

    const response = await Products.getProduct({
      id: -1,
    });

    expect(response.statusCode).toEqual(400);
    expect(response.message).toEqual(
      "Could not find the product with those parameters."
    );
  });

  it("parameters: {test} -- search product with faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Products.getProduct({ test: "WHATEVER" });
    } catch (e) {
      expect(e).toEqual({
        statusCode: 400,
        message: expect.any(String),
      });
    }
  });
});

module.exports = getProduct_Test;
