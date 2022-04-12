module.exports = (req, res) => {
  if (!req.body || !req.body.password || req.body.password != process.env.ADMIN_PASSWORD) {
    return res.redirect('/admin/login');
  }

  req.session.admin_password = req.body.password;

  return res.redirect('/admin');
}
