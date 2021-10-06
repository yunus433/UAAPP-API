const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 1000;

const Schema = mongoose.Schema;

const UniformSchema = new Schema({
  type: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: null
  },
  name: {
    type: String,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    default: null
  },
  image_url: {
    type: String,
    default: null
  }
});

UniformSchema.statics.findUniformById = function (id, callback) {
  const Uniform = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Uniform.findById(mongoose.Types.ObjectId(id.toString()), (err, uniform) => {
    if (err) return callback('database_error');
    if (!uniform) return callback('document_not_found');

    return callback(null, uniform);
  });
};

UniformSchema.statics.findUniformByIdAndFormat = function (id, callback) {
  const Uniform = this;

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);

    getUniform(uniform, (err, uniform) => {
      if (err) return callback(err);

      return callback(null, uniform);
    });
  });
};

UniformSchema.statics.createUniform = function (data, callback) {
  const Uniform = this;

  if (!data || !data.email || !data.password)
    return callback('bad_request')

  data.password = data.password.trim();

  if (!validator.isEmail(data.email))
    return callback('email_validation');

  if (data.password.length < MIN_PASSWORD_LENGTH)
    return callback('password_length');
  
  const newUniformData = {
    email: data.email.trim(),
    password: data.password.trim()
  };

  const newUniform = new Uniform(newUniformData);

  newUniform.save((err, uniform) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, uniform._id.toString());
  }); 
};

UniformSchema.statics.findUniform = function (data, callback) {
  const Uniform = this;

  if (!data || !data.email || !validator.isEmail(data.email) || !data.password)
    return callback('bad_request');

  Uniform.findOne({
    email: data.email.trim()
  }, (err, uniform) => {
    if (err) return callback('database_error');
    if (!uniform) return callback('document_not_found');

    verifyPassword(data.password.trim(), uniform.password, res => {
      if (!res) return callback('password_verification');

      getUniform(uniform, (err, uniform) => {
        if (err) return callback(err);

        return callback(null, uniform);
      });
    });
  });
};

UniformSchema.statics.createAndSendConfirmationCode = function (id, callback) {
  const Uniform = this;

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);
    if (uniform.is_email_confirmed) return callback('document_validation');

    const code = Math.round(Math.random() * 1e6) + 1e5;
    const exp_date = ((new Date).getTime()) + FIVE_MIN_IN_MS;

    Uniform.findByIdAndUpdate(uniform._id, {$set: {
      email_confirmation_code: code,
      email_confirmation_code_exp_date: exp_date
    }}, err => {
      if (err) return callback('database_error');

      sendEmail({
        template: 'email_confirmation',
        to: uniform.email,
        code
      }, err => {
        if (err) return callback(err);

        return callback(null, exp_date);
      });
    });
  });
};

UniformSchema.statics.findUniformByIdAndConfirmEmail = function (id, data, callback) {
  const Uniform = this;

  if (!data.code)
    return callback('bad_request');

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);

    if (uniform.is_email_confirmed)
      return callback('already_authenticated');

    if (uniform.email_confirmation_code != data.code)
      return callback('bad_request');

    if (uniform.email_confirmation_code_exp_date < (new Date).getTime())
      return callback('request_timeout');
    
    Uniform.findByIdAndUpdate(uniform._id, {$set: {
      is_email_confirmed: true,
      email_confirmation_code: null,
      email_confirmation_code_exp_date: null
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

UniformSchema.statics.findUniformByIdAndUpdate = function (id, data, callback) {
  const Uniform = this;

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);

    Uniform.findByIdAndUpdate(uniform._id, {$set: {
      name: data.name && data.name.length ? data.name : uniform.name
    }}, {new: true}, (err, uniform) => {
      if (err) return callback('database_error');

      if (uniform.is_account_complete || !uniform.name || !uniform.name.length)
        return callback(null);

      Uniform.findByIdAndUpdate(uniform._id, {$set: {
        is_account_complete: true
      }}, err => {
        if (err) return callback('database_error');

        return callback(null);
      });
    });
  });
};

UniformSchema.statics.findUniformByIdAndUpdateProfilePhoto = function (id, data, callback) {
  
};

module.exports = mongoose.model('Uniform', UniformSchema);
