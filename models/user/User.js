const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const sendEmail = require('../../utils/sendEmail');

const hashPassword = require('./functions/hashPassword');
const getUser = require('./functions/getUser');
const verifyPassword = require('./functions/verifyPassword');

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 6;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1000;
const FIVE_MIN_IN_MS = 5 * 60 * 1000;

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
  profile_photo: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: null
  },
  is_email_notifications_allowed: {
    type: Boolean,
    default: true
  },
  is_light_team_on: {
    type: Boolean,
    default: false
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

  if (!data || !data.email || !data.password)
    return callback('bad_request')

  data.password = data.password.trim();

  if (!validator.isEmail(data.email))
    return callback('email_validation');

  if (data.password.length < MIN_PASSWORD_LENGTH)
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

UserSchema.statics.findUser = function (data, callback) {
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

UserSchema.statics.createAndSendConfirmationCode = function (id, callback) {
  const User = this;

  User.findUserById(id, (err, user) => {
    if (err) return callback(err);
    if (user.is_email_confirmed) return callback('document_validation');

    const code = Math.round(Math.random() * 1e6) + 1e5;
    const exp_date = ((new Date).getTime()) + FIVE_MIN_IN_MS;

    User.findByIdAndUpdate(user._id, {$set: {
      email_confirmation_code: code,
      email_confirmation_code_exp_date: exp_date
    }}, err => {
      if (err) return callback('database_error');

      sendEmail({
        template: 'email_confirmation',
        to: user.email,
        code
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
      name: data.name && data.name.length ? data.name : user.name
    }}, {new: true}, (err, user) => {
      if (err) return callback('database_error');

      if (user.is_account_complete || !user.name || !user.name.length)
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
  
};

module.exports = mongoose.model('User', UserSchema);
