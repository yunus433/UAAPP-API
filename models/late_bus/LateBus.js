const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const User = require('../user/User');

const getLateBus = require('./functions/getLateBus');

const destination_values = ['Zorlu, Akmerkez', 'Zorlu, Levent', 'Bahçeşehir', 'Kadıköy', 'Göktürk'];

const MAX_DATABASE_TEXT_FIELD_LENGTH = 10000;
const ONE_DAY_IN_MS = 60 * 60 * 1000;

const Schema = mongoose.Schema;

const LateBusSchema = new Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  created_at: {
    type: Number,
    required: true
  },
  destination: {
    type: String,
    required: true
  }
});

LateBusSchema.statics.findLateBusById = function (id, callback) {
  const LateBus = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  LateBus.findById(mongoose.Types.ObjectId(id.toString()), (err, late_bus) => {
    if (err) return callback('database_error');
    if (!late_bus) return callback('document_not_found');

    return callback(null, late_bus);
  });
};

LateBusSchema.statics.findLateBusByIdAndFormat = function (id, callback) {
  const LateBus = this;

  LateBus.findLateBusById(id, (err, late_bus) => {
    if (err) return callback(err);

    getLateBus(late_bus, (err, late_bus) => {
      if (err) return callback(err);

      return callback(null, late_bus);
    });
  });
};

LateBusSchema.statics.createLateBus = function (data, callback) {
  const LateBus = this;

  if (!data)
    return callback('bad_request');

  if (!data.destination || !destination_values.includes(data.destination))
    return callback('bad_request');

  User.findUserById(data.user_id, (err, user) => {
    if (err) return callback(err);

    const newLateBusData = {
      user_id: user._id,
      created_at: (new Date).getTime(),
      destination: data.destination
    };

    newLateBus = new LateBus(newLateBusData);

    newLateBus.save((err, late_bus) => {
      if (err) return callback('database_error');

      return callback(null, late_bus._id.toString());
    });
  });
};

LateBusSchema.statics.findLateBusByUserIdForToday = function (user_id, callback) {
  const LateBus = this;
  const today_in_ms = (new Date).getTime() - (((new Date).getHours() * 60 + (new Date).getMinutes()) * 60 * 1000);

  User.findUserById(user_id, (err, user) => {
    if (err) return callback(err);

    LateBus.findOne({
      user_id: user._id,
      created_at: { $gte: today_in_ms }
    }, (err, late_bus) => {
      if (err) return callback('database_error');

      return callback(null, late_bus);
    });
  });
};

LateBusSchema.statics.deleteAllLateBusesByUserIdAndDelete = function (user_id, callback) {
  const LateBus = this;

  User.findUserById(user_id, (err, user) => {
    if (err) return callback(err);

    LateBus.find({
      user_id: user._id
    }, (err, buses) => {
      if (err) return callback('database_error');

      async.timesSeries(
        buses.length,
        (time, next) => {
          LateBus.findByIdAndDelete(mongoose.Types.ObjectId(buses[time]._id.toString()), err => {
            if (err) return next('database_error');

            return next(null);
          });
        },
        err => {
          if (err) return callback(err);

          return callback(null);
        }
      );
    });
  });
};

LateBusSchema.statics.findAllLateBusesForToday = function (data, callback) {
  const LateBus = this;
  const today_in_ms = (new Date).getTime() - (((new Date).getHours() * 60 + (new Date).getMinutes()) * 60 * 1000);

  LateBus.find({
    created_at: { $gte: today_in_ms }
  }, (err, buses) => {
    if (err) return callback('database_error');

    async.timesSeries(
      buses.length,
      (time, next) => LateBus.findLateBusByIdAndFormat(buses[time]._id, (err, late_bus) => next(err, late_bus)),
      (err, buses) => {
        if (err) return callback(err);

        return callback(null, buses);
      }
    );
  });
};

module.exports = mongoose.model('LateBus', LateBusSchema);
