import dotenv from 'dotenv';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  brevo_user: process.env.BREVO_USER,
  brevo_sender_email: process.env.BREVO_SENDER_EMAIL,
  brevo_api_key: process.env.BREVO_API_KEY,
  base_url_server: process.env.BASE_URL_SERVER,
  base_url_client: process.env.BASE_URL_CLIENT,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_region: process.env.AWS_REGION,
  aws_s3_bucket: process.env.AWS_S3_BUCKET,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET as Secret,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as Secret,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
};
