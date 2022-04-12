const async = require('async');
const mongoose = require('mongoose');
const validator = require('validator');

const Team = require('../team/Team');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 10000;

const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  home: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  away: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  date: {
    type: String,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  result: {
    type: String,
    default: null,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
  }
});

MatchSchema.statics.findMatchById = function (id, callback) {
  const Match = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Match.findById(mongoose.Types.ObjectId(id.toString()), (err, match) => {
    if (err) return callback('database_error');
    if (!match) return callback('document_not_found');

    return callback(null, match);
  });
};

MatchSchema.statics.createMatch = function (data, callback) {
  const Match = this;

  if (!data)
    return callback('bad_request');

  if (!data.date || typeof data.date != 'string' || !data.date.trim().length || data.date.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.result || typeof data.result != 'string' || !data.result.trim().length || data.result.trim().length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    data.result = null;

  Team.findTeamById(data.home, (err, home) => {
    if (err) return callback(err);

    Team.findTeamById(data.away, (err, away) => {
      if (err) return callback(err);

      const newMatchData = {
        home: home._id,
        away: away._id,
        data: data.date.trim(),
        result: data.result ? data.result.trim() : null
      };

      const newMatch = new Match(newMatchData);

      newMatch.save((err, match) => {
        if (err) return callback('database_error');

        return callback(null, match._id.toString());
      });
    });
  });
};

MatchSchema.statics.findMatchsByFiltersAndSorted = function (data, callback) {
  const Match = this;

  const filters = {};
  const skip = data.skip && !isNaN(parseInt(data.skip)) && parseInt(data.skip) >= 0 ? parseInt(data.skip) : 0;
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) >= 0 && parseInt(data.limit) < 100 ? parseInt(data.limit) : 100;

  Match
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .then(matches => callback(null, {
      skip,
      limit,
      matches
    }))
    .catch(err => callback('database_error'));
};

MatchSchema.statics.findMatchByIdAndUpdate = function (id, data, callback) {
  const Match = this;

  Match.findMatchById(id, (err, match) => {
    if (err) return callback(err);

    Match.findByIdAndUpdate(match._id, {$set: {
      date: data.date && typeof data.date == 'string' && data.date.trim().length && data.date.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.date.trim() : match.date,
      result: data.result && typeof data.result == 'string' && data.result.trim().length && data.result.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.result.trim() : match.result,
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

module.exports = mongoose.model('Match', MatchSchema);
