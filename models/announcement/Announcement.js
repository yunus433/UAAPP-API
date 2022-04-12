const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 10000;

const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  created_at: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    default: null,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  }
});

AnnouncementSchema.statics.findAnnouncementById = function (id, callback) {
  const Announcement = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Announcement.findById(mongoose.Types.ObjectId(id.toString()), (err, announcement) => {
    if (err) return callback('database_error');
    if (!announcement) return callback('document_not_found');

    return callback(null, announcement);
  });
};

AnnouncementSchema.statics.createAnnouncement = function (data, callback) {
  const Announcement = this;

  if (!data)
    return callback('bad_request');

  if (!data.title || typeof data.title != 'string' || !data.title.trim().length || data.title.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.text || typeof data.text != 'string' || !data.text.trim().length || data.text.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.url || typeof data.url != 'string' || !data.url.trim().length || data.url.length > MAX_DATABASE_TEXT_FIELD_LENGTH || !validator.isURL(data.url.trim()))
    data.url = null;

  Image.findImageByUrl(data.image, (err, image) => {
    if (err) return callback(err);

    const newAnnouncementData = {
      title: data.title.trim(),
      text: data.text.trim(),
      image: image.url,
      url: data.url ? data.url.trim() : null,
      created_at: (new Date).getTime()
    };

    const newAnnouncement = new Announcement(newAnnouncementData);

    newAnnouncement.save((err, announcement) => {
      if (err) return callback('database_error');

      Image.findImageByUrlAndSetAsUsed(image.url, err => {
        if (err) return callback(err);

        return callback(null, announcement._id.toString());
      });
    });
  });
};

AnnouncementSchema.statics.findAnnouncementsByFiltersAndSorted = function (data, callback) {
  const Announcement = this;

  const filters = {};
  const skip = data.skip && !isNaN(parseInt(data.skip)) && parseInt(data.skip) >= 0 ? parseInt(data.skip) : 0;
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) >= 0 && parseInt(data.limit) < 100 ? parseInt(data.limit) : 100;

  if (data.id_list && Array.isArray(data.id_list) && !data.id_list.find(each => !validator.isMongoId(each.toString())))
    filters._id = { $in: data.id_list.map(each => mongoose.Types.ObjectId(each.toString())) };

  if (data.text && typeof data.text == 'string' && data.text.trim().length && data.text.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.$or = [
      { title: { $regex: data.text.trim() } },
      { text: { $regex: data.text.trim() } }
    ];

  Announcement
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .then(announcements => callback(null, {
      skip,
      limit,
      announcements
    }))
    .catch(err => callback('database_error'));
};

AnnouncementSchema.statics.findAnnouncementByIdAndUpdate = function (id, data, callback) {
  const Announcement = this;

  Announcement.findAnnouncementById(id, (err, announcement) => {
    if (err) return callback(err);

    Announcement.findByIdAndUpdate(announcement._id, {$set: {
      title: data.title && typeof data.title == 'string' && data.title.trim().length && data.title.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.title.trim() : announcement.title,
      text: data.text && typeof data.text == 'string' && data.text.trim().length && data.text.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.text.trim() : announcement.text,
      url: data.url && typeof data.url == 'string' && data.url.trim().length && data.url.length < MAX_DATABASE_TEXT_FIELD_LENGTH && validator.isURL(data.url.trim()) ? data.url.trim() : announcement.url 
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

AnnouncementSchema.statics.findAnnouncementByIdAndDelete = function (id, callback) {
  const Announcement = this;

  Announcement.findAnnouncementById(id, (err, announcement) => {
    if (err) return callback(err);

    Announcement.findByIdAndDelete(announcement._id, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

module.exports = mongoose.model('Announcement', AnnouncementSchema);
