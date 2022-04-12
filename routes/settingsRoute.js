const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/res/uploads/' });

const isLoggedIn = require('../middleware/isLoggedIn');
const isConfirmed = require('../middleware/isConfirmed');
const uploadImage = require('../middleware/uploadImage');

const imagePostController = require('../controllers/settings/image/post');
const passwordPostController = require('../controllers/settings/password/post');
const updatePostController = require('../controllers/settings/update/post');

router.post(
  '/image',
    upload.single('file'),
    isLoggedIn,
    isConfirmed,
    uploadImage,
    imagePostController
);
router.post(
  '/password',
    isLoggedIn,
    isConfirmed,
    passwordPostController
);
router.post(
  '/update',
    isLoggedIn,
    isConfirmed,
    updatePostController
);

module.exports = router;
