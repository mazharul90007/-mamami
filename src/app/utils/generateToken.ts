import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (
  payload: object,
  secret: Secret,
  expiresIn: string | number,
) => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  });
};
