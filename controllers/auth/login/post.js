const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByEmailAndVerifyPassword(req.body, (err, user) => {
    if (err)
      return res.status(500).json({
        error: err,
        success: false
      });

    req.session.user = user;

    return res.status(200).json({
      user,
      success: true
    });
  });
}
