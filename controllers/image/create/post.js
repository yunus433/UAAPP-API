const Image = require('../../../models/image/Image');

module.exports = (req, res) => {
  Image.createImage(req.body, (err, id) => {
    if (err) {
      res.write(JSON.stringify({ error: err, success: false }));
      return res.end();
    }

    res.write(JSON.stringify({ id, success: true }));
    return res.end();
  })
}
