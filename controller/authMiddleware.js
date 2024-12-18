import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()
// Middleware to verify if a user is authenticated

export const AuthorizeUserToken = (req,res,next)=>{
  const token = req.cookies.token
  
  if (!token) return res.status(403).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid token' }); // If invalid, send error
    if(!(payload.roleID === 1 || payload.roleID === 2)) return res.status(401).json({ error: 'Unauthorized: Invalid Role.' });
    next()
  })
}

export const AuthorizeStudentToken = (req, res, next) => {
  const token = req.cookies.token;
  // If no token is provided, return unauthorized error
  if (!token) return res.status(403).json({ error: 'Unauthorized' });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' }); // If invalid, send error
    if(user.roleID !== 1) return res.status(401).json({ error: 'Unauthorized: Student Credentials required.' }); // If invalid, send error
    req.user = user;                       // Attach the user information to the request object
    next();                                // Move to the next middleware or route handler
  });
};
export const AuthorizeAdminToken = (req, res, next) => {
  const token = req.cookies.token;
  
  // If no token is provided, return unauthorized error
  if (!token) return res.status(403).json({ error: 'Unauthorized' });

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' }); // If invalid, send error
    console.log(user)
    if(user.roleID !== 2) return res.status(401).json({ error: 'Unauthorized: Admin Credentials required.' });
    req.user = user;                       // Attach the user information to the request object
    next();                                // Move to the next middleware or route handler
  });
};

