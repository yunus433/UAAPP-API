const Uniform = require('../../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.createUniform(req.body, (err, id) => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/uniforms');
  });
}
