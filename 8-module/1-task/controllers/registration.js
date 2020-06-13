const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  try {
    const {email, displayName, password} = ctx.request.body;
    const verificationToken = uuid();
    const user = await User.create({
      email,
      displayName,
      verificationToken,
    });
    await user.setPassword(password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
    return next();
  } catch (err) {
    throw err;
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const {verificationToken} = ctx.request.body;
    const user = await User.findOne({verificationToken});

    if (!user) {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    user.verificationToken = undefined;
    await user.save();

    const token = await ctx.login(user);

    ctx.body = {token};
    return next();
  } catch (err) {
    throw err;
  }
};
