const createCategory = async (connection, category) => {
  if (!category?.name) throw `Missing category information`;

  const response = await connection.query(
    `INSERT INTO productcategories (categoryname, description) 
    VALUES ('${category.name}', '${category.description}') RETURNING id;`
  );

  if (!response.rows[0]?.id)
    throw `Could not create a new category. Please contact an administrator.`;

  return response.rows[0].id;
};

const findCategory = async (connection, category) => {
  if (!category?.name) throw `Please specify a category`;

  const response = await connection.query(
    `SELECT id FROM productcategories WHERE categoryname = '${category.name}';`
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
  if (!color?.name) throw `Please specify a color`;

  const response = await connection.query(`INSERT INTO productcolor (color) 
      VALUES ('${color.name}') RETURNING id;`);

  if (!response.rows[0]?.id)
    throw `Could not create a new color. Please contact an administrator.`;

  return response.rows[0].id;
};
const findColor = async (connection, color) => {
  if (!color?.name) throw `Please specify a color`;

  const response = await connection.query(
    `SELECT id FROM productcolor WHERE color = '${color.name}';`
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
  if (!size?.name) throw `Please specify a size`;

  const response = await connection.query(`INSERT INTO productsize (size) 
  VALUES ('${size.name}') RETURNING id;`);

  if (!response.rows[0]?.id)
    throw `Could not create a new size. Please contact an administrator.`;

  return response.rows[0].id;
};

const findSize = async (connection, size) => {
  if (!size?.name) throw `Please specify a size`;

  const response = await connection.query(
    `SELECT id FROM productsize WHERE size = '${size.name}';`
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
  if (
    !product?.name ||
    !product?.desc ||
    !product?.category ||
    !product?.color ||
    !product?.size
  )
    throw `Missing product information. Please contact an administrator.`;

  // Create a new product
  const productResponse = await connection.query(
    `INSERT INTO product (productname, description, category_id)
    VALUES ('${product.name}', '${product.desc}', ${product.category})
    RETURNING id;`
  );

  console.log(productResponse);

  // Could not create the product
  if (!productResponse.rows[0]?.id)
    throw `Could not create a new product. Please contact an administrator.`;

  // Create a new entry in the table that holds all the associations.
  const optionsResponse = await connection.query(
    `INSERT INTO product_options (product_id, size_id, color_id, quantity, price)
    VALUES (${productResponse.rows[0].id}, ${product.size}, ${product.color}, ${product.quantity}, ${product.price})
    RETURNING *;`
  );

  // Could not create the associations.
  if (!optionsResponse.rows[0]?.product_id)
    throw `Could not create a new product. Please contact an administrator.`;

  // Get all the values we need.
  const response = await connection.query(
    `select product.productname, product.description, productcategories.categoryname, productcategories.description, color, size, price, quantity, image
    from product_options
    INNER JOIN product ON product.id = ${optionsResponse.rows[0].product_id}
    INNER JOIN productcolor ON productcolor.id = ${optionsResponse.rows[0].color_id}
    INNER JOIN productsize ON productsize.id = ${optionsResponse.rows[0].size_id}
    INNER JOIN productcategories ON productcategories.id = product.category_id;`
  );

  // Could not get the values.
  if (response.rowCount === 0)
    throw `Something went wrong. Please contact an administrator.`;

  // Return the values
  return response.rows[0];
};

const findProduct = async (connection, product) => {
  if (!product?.name || !product?.category) throw `Missing product information`;

  const response = await connection.query(
    `SELECT product.id, product.productname, product.description, categoryname, productcategories.description, color, size, price, quantity, image
    FROM product
    INNER JOIN product_options ON product.id = product_options.product_id ${
      product?.size ? `AND product_options.size_id = ${product?.size}` : ``
    } ${
      product?.color ? `AND product_options.color_id = ${product?.color}` : ``
    }
    INNER JOIN productcolor ON productcolor.id = product_options.color_id
    INNER JOIN productsize ON productsize.id = product_options.size_id
    INNER JOIN productcategories ON productcategories.id = product.category_id
    WHERE productname = '${product.name}';`
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
};
