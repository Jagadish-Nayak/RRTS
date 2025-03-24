import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return error;
  }
};
