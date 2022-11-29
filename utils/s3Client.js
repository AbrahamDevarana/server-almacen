const { S3Client } = require("@aws-sdk/client-s3")

const s3Client = new S3Client ({
    forcePathStyle: false,
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

module.exports = {  s3Client }
