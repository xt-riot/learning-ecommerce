const db = require('./db');

const createCategory = async (category) => {
  if (!category?.name && category.name !== undefined) {
    throw new Error('Missing category information');
  }

  const connection = await db.pool.connect();
  const response = await connection.query(
    `INSERT INTO product_categories (categoryName) VALUES ('${category.name}') RETURNING id, categoryName;`,
  );
  connection.release(true);

  if (!response.rows[0]?.id) {
    throw new Error(
      'Could not create a new category. Please contact an administrator.',
    );
  }

  return { id: response.rows[0].id, name: response.rows[0].categoryname };
};

const findCategory = async (category) => {
  const connection = await db.pool.connect();
  if (category.all === true) {
    const response = await connection.query(
      'SELECT categoryName FROM product_categories',
    );
    connection.release(true);
    return response;
  }
  if (!category?.name && category.name !== undefined) {
    connection.release(true);
    throw new Error('Please specify a category');
  }

  const response = await connection.query(
    `SELECT id FROM product_categories WHERE categoryName = '${category.name}';`,
  );
  connection.release(true);

  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: 'Category doesnt exist. Please create a new category.',
    };
  }

  return response.rows[0].id;
};

const createColor = async (color) => {
  if (!color?.name && color.name !== undefined) throw new Error('Please specify a color');

  const connection = await db.pool.connect();
  const response = await connection.query(
    `INSERT INTO product_colors (color) VALUES ('${color.name}') RETURNING id;`,
  );
  connection.release(true);

  if (!response.rows[0]?.id) {
    throw new Error(
      'Could not create a new color. Please contact an administrator.',
    );
  }

  return response.rows[0].id;
};
const findColor = async (color) => {
  const connection = await db.pool.connect();
  if (color.all === true) {
    const response = await connection.query('SELECT color FROM product_colors');
    connection.release(true);
    return response;
  }
  if (!color?.name && color.name !== undefined) {
    connection.release(true);
    throw new Error('Please specify a color');
  }

  const response = await connection.query(
    `SELECT id FROM product_colors WHERE color = '${color.name}';`,
  );
  connection.release(true);

  // color doesnt exist. Return to the function that called me to decide the next step.
  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: 'Color doesnt exist. Please create a new category.',
    };
  }

  return response.rows[0].id;
};

const createSize = async (size) => {
  if (!size?.name && size.name !== undefined) throw new Error('Please specify a size');

  const connection = await db.pool.connect();
  const response = await connection.query(
    `INSERT INTO product_sizes (size) VALUES ('${size.name}') RETURNING id;`,
  );
  connection.release(true);

  if (!response.rows[0]?.id) {
    throw new Error(
      'Could not create a new size. Please contact an administrator.',
    );
  }

  return response.rows[0].id;
};

const findSize = async (size) => {
  const connection = await db.pool.connect();
  if (size.all === true) {
    const response = await connection.query('SELECT size FROM product_sizes');
    connection.release(true);
    return response;
  }
  if (!size?.name && size.name !== undefined) {
    connection.release(true);
    throw new Error('Please specify a size');
  }

  const response = await connection.query(
    `SELECT id FROM product_sizes WHERE size = '${size.name}';`,
  );
  connection.release(true);

  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: 'Size doesnt exist. Please create a new size.',
    };
  }

  return response.rows[0].id;
};

const createProduct = async (product) => {
  if (
    !product.name
    && !product.desc
    && !product.category
    && !product.material
  ) {
    throw new Error(
      'Missing product information. Please contact an administrator.',
    );
  }

  const connection = await db.pool.connect();

  const createImage = await connection.query(
    `INSERT INTO product_images (thumbnail, image) VALUES ('${
      product?.thumbnail ?? ''
    }', '${product?.image ?? ''}')
    RETURNING id;`,
  );
  const creatingProduct = await connection.query(
    /* eslint-disable-next-line */
    `INSERT INTO products (product_name, product_description, category_id, material, image_id) VALUES ('${product.name}', '${product.desc}', ${product.category}, '${product.material}', ${createImage.rows[0].id}) RETURNING id;`
  );
  connection.release(true);

  return creatingProduct.rows[0];
};

const findProduct = async (product) => {
  const connection = await db.pool.connect();
  if (product.name || product.id) {
    let searchQuery;

    if (product.name && (!product.id || product.id < 1)) {
      searchQuery = `products.product_name = '${product.name}'`;
    } else if (product?.id && (!product.name || product.name === '')) {
      searchQuery = `products.id = ${product.id}`;
    } else {
      searchQuery = `products.product_name = '${product.name}' AND products.id = ${product.id}`;
    }

    const response = await connection.query(
      `SELECT id, product_name, product_description, material FROM products WHERE ${searchQuery};`,
    );

    if (response.rowCount === 0) {
      connection.release(true);
      return {
        statusCode: 400,
        message: 'Could not find the product with those parameters.',
      };
    }

    connection.release(true);
    return response.rows[0];
  }

  const totalProducts = await connection.query(
    'SELECT COUNT(id) AS total FROM products;',
  );

  if (totalProducts.rows[0].total < product.offset) {
    connection.release(true);
    throw new Error({
      statusCode: 400,
      message: 'Invalid parameters. Offset cannot exceed total products.',
    });
  }

  const response = await connection.query(
    `SELECT id, product_name, product_description, material
      FROM products
      ORDER BY id
      LIMIT ${product.limit} OFFSET ${product.offset}
      ;`,
  );

  connection.release(true);
  return response.rows;
};

const createOption = async (product) => {
  if (!product.id && !product.size && !product.color) {
    throw new Error(
      'Missing product information. Please contact an administrator.',
    );
  }

  const connection = await db.pool.connect();
  const optionsResponse = await connection.query(
    `INSERT INTO product_options (product_id, size_id, color_id, quantity, price)
      VALUES (${product.id}, ${product.size}, ${product.color}, ${product?.quantity}, ${product?.price})
      RETURNING product_id, size_id, color_id;`,
  );
  await connection.release(true);

  return optionsResponse.rows;
};

const findOption = async (data) => {
  let searchQuery;
  if (data.id && data.product_name) {
    searchQuery = `product_options.product_id=${data.id} AND products.product_name='${data.product_name}'`;
  } else if (data.id) {
    searchQuery = `product_options.product_id=${data.id}`;
  } else if (data.product_name) {
    searchQuery = `products.product_name=${data.product_name}`;
  } else {
    throw new Error(
      'Missing product information. Please contact an administrator.',
    );
  }

  const connection = await db.pool.connect();

  const response = await connection.query(
    `SELECT products.id, product_name, product_description, product_categories.categoryName, color, size, price, quantity, material, thumbnail, image
    FROM product_options
    INNER JOIN products ON products.id = ${
  data.id ?? 'product_options.product_id'
}
    INNER JOIN product_colors ON product_colors.id = ${
  data.color ?? 'product_options.color_id'
}
    INNER JOIN product_sizes ON product_sizes.id = ${
  data.size ?? 'product_options.size_id'
}
    INNER JOIN product_categories ON product_categories.id = products.category_id
    INNER JOIN product_images ON product_images.id = products.image_id
    WHERE ${searchQuery} AND product_options.color_id = product_colors.id AND product_options.size_id = product_sizes.id;`,
  );

  connection.release(true);
  return response.rows;
};

const closeConnection = async () => {
  await db.pool.end();
};

module.exports = {
  findCategory,
  createCategory,
  findColor,
  createColor,
  findSize,
  createSize,
  findProduct,
  createProduct,
  findOption,
  createOption,
  closeConnection,
};
