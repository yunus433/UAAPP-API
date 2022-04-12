module.exports = (req, res) => {
  return res.render('manager/matches/create', {
    page: 'manager/matches/create',
    title: 'New Match',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'partials']
      }
    },
    manager: req.session.manager
  });
}
