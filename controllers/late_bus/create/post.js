const LateBus = require('../../../models/late_bus/LateBus');

module.exports = (req, res) => {
  req.body.user_id = req.session.user._id;

  LateBus.createLateBus(req.body, (err, id) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      id,
      success: true
    });
  });
}
