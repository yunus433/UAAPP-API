module.exports = (req, res, next) => {
  if (req.session.admin_password == process.env.ADMIN_PASSWORD)
    return next();

  if (!req.file || !req.file.filename)
    return res.redirect('/admin/login');

  fs.unlink('./public/res/uploads/' + req.file.filename, () => res.redirect('/admin/login'));
}
