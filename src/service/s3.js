const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    port: 443,
    useSSL: true,
    accessKey: process.env.S3_ACCESS_KEY_ID,
    secretKey: process.env.S3_SECRET_ACCESS_KEY,
});

minioClient.defaultBucket = process.env.S3_BUCKET;

minioClient.getPresignedUrl = async (filepath) => {
    let expiry = 24*60*60;

    return await minioClient.presignedGetObject(minioClient.defaultBucket, filepath, expiry);
}

module.exports = minioClient;