const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: `${path.resolve(__dirname, "../../../.env")}`,
});

const dbFunctions = require("../../database/dbFunctions.js");

const categories = {
  categoryname: expect.any(String),
};

describe("getCategories function", () => {
  it("no parameters", async () => {
    const response = await dbFunctions.Products.getCategories();

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(categories);
    });
  });

  it("faulty parameters", async () => {
    const response = await dbFunctions.Products.getCategories({
      test: "WHATEVER",
    });

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(categories);
    });
  });
});

describe("getCategory function", () => {
  it("parameter: category = Ergonomic", async () => {
    const category = "Ergonomic";
    const response = await dbFunctions.Products.getCategory({
      category: category,
    });

    expect(response).toEqual(expect.any(Number));
  });

  it("no parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await dbFunctions.Products.getCategory();
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });

  it("faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await dbFunctions.Products.getCategory({ test: "WHATEVER" });
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });
});
