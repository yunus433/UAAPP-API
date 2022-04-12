module.exports = (req, res) => {
  return res.render('admin/managers/create', {
    page: 'admin/managers/create',
    title: 'New System Manager',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
      }
    },
    allowed_route_values: ['announcements', 'late_bus', 'matches', 'teams', 'uniforms']
  });
}
