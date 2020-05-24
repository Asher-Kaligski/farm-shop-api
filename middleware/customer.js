const { ADMIN, CUSTOMER } = require('../constants/roles');

module.exports = function (req, res, next) {
  if (!req.user.roles.includes(CUSTOMER) && !req.user.roles.includes(ADMIN))
    return res.status(403).send('Access denied.');

  next();
};
