const User = require('../models/user/User');

module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    User.findUserByIdAndFormat(req.session.user._id, (err, user) => {
      if (err) return res.status(401).json({
        error: 'not_authanticated_request',
        success: false
      });;
      
      req.session.user = user;
      return next();
    });
  } else {
    if (req.file && req.file.filename) {
      fs.unlink('./public/res/uploads/' + req.file.filename, () => {
        return res.status(401).json({
          error: 'not_authanticated_request',
          success: false
        });;
      });
    } else {
      return res.status(401).json({
        error: 'not_authanticated_request',
        success: false
      });;
    }
  };
};
