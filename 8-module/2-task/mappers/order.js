const mapProduct = require('./product.js');

module.exports = function mapOrder({_id: id, product, ...rest}) {
  return {
    ...rest,
    id,
    product: mapProduct(product),
  };
};
