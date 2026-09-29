import jwt from 'jsonwebtoken';

// Runs on every protected route. Reads "Authorization: Bearer <token>",
// verifies it, and attaches { userId, role } to req.user so downstream
// controllers know who's calling without re-checking the token.
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Usage: router.get('/admin-only', requireAuth, requireRole('admin'), handler)
// Takes one or more allowed roles so it works for routes shared by e.g.
// both 'faculty' and 'admin'.
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have access to this resource' });
    }
    next();
  };
}
