const Image = require('../models/image/Image');

module.exports = (req, res, next) => {
  if (!req.file || !req.file.filename)
    return res.redirect('/admin');

  Image.createImage({
    file_name: req.file.filename
  }, (err, url) => {
    if (err) return res.redirect('/admin');

    req.body.image = url;
    return next();
  });
}
