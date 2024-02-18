const cron = require("node-cron");
const notifyChatsAboutRecordingVideo = require('../service/notifyChatsAboutRecordinVideo');

module.exports = () => {
    cron.schedule('0 30 12 * * * *', notifyChatsAboutRecordingVideo);
}