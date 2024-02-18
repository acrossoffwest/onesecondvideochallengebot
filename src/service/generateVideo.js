const { Video, Chat} = require('../models');
const s3 = require('./s3');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const path = require('path');
const {Telegraf} = require("telegraf");
const {createReadStream, readFileSync, unlink} = require("fs");
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

module.exports = async (ctx, chat, seconds) => {
    const videos = await Video.findAll({
        where: {
            chatId: chat.id
        },
        limit: seconds
    });
    const urls = [];
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        urls.push(await s3.getPresignedUrl(video.filepath));
    }
    let command = ffmpeg();
    urls.forEach((url) => {
        command = command.addInput(url);
    });
    const tempDir = os.tmpdir();
    const resultTempFilename = `${chat.id}.mp4`
    const tempFilePath = path.join(tempDir, resultTempFilename);

    command
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
        })
        .on('end', function() {
            console.log('Merging finished !');
            const buffer = readFileSync(tempFilePath);
            s3.putObject(s3.defaultBucket, resultTempFilename, buffer, async (err, etag) => {
                if (err) {
                    return console.log(err);
                }
                console.log('Compilation file uploaded successfully.');
                ctx.replyWithVideo({ source: createReadStream(tempFilePath) })
                    .then(() => {
                        console.log('Video sent');
                    })
                    .catch((err) => {
                        console.error(err);
                    }).finally(() => {
                        unlink(tempFilePath, () => {
                            console.log('Temporary file deleted');
                        });
                    });

            });
        })
        .mergeToFile(tempFilePath);
}