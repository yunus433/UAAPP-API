const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const sendEmail = require('../../utils/sendEmail');

const Announcement = require('../announcement/Announcement');
const Image = require('../image/Image');

const hashPassword = require('./functions/hashPassword');
const getUser = require('./functions/getUser');
const verifyPassword = require('./functions/verifyPassword');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 6;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e3;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;
const ONE_HOUR_IN_MS = 60 * 60 * 1000;
const EMAIL_DOMAIN_VERIFICATION_STRING = '@my.uaa.k12.tr';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  is_email_confirmed: {
    type: Boolean,
    default: false
  },
  email_confirmation_code: {
    type: Number,
    default: null
  },
  email_confirmation_code_exp_date: {
    type: Number,
    default: null
  },
  is_account_complete: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  name: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: null
  },
  number: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: null
  },
  profile_photo: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: 'https://kstu.edu.tr/kstu-file/uploads/default-user-image.png'
  },
  is_email_notifications_allowed: {
    type: Boolean,
    default: true
  },
  is_light_team_on: {
    type: Boolean,
    default: false
  },
  favorite_announcements: {
    type: Array,
    default: [],
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  }
});

UserSchema.pre('save', hashPassword);

UserSchema.statics.findUserById = function (id, callback) {
  const User = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  User.findById(mongoose.Types.ObjectId(id.toString()), (err, user) => {
    if (err) return callback('database_error');
    if (!user) return callback('document_not_found');

    return callback(null, user);
  });
};

UserSchema.statics.findUserByIdAndFormat = function (id, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    getUser(user, (err, user) => {
      if (err) return callback(err);

      return callback(null, user);
    });
  });
};

UserSchema.statics.createUser = function (data, callback) {
  const User = this;

  if (!data || !data.email || typeof data.email != 'string' || !data.password || typeof data.password != 'string')
    return callback('bad_request')

  data.password = data.password.trim();

  if (!validator.isEmail(data.email) || !data.email.includes(EMAIL_DOMAIN_VERIFICATION_STRING))
    return callback('email_validation');

  if (data.password.trim().length < MIN_PASSWORD_LENGTH)
    return callback('password_length');
  
  const newUserData = {
    email: data.email.trim(),
    password: data.password.trim()
  };

  const newUser = new User(newUserData);

  newUser.save((err, user) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, user._id.toString());
  }); 
};

UserSchema.statics.findUserByEmailAndVerifyPassword = function (data, callback) {
  const User = this;

  if (!data || !data.email || !validator.isEmail(data.email) || !data.password)
    return callback('bad_request');

  User.findOne({
    email: data.email.trim()
  }, (err, user) => {
    if (err) return callback('database_error');
    if (!user) return callback('document_not_found');

    verifyPassword(data.password.trim(), user.password, res => {
      if (!res) return callback('password_verification');

      getUser(user, (err, user) => {
        if (err) return callback(err);

        return callback(null, user);
      });
    });
  });
};

UserSchema.statics.findUserByIdAndSendConfirmationCode = function (id, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);
    if (user.is_email_confirmed) return callback(null);

    const confirmation_code = Math.round(Math.random() * 1e6) + 1e5;
    const exp_date = ((new Date).getTime()) + ONE_HOUR_IN_MS;

    User.findByIdAndUpdate(user._id, {$set: {
      email_confirmation_code: confirmation_code,
      email_confirmation_code_exp_date: exp_date
    }}, err => {
      if (err) return callback('database_error');

      sendEmail({
        template: 'confirmation_code',
        to: user.email,
        email: user.email,
        code: confirmation_code
      }, err => {
        if (err) return callback(err);

        return callback(null, exp_date);
      });
    });
  });
};

