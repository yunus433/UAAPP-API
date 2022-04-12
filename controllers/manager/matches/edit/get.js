const Match = require('../../../../models/match/Match');

module.exports = (req, res) => {
  Match.findMatchById(req.query.id, (err, match) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/matches/edit', {
      page: 'manager/matches/edit',
      title: match.title,
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'partials']
        }
      },
      match,
      manager: req.session.manager
    });
  });
}
