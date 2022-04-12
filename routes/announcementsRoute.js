const express = require('express');
const router = express.Router();

const isAccountComplete = require('../middleware/isAccountComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const filterPostController = require('../controllers/announcements/filter/post');

router.post(
  '/filter',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    filterPostController
);

module.exports = router;
