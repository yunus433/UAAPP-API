const Match = require('../../../../models/match/Match');

module.exports = (req, res) => {
  Match.findMatchByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/matches');
  });
}
