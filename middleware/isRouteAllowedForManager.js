const Manager = require('../models/manager/Manager');

module.exports = (req, res, next) => {
  Manager.findManagerById(req.session.manager._id, (err, manager) => {
    if (err) return res.redirect('/manager/login');
    
    req.session.manager = manager;

    const route = req.url.split('/')[1];

    if (!manager.allowed_routes.includes(route))
      return res.redirect('/managers');

    return next();
  });
};
