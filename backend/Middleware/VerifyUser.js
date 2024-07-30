import  jwt from 'jsonwebtoken';



export const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.userEmail = decoded.email // Assuming the decoded token contains the user's ID
    next();
  });
};
