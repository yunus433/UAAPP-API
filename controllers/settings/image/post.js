const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByIdAndUpdateProfilePhoto(req.session.user._id, req.body, (err, url) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      image: url,
      success: true
    });
  });
}
