import AWS from 'aws-sdk';
import config from '../../config';

const s3 = new AWS.S3({
  accessKeyId: config.aws_access_key_id,
  secretAccessKey: config.aws_secret_access_key,
  region: config.aws_region,
});

export const uploadToS3 = async (
  buffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> => {
  const params = {
    Bucket: config.aws_s3_bucket!,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
    ALC: 'private',
  };
  const result = await s3.upload(params).promise();
  return result.Location;
};

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  const key = fileUrl.split('/').slice(-1)[0];

  const params = {
    Bucket: config.aws_s3_bucket!,
    Key: key,
  };

  await s3.deleteObject(params).promise();
};

export const getSignedUrl = async (
  fileUrl: string,
  expiresIn: number = 3600,
): Promise<string> => {
  const key = fileUrl.split('/').slice(-1)[0];

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Expires: expiresIn,
  };

  return s3.getSignedUrl('getObject', params);
};
