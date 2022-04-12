const Uniform = require('../../../../models/uniform/Uniform');

module.exports = (req, res) => {
  Uniform.findUniformsByFiltersAndSorted(req.query, (err, data) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/uniforms/index', {
      page: 'manager/uniforms/index',
      title: 'Uniforms',
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
        }
      },
      skip: data.skip,
      limit: data.limit,
      uniforms: data.uniforms,
      manager: req.session.manager
    });
  });
}
