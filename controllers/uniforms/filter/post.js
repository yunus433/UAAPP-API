const Uniform = require('../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.findUniformsByFiltersAndSorted(req.body, (err, data) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      skip: data.skip,
      limit: data.limit,
      uniforms: data.uniforms,
      success: true
    });
  });
}
