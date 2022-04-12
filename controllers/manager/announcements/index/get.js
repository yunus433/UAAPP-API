const Announcement = require('../../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.findAnnouncementsByFiltersAndSorted(req.query, (err, data) => {
    if (err) return res.redirect('/manager');

    return res.render('manager/announcements/index', {
      page: 'manager/announcements/index',
      title: 'Announcements',
      includes: {
        external: {
          css: ['fontawesome', 'general', 'header', 'logo', 'page', 'partials']
        }
      },
      skip: data.skip,
      limit: data.limit,
      announcements: data.announcements,
      manager: req.session.manager
    });
  });
}
