const Category = require('../models/Category');

const convert = ({_id: id, title, subcategories}) => ({
  id,
  title,
  subcategories: subcategories.map(({_id: id, title}) => ({
    id,
    title,
  })),
});

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({})
      .populate('Category.subcategories');
  ctx.body = {categories: categories.map(convert)};
  return next();
};

