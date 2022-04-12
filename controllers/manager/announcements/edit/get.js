const Announcement = require('../../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.findAnnouncementById(req.query.id, (err, announcement) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/announcements/edit', {
      page: 'manager/announcements/edit',
      title: announcement.title,
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'partials']
        }
      },
      announcement,
      manager: req.session.manager
    });
  });
}
