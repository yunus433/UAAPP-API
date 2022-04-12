const Manager = require('../../../models/manager/Manager');

module.exports = (req, res) => {
  Manager.findManagerByEmailAndVerifyPassword(req.body, (err, manager) => {
    if (err) return res.redirect('/manager/login');

    req.session.manager = manager;

    return res.redirect('/manager');
  })
}
