const Announcement = require('../../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.createAnnouncement(req.body, (err, id) => {
    if (err) return res.redirect('/manager');

    return res.redirect('/manager/announcements');
  });
}
