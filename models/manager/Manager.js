const mongoose = require('mongoose');
const validator = require('validator');

const hashPassword = require('./functions/hashPassword');
const verifyPassword = require('./functions/verifyPassword');

const allowed_route_values = ['announcements', 'late_bus', 'matches', 'teams', 'uniforms'];

const DUPLICATED_UNIQUE_FIELD_ERROR_CODE = 11000;
const MIN_PASSWORD_LENGTH = 6;
const MAX_DATABASE_ARRAY_FIELD_LENGTH = 1e3;
const MAX_DATABASE_TEXT_FIELD_LENGTH = 1e4;

const Schema = mongoose.Schema;

const ManagerSchema = new Schema({
  email: {
    type: String,
    unique: true,
    index: true,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  password: {
    type: String,
    required: true,
    minlength: MIN_PASSWORD_LENGTH,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  name: {
    type: String,
    required: true,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  },
  allowed_routes: {
    type: Array,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_ARRAY_FIELD_LENGTH
  }
});

ManagerSchema.pre('save', hashPassword);

ManagerSchema.statics.findManagerById = function (id, callback) {
  const Manager = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Manager.findById(mongoose.Types.ObjectId(id.toString()), (err, manager) => {
    if (err) return callback('database_error');
    if (!manager) return callback('document_not_found');

    return callback(null, manager);
  });
};

ManagerSchema.statics.createManager = function (data, callback) {
  const Manager = this;

  if (!data)
    return callback('bad_request')

  data.password = data.password.trim();

  if (!data.email || typeof data.email != 'string' || !validator.isEmail(data.email))
    return callback('email_validation');

  if (!data.password || typeof data.password != 'string' || data.password.trim().length < MIN_PASSWORD_LENGTH)
    return callback('password_length');

  if (!data.name || typeof data.name != 'string' || !data.name.trim().length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.allowed_routes || typeof data.allowed_routes != 'string')
    return callback('bad_request');

  data.allowed_routes = data.allowed_routes.split(',').map(each => each.trim()).filter(each => each.length);

  if (data.allowed_routes.find(each => !allowed_route_values.includes(each)) || !data.allowed_routes.length || data.allowed_routes.length > MAX_DATABASE_ARRAY_FIELD_LENGTH)
    return callback('bad_request');
  
  const newManagerData = {
    email: data.email.trim(),
    password: data.password.trim(),
    name: data.name.trim(),
    allowed_routes: data.allowed_routes
  };

  const newManager = new Manager(newManagerData);

  newManager.save((err, manager) => {
    if (err && err.code == DUPLICATED_UNIQUE_FIELD_ERROR_CODE)
      return callback('duplicated_unique_field');
    if (err)
      return callback('database_error');

    return callback(null, manager._id.toString());
  }); 
};

ManagerSchema.statics.findManagerByEmailAndVerifyPassword = function (data, callback) {
  const Manager = this;

  if (!data || !data.email || !validator.isEmail(data.email) || !data.password)
    return callback('bad_request');

  Manager.findOne({
    email: data.email.trim()
  }, (err, manager) => {
    if (err) return callback('database_error');
    if (!manager) return callback('document_not_found');

    verifyPassword(data.password.trim(), manager.password, res => {
      if (!res) return callback('password_verification');

      return callback(null, manager);
    });
  });
};

ManagerSchema.statics.findManagerByIdAndDelete = function (id, callback) {
  const Manager = this;

  Manager.findManagerById(id, (err, manager) => {
    if (err) return callback(err);

    Manager.findByIdAndDelete(manager._id, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

ManagerSchema.statics.findAllManagersSorted = function (callback) {
  const Manager = this;
  
  Manager
    .find()
    .sort({ _id: -1 })
    .then(managers => callback(null, managers))
    .catch(err => callback('database_error'));
};

module.exports = mongoose.model('Manager', ManagerSchema);
