const Announcement = require('../../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.findAnnouncementByIdAndUpdate(req.query.id, req.body, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/announcements');
  });
}
