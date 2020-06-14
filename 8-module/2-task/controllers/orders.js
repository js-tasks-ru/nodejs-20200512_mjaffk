const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  try {
    const order = ctx.request.body;
    const {email, _id: userId} = ctx.user;

    const newOrder = await Order.create({
      ...order,
      user: userId,
    });

    newOrder.populate('product');

    await sendMail({
      template: 'order-confirmation',
      locals: {
        id: newOrder._id,
        product: newOrder.product,
      },
      to: email,
      subject: 'Подтверждение заказа',
    });

    ctx.status = 200;
    ctx.body = {order: newOrder._id};
    return next();
  } catch (err) {
    throw err;
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  try {
    const orderList = await Order.find({user: ctx.user})
        .populate('product');

    ctx.status = 200;
    ctx.body = {
      orders: orderList ? orderList.map(mapOrder) : [],
    };
    return next();
  } catch (err) {
    throw err;
  }
};
