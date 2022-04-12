module.exports = (req, res) => {
  return res.render('manager/announcements/create', {
    page: 'manager/announcements/create',
    title: 'New Annoncement',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'partials']
      }
    },
    manager: req.session.manager
  });
}
