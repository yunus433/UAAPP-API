const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 10000;

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    unique: true,
    order: true
  },
  image: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH
  }
});

TeamSchema.statics.findTeamById = function (id, callback) {
  const Team = this;

  if (!id || !validator.isMongoId(id.toString()))
    return callback('bad_request');

  Team.findById(mongoose.Types.ObjectId(id.toString()), (err, team) => {
    if (err) return callback('database_error');
    if (!team) return callback('document_not_found');

    return callback(null, team);
  });
};

TeamSchema.statics.createTeam = function (data, callback) {
  const Team = this;

  if (!data)
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.trim().length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  Image.findImageByUrl(data.image, (err, image) => {
    if (err) return callback(err);

    const newTeamData = {
      name: data.name.trim(),
      image: image.url
    };

    const newTeam = new Team(newTeamData);

    newTeam.save((err, team) => {
      if (err) return callback('database_error');

      Image.findImageByUrlAndSetAsUsed(image.url, err => {
        if (err) return callback(err);

        return callback(null, team._id.toString());
      });
    });
  });
};

TeamSchema.statics.findTeamsByFiltersAndSorted = function (data, callback) {
  const Team = this;

  const filters = {};
  const skip = data.skip && !isNaN(parseInt(data.skip)) && parseInt(data.skip) >= 0 ? parseInt(data.skip) : 0;
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) >= 0 && parseInt(data.limit) < 100 ? parseInt(data.limit) : 100;

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = data.name.trim();

  Team
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ name: 1 })
    .then(teams => callback(null, {
      skip,
      limit,
      teams
    }))
    .catch(err => callback('database_error'));
};

TeamSchema.statics.findTeamByIdAndUpdate = function (id, data, callback) {
  const Team = this;

  Team.findTeamById(id, (err, team) => {
    if (err) return callback(err);

    Team.findByIdAndUpdate(team._id, {$set: {
      name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : team.name
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

module.exports = mongoose.model('Team', TeamSchema);
