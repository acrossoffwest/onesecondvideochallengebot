require('dotenv').config();

const { Telegraf } = require('telegraf')
const saveUser = require('./middleware/saveUser');
const saveChat = require('./middleware/saveChat');
const saveMessage = require('./middleware/saveMessage');
const s3 = require('./service/s3');
const generateVideo = require('./service/generateVideo');
const fetch = require('node-fetch');
const {Video, Chat, User} = require("./models");
const scheduler = require('./scheduler');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

scheduler();

bot.use(async (ctx, next) => {
    const chat = await saveChat(ctx);
    const user = await saveUser(ctx);
    await saveMessage(ctx, chat, user);
    await next();
});

bot.start((ctx) => ctx.reply(`
Welcome and let\'s start our 1 second video challenge journey.

I will send you a daily reminder to record a 1 second video and every month I will generate 30 second video which you sent to me.
 
Also 368 seconds video if you will rich that point.
`));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears('/list', async (ctx) => {
    const chat = await Chat.findOne({where: { telegramChatId: ctx.chat.id }});
    const videos = await Video.findAll({where: { chatId: chat.id }});
    ctx.reply(`You have ${videos.length} videos clips`);
});
bot.hears('/generate', async (ctx) => {
    const chat = await Chat.findOne({where: { telegramChatId: ctx.chat.id }});
    await generateVideo(ctx, chat, 5);
});
bot.on('video', async (ctx) => {
    const fileLink = await ctx.telegram.getFileLink(ctx.message.video.file_id);
    const response = await fetch(fileLink.href);
    const buffer = await response.buffer();
    const filepath = `${ctx.message.video.file_id}.mp4`;
    s3.putObject(process.env.S3_BUCKET, filepath, buffer, async (err, etag) => {
        if (err) {
            return console.log(err);
        }
        console.log('File uploaded successfully.');
        const chat = await Chat.findOne({
            where: {
                telegramChatId: ctx.chat.id
            }
        });
        await Video.create({
            filepath: filepath,
            chatId: chat.id
        });
        ctx.reply(`Video saved`)
    });
})
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

