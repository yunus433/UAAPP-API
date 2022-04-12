const Team = require('../../../../models/team/Team');

module.exports = (req, res) => {
  Team.findTeamByIdAndUpdate(req.query.id, req.body, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/teams');
  });
}
