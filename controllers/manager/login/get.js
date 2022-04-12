module.exports = (req, res) => {
  return res.render('manager/login', {
    page: 'manager/login',
    title: 'System Manager Login',
    includes: {
      external: {
        css: ['general', 'logo', 'page', 'partials']
      }
    }
  });
}
