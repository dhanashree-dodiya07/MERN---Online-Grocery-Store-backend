const auth = require('./auth');

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
  });
};

module.exports = adminAuth;