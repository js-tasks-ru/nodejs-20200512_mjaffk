const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  const user = await User.findOne({email});

  if (user) {
    return done(null, user);
  }

  const newUser = new User({
    email,
    displayName,
  });

  newUser.save((err, user) => {
    if (err) {
      return done(err);
    }
    done(null, user);
  });
};
