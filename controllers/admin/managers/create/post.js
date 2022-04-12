const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.createManager(req.body, (err, id) => {
    if (err) return res.redirect('/');

    return res.redirect('/admin/managers');
  })
}
