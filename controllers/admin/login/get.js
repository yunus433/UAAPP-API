module.exports = (req, res) => {
  return res.render('admin/login', {
    page: 'admin/login',
    title: 'Admin Login',
    includes: {
      external: {
        css: ['general', 'logo', 'page', 'partials']
      }
    }
  });
}
