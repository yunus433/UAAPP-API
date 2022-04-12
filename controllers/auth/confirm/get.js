const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByIdAndSendConfirmationCode(req.session.user._id, err => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({ success: true });
  });
}
