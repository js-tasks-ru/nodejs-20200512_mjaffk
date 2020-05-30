const Product = require('../models/Product');

const convertProduct = ({_id: id, title, description, price, category, subcategory, images}) => ({
  id,
  title,
  images,
  category,
  subcategory,
  price,
  description,
});

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.query || {};
  const products = await Product
      .find({$text: {$search: query}}, {score: {$meta: 'textScore'}})
      .sort({score: {$meta: 'textScore'}});

  ctx.body = {products: products ? products.map(convertProduct) : []};
  return next();
};
