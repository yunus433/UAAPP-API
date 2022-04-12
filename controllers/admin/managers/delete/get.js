const Manager = require('../../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/');

    return res.redirect('/admin/managers');
  })
}
