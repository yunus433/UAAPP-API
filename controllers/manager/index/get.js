const Manager = require('../../../models/manager/Manager');

module.exports = (req, res) => {
  return res.render('manager/index', {
    page: 'manager/index',
    title: 'System Manager Dashboard',
    includes: {
      external: {
        css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
      }
    },
    manager: req.session.manager
  });
}
