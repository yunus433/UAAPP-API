const LateBus = require('../../../models/late_bus/LateBus');

module.exports = (req, res) => {
  LateBus.deleteAllLateBusesByUserIdAndDelete(req.session.user._id, err => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      success: true
    });
  });
}
