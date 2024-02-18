const { Message } = require('../models');

module.exports = async (ctx, chat, user) => {
  await Message.create({
    text: ctx.message.text,
    userId: user.id,
    chatId: chat.id,
    telegramMessageId: ctx.message.message_id
  });
}