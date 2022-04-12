const Uniform = require('../../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.findUniformByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/uniforms');
  });
}
