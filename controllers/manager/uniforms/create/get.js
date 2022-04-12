module.exports = (req, res) => {
  return res.render('manager/uniforms/create', {
    page: 'manager/uniforms/create',
    title: 'New Uniform',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'partials']
      }
    },
    manager: req.session.manager
  });
}
