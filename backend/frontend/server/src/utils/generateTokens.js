import jwt from 'jsonwebtoken';

// We issue two tokens on login:
//  - accessToken: short-lived, sent with every API request in the
//    Authorization header. Short life = if it leaks, damage window is small.
//  - refreshToken: longer-lived, stored as an httpOnly cookie, used only to
//    get a new access token when it expires. Never sent to JS on the client.
export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
}

export function generateRefreshToken(user) {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
}
