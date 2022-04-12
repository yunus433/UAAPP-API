const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findAllManagersSorted((err, managers) => {
    if (err) return res.redirect('/');

    return res.render('admin/managers/index', {
      page: 'admin/managers/index',
      title: 'Admin System Managers',
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
        }
      },
      managers
    });
  })
}
