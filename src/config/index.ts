import dotenv from "dotenv";
import path from "path";
import * as jwt from "jsonwebtoken";
import { Secret } from "jsonwebtoken";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  mail: process.env.MAIL,
  mail_password: process.env.MAIL_PASS,
  base_url_server: process.env.BASE_URL_SERVER,
  base_url_client: process.env.BASE_URL_CLIENT,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET as Secret,
    access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
    refresh_secret: process.env.JWT_REFRESH_SECRET as Secret,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  },
};
