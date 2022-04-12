const Match = require('../../../../models/match/Match');

module.exports = (req, res) => {
  Match.createMatch(req.body, (err, id) => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/matches');
  });
}
