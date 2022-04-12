const Announcement = require('../../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.findAnnouncementByIdAndDelete(req.query.id, err => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/announcements');
  });
}
