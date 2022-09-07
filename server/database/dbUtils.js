const findCategory = async (connection, category) => {
  if (!category?.name) throw `Please specify a category`;
  let response = await connection.query(
    `SELECT id FROM productcategories WHERE categoryname = '${category.name}';`
  );

  if (response.rowCount === 0 && !category?.createNew)
    throw `Category '${category.name}' doesn't exist. Create one before trying to create a new product.`;

  if (response.rowCount === 0)
    response =
      await connection.query(`INSERT INTO productcategories (categoryname, description) 
      VALUES ('${category.name}', '${category.description}') RETURNING id;`);

  return response.rows[0].id;
};

const findColor = async (connection, color) => {
  if (!color?.name) throw `Please specify a color`;
  let response = await connection.query(
    `SELECT id FROM productcolor WHERE color = '${color.name}';`
  );

  if (response.rowCount === 0 && !color?.createNew)
    throw `Color '${color.name}' doesn't exist. Create one before trying to create a new product.`;

  if (response.rowCount === 0)
    response = await connection.query(`INSERT INTO productcolor (color) 
      VALUES ('${color.name}') RETURNING id;`);

  return response.rows[0].id;
};

const findSize = async (connection, size) => {
  if (!size?.name) throw `Please specify a size`;
  let response = await connection.query(
    `SELECT id FROM productsize WHERE size = '${size.name}';`
  );

  if (response.rowCount === 0 && !size?.createNew)
    throw `Size '${size.name}' doesn't exist. Create one before trying to create a new product.`;

  if (response.rowCount === 0)
    response = await connection.query(`INSERT INTO productsize (size) 
        VALUES ('${size.name}') RETURNING id;`);

  return response.rows[0].id;
};

const findOption = async (connection, option) => {
  if (!option?.sizeID || !option?.colorID || !option?.productID)
    throw `Something is wrong with the color, the size or the product`;

  let response = await connection.query(
    `SELECT productname, productdescription, categoryname, categorydescription, color, size, price, quantity, image
        FROM product_options
        INNER JOIN product ON product.id = ${option.productID}
        INNER JOIN productcolor ON productcolor.id = ${option.colorID}
        INNER JOIN productsize ON productsize.id = ${option.sizeID}
        INNER JOIN productcategories ON productcategories.id = product.category_id;`
  );

  if (response.rowCount === 0 && !option?.createNew)
    throw `Could not create an association between the color, the size and the product. Please contact an administrator.`;

  if (response.rowCount === 0)
    response =
      await connection.query(`INSERT INTO product_options (product_id, size_id, color_id) 
          VALUES (${option.productID}, ${option.sizeID}, ${option.colorID}) RETURNING id;`);

  return response.rows[0].id;
};

const findSize = async (connection, product) => {
  if (!product?.name || !product?.desc || !product?.category)
    throw `Missing product information`;
  let response = await connection.query(
    `SELECT id FROM product WHERE productname = '${product.name}';`
  );

  if (response.rowCount === 0 && !size?.createNew)
    throw `Could not create the product ${product.name}. Please contact an administrator.`;

  if (response.rowCount === 0)
    response =
      await connection.query(`INSERT INTO product (productname, description, category_id)
      VALUES ('${product.name}', '${product.desc}', ${product.category}) RETURNING id`);

  return response.rows[0].id;
};

module.exports = {
  findCategory,
  findColor,
  findSize,
  findOption,
  findProduct,
};
