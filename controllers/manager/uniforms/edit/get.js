const Uniform = require('../../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.findUniformById(req.query.id, (err, uniform) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/uniforms/edit', {
      page: 'manager/uniforms/edit',
      title: uniform.name,
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'partials']
        }
      },
      uniform,
      manager: req.session.manager
    });
  });
}
