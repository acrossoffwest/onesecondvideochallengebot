const { Video, Chat} = require('../models');
const s3 = require('./s3');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
const path = require('path');
const {createReadStream, readFileSync, unlink} = require("fs");

module.exports = async (ctx, chat, seconds) => {
    const videos = await Video.findAll({
        where: {
            chatId: chat.id
        },
        limit: seconds,
        order: [
            ['createdAt', 'ASC']
        ]
    });
    if (videos.length === 0) {
        ctx.reply('You don\'t have any video clips to compile');
        return;
    }
    ctx.reply(`Found ${videos.length} videos to compile`);
    const urls = [];
    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        urls.push(await s3.getPresignedUrl(video.filepath));
    }
    ctx.reply(`Prepared URLs to the videos for compiling them in one video`);
    let command = ffmpeg();
    urls.forEach((url) => {
        command = command.addInput(url);
    });
    const tempDir = os.tmpdir();
    const resultTempFilename = `${chat.id}-${new Date().getMilliseconds()}.mp4`
    const tempFilePath = path.join(tempDir, resultTempFilename);
    console.log(`Temp file: ${tempFilePath}`)
    console.log('Video URLs: ', urls)
    ctx.reply(`Begin to compile video`);

    let timeoutId = setTimeout(() => {
        console.log('Stop ffmpeg command')
        command.ffmpegProc.stdin.write('q'); // Send 'q' to ffmpeg to stop it.
    }, 120 * 1000); // 2 minutes timeout

    command
        .fps(25)
        .format('mp4')
        .videoCodec('libx264')
        .on('stderr', function(stderrLine) {
            console.log('Stderr output: ' + stderrLine);
        })
        .on('error', function(err) {
            console.log('An error occurred: ' + err.message);
            ctx.reply(`Sorry but there something went wrong. Try again later.`);
        })
        .on('end', function() {
            console.log('Merging finished !');
            ctx.reply(`Video compiled, wait for it`);
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
                        console.log('Timeout cleared');
                        clearTimeout(timeoutId);
                        unlink(tempFilePath, () => {
                            console.log('Temporary file deleted');
                        });
                    });

            });
        })
        .mergeToFile(tempFilePath, './output-temp-dir');
}