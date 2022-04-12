const Match = require('../../../../models/match/Match');

module.exports = (req, res) => {
  Match.findMatchByIdAndUpdate(req.query.id, req.body, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/matches');
  });
}
