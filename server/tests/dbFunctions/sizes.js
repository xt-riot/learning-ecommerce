const Size = require("../../services/dbSize");

const sizes = {
  size: expect.any(String),
};

describe("getSizes function", () => {
  it("no parameters", async () => {
    const response = await Size.getSizes();

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(sizes);
    });
  });

  it("faulty parameters", async () => {
    const response = await Size.getSizes({ test: "WHATEVER" });

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(sizes);
    });
  });
});

describe("getSize function", () => {
  it("parameter: size = S", async () => {
    const size = "S";
    const response = await Size.getSize({ size });

    expect(response).toEqual(expect.any(Number));
  });

  it("no parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Size.getSize();
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });

  it("faulty parameters -- THROWS ERROR", async () => {
    expect.assertions(1);

    try {
      await Size.getSize({ test: "WHATEVER" });
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });
});
