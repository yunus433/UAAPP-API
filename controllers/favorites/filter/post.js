const User = require('../../../models/user/User');

module.exports = (req, res) => {
  User.findUserByIdAndGetFavoriteAnnouncements(req.session.user._id, req.body, (err, data) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      skip: data.skip,
      limit: data.limit,
      announcements: data.announcements,
      success: true
    });
  });
}
