const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({
  path: `${path.resolve(__dirname, "../../../.env")}`,
});

const Color = require("../../database/dbColor.js");

const colors = {
  color: expect.any(String),
};

describe("getColors function", () => {
  it("no parameters", async () => {
    const response = await Color.getColors();

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(colors);
    });
  });

  it("faulty parameters", async () => {
    const response = await Color.getColors({ test: "WHATEVER" });

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(colors);
    });
  });
});

describe("getColor function", () => {
  it("parameter: color = red", async () => {
    const color = "red";
    const response = await Color.getColor({ color: color });

    expect(response).toEqual(expect.any(Number));
  });

  it("no parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Color.getColor();
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });

  it("faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Color.getColor({ test: "WHATEVER" });
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });
});
