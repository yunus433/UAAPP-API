const async = require('async');
const mongoose = require('mongoose');

const cropImage = require('./functions/cropImage');
const deleteImage = require('./functions/deleteImage');
const resizeImage = require('./functions/resizeImage');
const uploadImage = require('./functions/uploadImage');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1000;
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true,
    unique: true,
    image: true
  },
  exp_date: {
    type: Number,
    required: true
  },
  is_used: {
    type: Boolean,
    default: false
  }
});

ImageSchema.statics.createImage = function (data, callback) {
  const Image = this;

  if (!data.file_name)
    return callback('bad_request');

  uploadImage(file_name, (err, url) => {
    if (err) return callback(err);

    const newImageData = { url };
    const newImage = new Image(newImageData);

    newImage.save((err, image) => {
      if (err) return callback(err);

      return callback(null, image.url);
    });
  });
};

ImageSchema.statics.findImageByUrlAndDelete = function (url, callback) {
  if (!url)
    return callback('bad_request');
    
  const Image = this;

  deleteImage(url, err => {
    if (err) return callback(err);

    Image.findOneAndDelete({url}, err => {
      if (err) return callback(err);

      return callback(null);
    });
  });
};

ImageSchema.statics.findExpiredImagesAndDelete = function (callback) {
  const currTime = (new Date()).getTime();
  const autoDeleteTime = 7200000; // 2 hours

  const Image = this;

  Image
    .find({
      is_used: false,
      unixtime: {$lt: currTime - autoDeleteTime}
    })
    .limit(100)
    .then(images => {
      console.log(images);
      async.timesSeries(
        images.length,
        (time, next) => Image.findByIdAndDelete(mongoose.Types.ObjectId(images[time]._id), err => next(err)),
        err => {
          if (err) return callback(err);

          return callback(null);
        }
      );
    })
    .catch(err => {
      return callback(err);
    })
};

ImageSchema.statics.findImageByUrlAndSetAsUsed = function (url, callback) {

};

module.exports = mongoose.model('Image', ImageSchema);
