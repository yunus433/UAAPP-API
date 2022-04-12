const Match = require('../../../../models/match/Match');

module.exports = (req, res) => {
  Match.findMatchsByFiltersAndSorted(req.query, (err, data) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/matches/index', {
      page: 'manager/matches/index',
      title: 'Matchs',
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
        }
      },
      skip: data.skip,
      limit: data.limit,
      matches: data.matches,
      manager: req.session.manager
    });
  });
}
