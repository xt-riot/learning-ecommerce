const request = require('supertest');
const app = require('../../../server');

const product = {
  product_name: expect.any(String),
  product_description: expect.any(String),
  categoryname: expect.any(String),
  thumbnail: expect.any(String),
  image: expect.any(String),
  color: expect.any(Array),
  size: expect.any(Array),
  price: expect.any(Array),
  quantity: expect.any(Array),
  id: expect.any(Number),
  material: expect.any(String),
};

const responseObject = {
  nextPage: expect.any(String),
  products: expect.any(Array),
};

describe('GET endpoints', () => {
  it('should return a list of products -- /products', async () => {
    const response = await request(app).get('/products');

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body).toEqual(responseObject);

    response.body.products.forEach((item) => {
      expect(item).toStrictEqual(product);
      item.color.forEach((productColor) => expect(productColor).toEqual(expect.any(String)));
      item.size.forEach((productSize) => expect(productSize).toEqual(expect.any(String)));
      item.quantity.forEach((productQuantity) => expect(productQuantity).toEqual(expect.any(Number)));
      item.price.forEach((productPrice) => expect(productPrice).toEqual(expect.any(Number)));
    });
  });

  it('should return one product with id 1 -- /products?id=1', async () => {
    const response = await request(app).get('/products?id=1');

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body).toEqual(product);

    response.body.color.forEach((productColor) => {
      expect(productColor).toEqual(expect.any(String));
    });
    response.body.size.forEach((productSize) => {
      expect(productSize).toEqual(expect.any(String));
    });
    response.body.quantity.forEach((productQuantity) => {
      expect(productQuantity).toEqual(expect.any(Number));
    });
    response.body.price.forEach((productPrice) => {
      expect(productPrice).toEqual(expect.any(Number));
    });
  });

  it('should return one product with name "Awesome Granite Fish" -- /products?name="Awesome Granite Fish"', async () => {
    const response = await request(app).get(
      '/products?name="Awesome Granite Fish"',
    );

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body).toEqual(product);

    response.body.color.forEach((productColor) => expect(productColor).toEqual(expect.any(String)));
    response.body.size.forEach((productSize) => expect(productSize).toEqual(expect.any(String)));
    response.body.quantity.forEach((productQuantity) => expect(productQuantity).toEqual(expect.any(Number)));
    response.body.price.forEach((productPrice) => expect(productPrice).toEqual(expect.any(Number)));
  });

  it('should throw an error -- wrong parameters: id=-1', async () => {
    expect.assertions(2);
    const response = await request(app).get('/products?id=-1');

    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(
      'Could not find the product with those parameters.',
    );
  });

  it("should throw an error -- wrong parameters: name='asdasd'", async () => {
    expect.assertions(2);
    const response = await request(app).get('/products?name="asdasd"');
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(
      'Could not find the product with those parameters.',
    );
  });

  it("should throw an error -- wrong parameters: id=9, name='asdasd'", async () => {
    expect.assertions(2);
    const response = await request(app).get(
      '/products?id=9&name="Awesome Granite Fish"',
    );
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(
      'Could not find the product with those parameters.',
    );
  });

  it('should throw an error -- wrong parameters: id=-1, name="Awesome Granite Fish"', async () => {
    expect.assertions(2);
    const response = await request(app).get('/products?id=-1&name="asdasd"');
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(
      'Could not find the product with those parameters.',
    );
  });

  it('should return all the categories -- /categories', async () => {
    const response = await request(app).get('/categories');

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body.categories).toBeInstanceOf(Array);

    response.body.categories.forEach((category) => expect(category).toEqual({ name: expect.any(String) }));
  });

  it('should return all colors -- /colors', async () => {
    const response = await request(app).get('/colors');

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body.colors).toBeInstanceOf(Array);

    response.body.colors.forEach((color) => expect(color).toEqual({ color: expect.any(String) }));
  });

  it('should return all sizes -- /sizes', async () => {
    const response = await request(app).get('/sizes');

    expect(response.statusCode).toEqual(200);
    expect(response.body.error).toBe(undefined);
    expect(response.body.sizes).toBeInstanceOf(Array);

    response.body.sizes.forEach((size) => expect(size).toEqual({ size: expect.any(String) }));
  });

  //   it("/products", async () => {
  //     const response = await request(app).get("/products");
  //   });

  //   it("/products", async () => {
  //     const response = await request(app).get("/products");
  //   });

  //   it("/products", async () => {
  //     const response = await request(app).get("/products");
  //   });
});
