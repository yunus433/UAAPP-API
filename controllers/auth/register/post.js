const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.createUser(req.body, (err, id) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    User.findUserById(id, (err, user) => {
      if (err) return res.status(500).json({
        error: err,
        success: false
      });

      return res.status(200).json({
        user,
        success: true
      });
    });
  });
}
