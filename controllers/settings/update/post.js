const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByIdAndUpdate(req.session.user._id, req.body, err => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({ success: true });
  });
}
