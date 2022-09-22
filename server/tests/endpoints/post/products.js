const request = require('supertest');
const app = require('../../../server');

const productObject = {
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

describe('POST endpoints', () => {
  describe('/categories', () => {
    const category = { name: 'New category' };
    it('should create a new category', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/categories')
        .send(category)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual(
        `Successfully created category '${category.name}'`,
      );
    });

    it('should try to create a category that already exists -- Error: 400 Bad Request "Category already exists"', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/categories')
        .send(category)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual('Category already exists.');
    });
  });

  describe('/colors', () => {
    const color = { name: 'white-test' };
    it('should create a new color', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/colors')
        .send(color)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual(
        `Successfully created color '${color.name}'`,
      );
    });

    it('should try to create a color that already exists -- Error: 400 Bad Request "Color already exists"', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/colors')
        .send(color)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual('Color already exists.');
    });
  });

  describe('/sizes', () => {
    const size = { name: 'white-test' };
    it('should create a new size', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/sizes')
        .send(size)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual(`Successfully created size '${size.name}'`);
    });

    it('should try to create a size that already exists -- Error: 400 Bad Request "Size already exists"', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/sizes')
        .send(size)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual('Size already exists.');
    });
  });

  describe('/products', () => {
    const product = {
      name: 'Test product',
      desc: 'This is a test product description.',
      quantity: 5,
      price: 523,
      category: 'Ergonomic',
      color: 'white',
      size: 'S',
      material: 'Steel',
    };
    it('should create a new product', async () => {
      expect.assertions(5);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/products')
        .send(product)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      response.body.forEach((item) => {
        expect(item).toStrictEqual({
          ...productObject,
          color: expect.any(String),
          size: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        });
      });
    });

    it('should use an existing product and make new configurations', async () => {
      expect.assertions(5);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/products')
        .send({
          ...product,
          color: 'indigo',
          size: 'L',
          price: '499.99',
          quantity: 5,
        })
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(200);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(1);
      response.body.forEach((item) => {
        expect(item).toStrictEqual({
          ...productObject,
          color: expect.any(String),
          size: expect.any(String),
          price: expect.any(Number),
          quantity: expect.any(Number),
        });
      });
    });

    it('should try to create a product that already exists -- Error: 400 Bad Request', async () => {
      expect.assertions(3);
      await process.nextTick(() => {}); // jest throws error for an open handler without this line.
      const response = await request(app)
        .post('/products')
        .send(product)
        .set('Content-Type', 'application/json');

      expect(response.statusCode).toEqual(400);
      expect(response.body.error).toBe(undefined);
      expect(response.body).toEqual({
        statusCode: 400,
        message: `Product ${product.name} already exists with those options. Please try updating the existing configuration.`,
      });
    });
  });
});
