module.exports = async function handleMongooseValidationError(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err.name !== 'ValidationError') throw err;

    ctx.status = 400;

    const errors = Object.entries(err.errors)
        .reduce((obj, [key, value]) => ({
          ...obj,
          [key]: value.message,
        }), {});

    for (const field of Object.keys(err.errors)) {
      errors[field] = err.errors[field].message;
    }

    ctx.body = {
      errors: errors,
    };
  }
};
