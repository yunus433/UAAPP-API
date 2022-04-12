const mongoose = require('mongoose');
const validator = require('validator');

const Image = require('../image/Image');

const MAX_DATABASE_TEXT_FIELD_LENGTH = 10000;
const MAX_DATABASE_NUMBER_FIELD_VALUE = 10000;

const Schema = mongoose.Schema;

const UniformSchema = new Schema({
  name: {
    type: String,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
  },
  price: {
    type: Number,
    min: 1,
    max: MAX_DATABASE_NUMBER_FIELD_VALUE,
    required: true
  },
  image: {
    type: String,
    minlength: 1,
    maxlength: MAX_DATABASE_TEXT_FIELD_LENGTH,
    required: true
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

  if (!data)
    return callback('bad_request');

  if (!data.name || typeof data.name != 'string' || !data.name.trim().length || data.name.length > MAX_DATABASE_TEXT_FIELD_LENGTH)
    return callback('bad_request');

  if (!data.price || isNaN(parseInt(data.price)) || parseInt(data.price) < 0 || parseInt(data.price) > MAX_DATABASE_NUMBER_FIELD_VALUE)
    return callback('bad_request');

  Image.findImageByUrl(data.image, (err, image) => {
    if (err) return callback(err);

    const newUniformData = {
      name: data.name.trim(),
      price: parseInt(data.price).toString(),
      image: image.url
    };

    const newUniform = new Uniform(newUniformData);

    newUniform.save((err, uniform) => {
      if (err) return callback('database_error');

      Image.findImageByUrlAndSetAsUsed(image.url, err => {
        if (err) return callback(err);

        return callback(null, uniform._id.toString());
      });
    });
  });
};

UniformSchema.statics.findUniformsByFiltersAndSorted = function (data, callback) {
  const Uniform = this;

  const filters = {};
  const skip = data.skip && !isNaN(parseInt(data.skip)) && parseInt(data.skip) >= 0 ? parseInt(data.skip) : 0;
  const limit = data.limit && !isNaN(parseInt(data.limit)) && parseInt(data.limit) >= 0 && parseInt(data.limit) < 100 ? parseInt(data.limit) : 100;

  if (data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH)
    filters.name = data.name.trim();

  Uniform
    .find(filters)
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 })
    .then(uniforms => callback(null, {
      skip,
      limit,
      uniforms
    }))
    .catch(err => callback('database_error'));
};

UniformSchema.statics.findUniformByIdAndUpdate = function (id, data, callback) {
  const Uniform = this;

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);

    Uniform.findByIdAndUpdate(uniform._id, {$set: {
      name: data.name && typeof data.name == 'string' && data.name.trim().length && data.name.length < MAX_DATABASE_TEXT_FIELD_LENGTH ? data.name.trim() : uniform.name,
      price: data.price && !isNaN(parseInt(data.price)) && parseInt(data.price) > 0 && parseInt(data.price) < MAX_DATABASE_NUMBER_FIELD_VALUE ? parseInt(data.price).toString() : uniform.price
    }}, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

UniformSchema.statics.findUniformByIdAndDelete = function (id, callback) {
  const Uniform = this;

  Uniform.findUniformById(id, (err, uniform) => {
    if (err) return callback(err);

    Uniform.findByIdAndDelete(uniform._id, err => {
      if (err) return callback('database_error');

      return callback(null);
    });
  });
};

module.exports = mongoose.model('Uniform', UniformSchema);