UserSchema.statics.findUserByIdAndConfirmEmail = function (id, data, callback) {
  const User = this;

  if (!data.code)
    return callback('bad_request');

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    if (user.is_email_confirmed)
      return callback('already_authenticated');

    if (user.email_confirmation_code != data.code)
      return callback('bad_request');

    if (user.email_confirmation_code_exp_date < (new Date).getTime())
      return callback('request_timeout');
    
    User.findByIdAndUpdate(user._id, {$set: {
      is_email_confirmed: true,
      email_confirmation_code: null,
      email_confirmation_code_exp_date: null
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

UserSchema.statics.findUserByIdAndUpdate = function (id, data, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    User.findByIdAndUpdate(user._id, {$set: {
      name: data.name && data.name.length ? data.name : user.name,
      number: data.number && !isNaN(parseInt(data.number)) && parseInt(data.number) > 0 ? parseInt(data.number).toString() : user.number
    }}, {new: true}, (err, user) => {
      if (err) return callback('database_error');

      if (user.is_account_complete || !user.name || !user.name.length || !user.number || !user.number.length)
        return callback(null);

      User.findByIdAndUpdate(user._id, {$set: {
        is_account_complete: true
      }}, err => {
        if (err) return callback('database_error');

        return callback(null);
      });
    });
  });
};

UserSchema.statics.findUserByIdAndUpdateProfilePhoto = function (id, data, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    Image.findImageByUrl(data.image, (err, image) => {
      if (err) return callback(err);

      User.findByIdAndUpdate(user._id, {$set: {
        profile_photo: image.url
      }}, err => {
        if (err) return callback('database_error');

        Image.findImageByUrlAndSetAsUsed(image.url, err => {
          if (err) return callback(err);

          return callback(null, image.url);
        });
      });
    });
  });
};

UserSchema.statics.findUserByIdAndUpdatePassword = function (id, data, callback) {
  const User = this;

  if (!data.old_password || !data.password || typeof data.password != 'string' || !data.password.trim().length)
    return callback('bad_request');

  data.password = data.password.trim();

  if (data.password.length < MIN_PASSWORD_LENGTH)
    return callback('password_length');

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    User.findUserByEmailAndVerifyPassword({
      email: user.email,
      password: data.old_password
    }, (err, user) => {
      if (err) return callback(err);

      User.findUserById(user._id, (err, user) => {
        if (err) return callback(err);

        user.password = data.password.trim();

        user.save(err => {
          if (err) return callback('database_error');

          return callback(null);
        });
      });
    });
  });
};

UserSchema.statics.findUserByIdAndGetFavoriteAnnouncements = function (id, data, callback) {
  User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    data.id_list = user.favorite_announcements;

    Announcement.findAnnouncementsByFiltersAndSorted(data, (err, data) => {
      if (err) return callback(err);

      return callback(null, data);
    });
  });
};

UserSchema.statics.findUserByIdAndPushAnnouncementToFavorites = function (id, data, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    Announcement.findAnnouncementById(data.announcement_id, (err, announcement) => {
      if (err) return callback(err);

      if (user.favorite_announcements.includes(announcement._id.toString()))
        return callback(null);

      if (user.favorite_announcements.length >= MAX_DATABASE_ARRAY_FIELD_LENGTH)
        return callback('too_many_documents');

      User.findByIdAndUpdate(user._id, {$push: {
        favorite_announcements: announcement._id.toString()
      }}, err => {
        if (err) return callback('database_error');

        return callback(null);
      });
    });
  });
};

UserSchema.statics.findUserByIdAndPullAnnouncementFromFavorites = function (id, data, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);

    Announcement.findAnnouncementById(data.announcement_id, (err, announcement) => {
      if (err) return callback(err);

      if (!user.favorite_announcements.includes(announcement._id.toString()))
        return callback(null);

      User.findByIdAndUpdate(user._id, {$pull: {
        favorite_announcements: announcement._id.toString()
      }}, err => {
        if (err) return callback('database_error');

        return callback(null);
      });
    });
  });
};

UserSchema.statics.findUsersByFiltersAndSorted = function (data, callback) {
  const User = this;

  const filters = {};
  const skip = data.skip && !isNaN(parseInt(data.skip)) && parseInt(data.skip) >= 0 ? parseInt(data.skip) : 0;
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) >= 0 && parseInt(data.limit) < 100 ? parseInt(data.limit) : 100;

  if (data.email && typeof data.email == 'string' && data.email.trim().length && data.email.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.email = { $regex: data.email.trim()};

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = { $regex: data.name.trim() };

  User
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .then(users => callback(null, {
      skip,
      limit,
      users
    }))
    .catch(err => callback('database_error'));
};

module.exports = mongoose.model('User', UserSchema);
