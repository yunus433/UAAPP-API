module.exports = (req, res) => {
  return res.render('manager/teams/create', {
    page: 'manager/teams/create',
    title: 'New Team',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'partials']
      }
    },
    manager: req.session.manager
  });
}
