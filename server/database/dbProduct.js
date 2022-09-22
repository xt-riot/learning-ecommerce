const {
  findProduct,
  findProductsInCategory,
  createProduct,
  findOption,
  createOption,
  updateOption,
} = require("./dbUtils");

const Color = require("./dbColor");
const Size = require("./dbSize");
const Category = require("./dbCategory");

const Products = {
  async addProduct(product) {
    try {
      const color = await Color.getColor({ color: product?.color });

      if (color?.statusCode === 404) {
        throw {
          statusCode: 404,
          message: `Color '${
            product?.color ?? "NOT_SPECIFIED"
          }' not found. Please create the color to add the product.`,
        };
      }

      const size = await Size.getSize({ size: product?.size });

      if (size?.statusCode === 404) {
        throw {
          statusCode: 404,
          message: `Size '${
            product?.size ?? "NOT_SPECIFIED"
          }' not found. Please create the size to add the product.`,
        };
      }

      const category = await Category.getCategory({ name: product?.category });

      if (category?.statusCode === 404) {
        throw {
          statusCode: 404,
          message: `Category '${
            product?.category ?? "NOT_SPECIFIED"
          }' not found. Please create the category to add the product.`,
        };
      }

      let productHolder = await this.getProduct(product);

      if (productHolder?.statusCode === 400) {
        productHolder = await createProduct({
          name: product.name,
          desc: product.desc,
          category,
          material: product.material,
        });
      }

      const productConfigurationAlreadyExists = await findOption({
        id: productHolder.id,
        name: product.name,
        color,
        size,
        category,
        image: product.image,
      });

      // console.log(productConfigurationAlreadyExists);
      if (productConfigurationAlreadyExists.length > 0) {
        throw {
          statusCode: 400,
          message: `Product ${product?.name} already exists with those options. Please try updating the existing configuration.`,
        };
      }

      const response = await createOption({
        id: productHolder.id,
        color,
        size,
        category,
        quantity: product?.quantity,
        price: product?.price,
        image: product?.image,
      });

      return await findOption({
        id: response[0].product_id,
        size: response[0].size_id,
        color: response[0].color_id,
      });
    } catch (e) {
      throw {
        statusCode: e.statusCode || 500,
        message: e,
      };
    }
  },
  async getProducts({ limit = 10, offset = 0, ...args } = {}) {
    const parsedLimit = parseInt(limit, 10);
    const parsedOffset = parseInt(offset, 10);

    if (
      Number.isNaN(parsedLimit) ||
      parsedLimit < 0 ||
      Number.isNaN(parsedOffset) ||
      parsedOffset < 0 ||
      Object.keys(args).length > 0
    ) {
      throw { statusCode: 400, message: "Invalid parameters." };
    }

    try {
      const response = await findProduct({
        id: null,
        name: null,
        limit: parsedLimit,
        offset: parsedOffset,
      });

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },
  async getProduct(product) {
    if (!product?.name && !product?.id) {
      throw {
        statusCode: 400,
        message: "Missing product information",
      };
    }

    try {
      const response = await findProduct({
        id: product.id,
        name: product.name,
      });

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },
  async getProductByCategory(category) {
    if (typeof category !== "string" && typeof category?.name !== "string") {
      throw {
        statusCode: 400,
        message: "Missing category information.",
      };
    }

    try {
      const productIDs = await findProductsInCategory({
        name: category || category.name,
      });

      const response = await Promise.all(
        productIDs.map(async (productID) =>
          this.getOption({
            id: productID.id,
          })
        )
      );

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },
  async getOption(product) {
    if (!product?.name && !product?.id) {
      throw {
        statusCode: 400,
        message: "Missing product information",
      };
    }

    try {
      const response = await findOption({
        id: product.id,
        name: product.name,
      });

      return response;
    } catch (e) {
      throw { statusCode: e.statusCode || 500, message: e.message };
    }
  },

  async updateProduct(product) {
    if (
      !product.oldProduct ||
      (!product.color && !product.size && !product.quantity && !product.price)
    ) {
      throw {
        statusCode: 400,
        message: "Missing product information -- cannot update the product.",
      };
    }

    console.log("product in update", product);
    const color = product.color
      ? await Color.getColor({ color: product.color })
      : await Color.getColor({ color: product.oldProduct.color });

    if (color?.statusCode === 404) {
      throw {
        statusCode: 404,
        message: `Color '${product?.color ?? "NOT_SPECIFIED"}' not found.`,
      };
    }

    const size = product.size
      ? await Size.getSize({ size: product.size })
      : await Size.getSize({ size: product.oldProduct.size });

    if (size?.statusCode === 404) {
      throw {
        statusCode: 404,
        message: `Size '${product?.size ?? "NOT_SPECIFIED"}' not found.`,
      };
    }

    const oldProduct = {
      ...product.oldProduct,
      color: await Color.getColor({ color: product.oldProduct.color }),
      size: await Size.getSize({ size: product.oldProduct.size }),
    };

    const response = await updateOption({
      oldProduct,
      color,
      size,
      quantity: product.quantity || 0,
      price: product.price || 0,
    });

    if (response.rowCount === 0) {
      return false;
    }

    return true;
  },
};

module.exports = Products;
