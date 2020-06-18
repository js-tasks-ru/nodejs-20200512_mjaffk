const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messageList(ctx) {
  const messages = await Message.find({'chat': ctx.user.id})
      .sort('-date')
      .limit(20);
  ctx.body = {messages: messages ? messages.map(mapMessage) : []};
};
