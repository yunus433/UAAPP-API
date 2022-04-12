const Team = require('../../../../models/team/Team');

module.exports = (req, res) => {
  Team.findTeamsByFiltersAndSorted(req.query, (err, data) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/teams/index', {
      page: 'manager/teams/index',
      title: 'Teams',
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
        }
      },
      skip: data.skip,
      limit: data.limit,
      teams: data.teams,
      manager: req.session.manager
    });
  });
}
