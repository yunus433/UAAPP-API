const Announcement = require('../../../models/announcement/Announcement');

module.exports = (req, res) => {
  Announcement.findAnnouncementsByFiltersAndSorted(req.body, (err, data) => {
    if (err) return res.status(500).json({
      error: err,
      success: false
    });

    return res.status(200).json({
      skip: data.skip,
      limit: data.limit,
      announcements: data.announcements,
      success: true
    });
  });
}
