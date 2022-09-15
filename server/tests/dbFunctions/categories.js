const Category = require('../../database/dbCategory');

const categories = {
  categoryname: expect.any(String),
};

describe('getCategories function', () => {
  it('no parameters', async () => {
    const response = await Category.getCategories();

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(categories);
    });
  });

  it('faulty parameters', async () => {
    const response = await Category.getCategories({
      test: 'WHATEVER',
    });

    expect(response).toBeInstanceOf(Array);

    response.forEach((item) => {
      expect(item).toEqual(categories);
    });
  });
});

describe('getCategory function', () => {
  it('parameter: category = Ergonomic', async () => {
    const category = 'Ergonomic';
    const response = await Category.getCategory({
      name: category,
    });

    expect(response).toEqual(expect.any(Number));
  });

  it('no parameters -- THROWS ERROR', async () => {
    expect.assertions(1);

    try {
      await Category.getCategory();
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });

  it('faulty parameters -- THROWS ERROR', async () => {
    expect.assertions(1);

    try {
      await Category.getCategory({ test: 'WHATEVER' });
    } catch (e) {
      expect(e).toEqual({ statusCode: 400, message: expect.any(String) });
    }
  });
});
