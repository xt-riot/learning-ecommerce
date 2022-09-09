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
  if (!product?.id || !product?.category || !product?.color || !product?.size)
    throw `Missing product information. Please contact an administrator.`;

  // Create a new entry in the table that holds all the associations.
  const optionsResponse = await connection.query(
    `INSERT INTO product_options (productID, sizeID, colorID, quantity, price)
    VALUES (${product.id}, ${product.size}, ${product.color}, ${product?.quantity}, ${product?.price})
    RETURNING product_id, size_id, color_id;`
  );

  // Could not create the associations.
  if (!optionsResponse.rows[0]?.product_id)
    throw `Could not create a new product. Please contact an administrator.`;

  // Get all the values we need.
  const response = await connection.query(
    `select productName, productDescription, categoryName, color, size, price, material, quantity, thumbnail, image
    from product_options
    INNER JOIN product ON product.id = ${optionsResponse.rows[0].product_id}
    INNER JOIN product_colors ON product_colors.id = ${optionsResponse.rows[0].color_id}
    INNER JOIN product_sizes ON product_sizes.id = ${optionsResponse.rows[0].size_id}
    INNER JOIN product_categories ON product_categories.id = product.categoryID;
    INNER JOIN product_images ON product_images.id = product.imageID`
  );

  // Could not get the values.
  if (response.rowCount === 0)
    throw `Something went wrong. Please contact an administrator.`;

  // Return the values
  return response.rows[0];
};

const findProduct = async (connection, product) => {
  if (!product?.name && !product?.id && !product?.limit && !product?.pagination)
    throw `Missing product information`;

  // Request to serve all the products in the database.
  if (!product.name && !product.id) {
    const response = await connection.query(
      `SELECT id, productName, productDescription, material
      FROM products
      ORDER BY id
      LIMIT ${product.limit} OFFSET ${product.offset}
      ;`
    );
    return response.rows;
  }

  // If it wasn't for the whole database, find the corresponding product
  const response = await connection.query(
    `SELECT id, productName, productDescription, material
      FROM products
      WHERE ${
        product.id !== -1
          ? `id = ${product.id}`
          : `productname = '${product.name}'`
      };`
  );

  if (response.rows[0] === undefined)
    throw {
      statusCode: 404,
      message: `Product with ${
        product.name ? `name '${product.name}'` : `id '${product.id}'`
      } does not exist.`,
    };

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
};
