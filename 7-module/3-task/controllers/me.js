module.exports.me = async function me(ctx) {
  ctx.body = {
    email: ctx.user.email,
    displayName: ctx.user.displayName,
  };
};
