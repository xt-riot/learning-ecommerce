const db = require("./db.js");
const { findCategory, findColor, findSize } = require("./dbUtils.js");

const productMapper = [
  "name",
  "desc",
  "category",
  "color",
  "price",
  "quantity",
  "image",
];
const productMapperTypes = ["string", "string", "number", "number", "string"];

const Products = {
  addProduct: async function (product) {
    // if (args.length !== productMapper.length)
    //   throw { statusCode: 400, message: "Missing product information." };

    // const areValidTypes = args
    //   .map((item, index) => {
    //     if (typeof item === productMapperTypes[index] || Array.isArray(item))
    //       return true;

    //     return false;
    //   })
    //   .reduce((acc, item) => item && acc, true);

    // if (!areValidTypes)
    //   throw { statusCode: 400, message: "Invalid type of data provided." };
    try {
      const connection = await db.pool.connect();

      const name = await connection.query(
        `SELECT id FROM product WHERE productname = '${product.name}';`
      );
      if (name.rowCount !== 0)
        throw `Product '${product.name}' already exists. Try updating it instead of creating a new one.`;

      const category = await findCategory(connection, {
        name: product?.category,
        description: product?.categoryDescription || "",
        createNew: product?.createNewCategory || false,
      });

      console.log(category);

      const color = await findColor(connection, {
        name: product?.color,
        createNew: product?.createNewColor || false,
      });
      console.log(color);

      const size = await findSize(connection, {
        name: product?.size,
        createNew: product?.createNewSize || false,
      });
      console.log(size);
      //   const color = await connection.query(
      //     `SELECT id FROM productcolor WHERE color = '${product.color}';`
      //   );
      //   if (color.rowCount === 0)
      //     throw `Color '${product.color}' doesn't exist. Create one before trying to create a new product.`;

      //   const size = await connection.query(
      //     `SELECT id FROM productsize WHERE size = '${product.size}'`
      //   );
      //   if (size.rowCount === 0)
      //     throw `Size '${product.size}' doesn't exist. Create one before trying to create a new product.`;

      //   const createOption = await connection.query(
      //     `INSERT INTO productoptions (color_id, size_id) VALUES (${color.rows[0].id}, ${size.rows[0].id});`
      //   );
      //   const option = await connection.query(
      //     `INSERT INTO productoptions (color_id, size_id) VALUES (${color.rows[0].id}, ${size.rows[0].id});
      //         ON CONFLICT DO NOTHING RETURNING id`
      //   );
      //   if (option.rowCount === 0) throw `Failed to add the product.`;

      //   const createProduct = await connection.query(
      //     `INSERT INTO product (productname, description, category_id) VALUES ('${product.name}', '${product.desc}', ${category.rows[0].id})`
      //   );

      //   console.log(option);

      //   const query = `INSERT INTO product_options (product_id, option_id)
      //                     VALUES (${createProduct.rows[0].id}, ${option.rows[0].id})
      //                  `;
    } catch (e) {
      console.log(e);
      throw {
        statusCode: 500,
        message: `Something went wrong with the database.`,
      };
    }

    // try {
    //   const connection = await db.pool.connect();
    //   const query = `select * from product where productname = ${name}`;
    //   const response = await connection.query(query);
    //   console.log(response.rows);
    // } catch (e) {
    //   console.log(e);
    //   throw {
    //     statusCode: 500,
    //     message: `Something went wrong with the database.`,
    //   };
    // }
  },
};

const Users = {
  addUser: function (user) {
    return "asd";
  },
};

module.exports = {
  Products,
  Users,
};
