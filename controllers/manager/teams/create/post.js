const Team = require('../../../../models/team/Team');

module.exports = (req, res) => {
  Team.createTeam(req.body, (err, id) => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/teams');
  });
}
