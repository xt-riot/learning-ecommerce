const createCategory = async (connection, category) => {
  if (!category?.name && category.name !== undefined)
    throw `Missing category information`;

  const response = await connection.query(
    `INSERT INTO product_categories (categoryName) 
    VALUES ('${category.name}') RETURNING id;`
  );

  if (!response.rows[0]?.id)
    throw `Could not create a new category. Please contact an administrator.`;

  return response.rows[0].id;
};

const findCategory = async (connection, category) => {
  if (!category?.name && category.name !== undefined)
    throw `Please specify a category`;

  const response = await connection.query(
    `SELECT id FROM product_categories WHERE categoryName = '${category.name}';`
  );

  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: "Category doesnt exist. Please create a new category.",
    };
  }

  return response.rows[0].id;
};

const createColor = async (connection, color) => {
  if (!color?.name && color.name !== undefined) throw `Please specify a color`;

  const response = await connection.query(`INSERT INTO product_colors (color) 
      VALUES ('${color.name}') RETURNING id;`);

  if (!response.rows[0]?.id)
    throw `Could not create a new color. Please contact an administrator.`;

  return response.rows[0].id;
};
const findColor = async (connection, color) => {
  if (!color?.name && color.name !== undefined) throw `Please specify a color`;

  const response = await connection.query(
    `SELECT id FROM product_colors WHERE color = '${color.name}';`
  );

  // color doesnt exist. Return to the function that called me to decide the next step.
  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: "Color doesnt exist. Please create a new category.",
    };
  }

  return response.rows[0].id;
};

const createSize = async (connection, size) => {
  if (!size?.name && size.name !== undefined) throw `Please specify a size`;

  const response = await connection.query(`INSERT INTO product_sizes (size) 
  VALUES ('${size.name}') RETURNING id;`);

  if (!response.rows[0]?.id)
    throw `Could not create a new size. Please contact an administrator.`;

  return response.rows[0].id;
};

const findSize = async (connection, size) => {
  if (!size?.name && size.name !== undefined) throw `Please specify a size`;

  const response = await connection.query(
    `SELECT id FROM product_sizes WHERE size = '${size.name}';`
  );

  if (response.rowCount === 0) {
    return {
      statusCode: 404,
      message: "Size doesnt exist. Please create a new size.",
    };
  }

  return response.rows[0].id;
};

const createProduct = async (connection, product) => {
  if (!product.name && !product.desc && !product.category && !product.material)
    throw `Missing product information. Please contact an administrator.`;

  const creatingProduct = await connection.query(
    `INSERT INTO products (product_name, product_description, category_id, material)
      VALUES ('${product.name}', '${product.desc}', ${category}, '${product.material}')
      RETURNING id;`
  );

  return creatingProduct.rows[0];
};

const findProduct = async (connection, product) => {
  if (product.name || product.id) {
    const response = await connection.query(
      `SELECT id, product_name, product_description, material
        FROM products
        WHERE ${
          product.id !== -1
            ? `id = ${product.id}`
            : `product_name = '${product.name}'`
        };`
    );

    return response.rows[0];
  }

  const response = await connection.query(
    `SELECT id, product_name, product_description, material
      FROM products
      ORDER BY id
      LIMIT ${product.limit} OFFSET ${product.offset}
      ;`
  );
  return response.rows;
};

const createOption = async (connection, product) => {
  if (!product.id && !product.size_id && !product.color_id)
    throw `Missing product information. Please contact an administrator.`;

  const optionsResponse = await connection.query(
    `INSERT INTO product_options (product_id, size_id, color_id, quantity, price)
    VALUES (${product.id}, ${product.size}, ${product.color}, ${product?.quantity}, ${product?.price})
    RETURNING product_id, size_id, color_id;`
  );

  return optionsResponse.rows[0];
};

const findOption = async (connection, data) => {
  if (!data?.product_name || !data?.product_description || !data?.image_id)
    throw `Missing product information. Please contact an administrator.`;

  const response = await connection.query(
    `SELECT product_name, product_description, product_categories.categoryName, color, size, price, quantity, material, thumbnail, image
    FROM product_options
    INNER JOIN products ON product.product_name = ${
      data.product_name
    } OR product.id = ${data.id}
    INNER JOIN product_colors ON product_colors.id = ${
      data.color ?? "product_options.color_id"
    }
    INNER JOIN product_sizes ON product_sizes.id = ${
      data.size ?? "product_options.size_id"
    }
    INNER JOIN product_categories ON product_categories.id = ${
      data.category ?? "product.category_id"
    }
    INNER JOIN product_images ON product_images.id = ${
      data.image ?? "product.image_id"
    };`
  );

  return response.rows[0];
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
};
