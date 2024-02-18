const { Chat } = require('../models');

module.exports = async (ctx) => {
  const { chat } = ctx.message;
  const [chatModel, createdChat] = await Chat.findOrCreate({
    where: { telegramChatId: chat.id },
    defaults: {
      name: chat.title || chat.username,
      telegramChatId: chat.id
    }
  });
  return chatModel;
}