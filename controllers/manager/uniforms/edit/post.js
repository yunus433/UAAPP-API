const Uniform = require('../../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.findUniformByIdAndUpdate(req.query.id, req.body, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/uniforms');
  });
}
