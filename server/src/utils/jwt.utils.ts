import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  
  // @ts-ignore - Type issue with jwt.sign
  return jwt.sign(
    { id: userId },
    secret,
    { expiresIn: '7d' }
  );
};
