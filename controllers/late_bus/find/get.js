const LateBus = require('../../../models/late_bus/LateBus');

module.exports = (req, res) => {
  LateBus.findLateBusByUserIdForToday(req.session.user._id, (err, late_bus) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      late_bus,
      success: true
    });
  });
}
