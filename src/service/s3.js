const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    port: 443,
    useSSL: true,
    accessKey: process.env.S3_ACCESS_KEY_ID,
    secretKey: process.env.S3_SECRET_ACCESS_KEY,
});

module.exports = minioClient;