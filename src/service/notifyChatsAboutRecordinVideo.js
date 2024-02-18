const {Chat} = require("../models");
const {Telegraf} = require("telegraf");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

module.exports = async () => {
    const chats = await Chat.findAll();
    const currentDate = new Date();
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    for (const chat of chats) {
        const video = await Chat.findOne({
            where: {
                createdAt: {
                    [Op.between]: [start, end]
                },
                chatId: chat.id
            }
        });
        if (!video) {
            await bot.telegram.sendMessage(chat.telegramChatId, 'Wake up, make a video and get your nice video at the end of month.');
        }
    }
}