const Jimp = require('jimp');

const DEFAULT_MAX_IMAGE_SIZE_IN_KB = 200;
const MAX_IMAGE_SIZE_IN_KB = 2000;

module.exports = (file_name, callback) => {
  Jimp
    .read('./public/res/uploads/' + file_name)
    .then(image => {
      
    })
    .catch(err => callback('unknown_error'));
};
