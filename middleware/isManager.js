const Manager = require('../models/manager/Manager');

module.exports = (req, res, next) => {
  if (req.session && req.session.manager) {
    Manager.findManagerById(req.session.manager._id, (err, manager) => {
      if (err) return res.redirect('/manager/login');
      
      req.session.manager = manager;
      return next();
    });
  } else {
    if (req.file && req.file.filename)
      return fs.unlink('./public/res/uploads/' + req.file.filename, () => res.redirect('/manager/login'));

    return res.redirect('/manager/login');
  };
};
