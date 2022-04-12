const Team = require('../../../../models/team/Team');

module.exports = (req, res) => {
  Team.findTeamById(req.query.id, (err, team) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/teams/edit', {
      page: 'manager/teams/edit',
      title: team.name,
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'partials']
        }
      },
      team,
      manager: req.session.manager
    });
  });
}
