const Product = require('../models/Product');
const mongoose = require('mongoose');

const convertProduct = ({_id: id, title, description, price, category, subcategory, images}) => ({
  id,
  title,
  images,
  category,
  subcategory,
  price,
  description,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory: subcategoryId} = ctx.query || {};
  if (!subcategoryId) {
    return next();
  }

  if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
    ctx.throw(400, 'Invalid subcategoryId');
  }
  ctx.subcategoryId = subcategoryId;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const {subcategoryId} = ctx;

  const products = subcategoryId ?
      await Product.find({subcategory: new mongoose.Types.ObjectId(subcategoryId)}) :
      await Product.find({});

  if (!products || !products.length) {
    ctx.body = {
      products: [],
    };
    return next;
  }
  ctx.body = {products: products.map(convertProduct)};
  return next();
};

module.exports.productById = async function productById(ctx, next) {
  const {id: productId} = ctx.params;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    ctx.throw(400, 'Invalid productId');
  }
  const product = await Product.findById(new mongoose.Types.ObjectId(productId));
  if (!product) {
    ctx.throw(404, 'Product not found');
    ctx.body = {
      product: {},
    };
  }
  ctx.body = {
    product: convertProduct(product),
  };
  return next();
};

