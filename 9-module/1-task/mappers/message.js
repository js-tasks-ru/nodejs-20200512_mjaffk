module.exports = function mapMessage({_id: id, user, date, text}) {
  return {
    id,
    user,
    date,
    text,
  };
};
