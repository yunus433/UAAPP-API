const express = require('express');
const router = express.Router();

const isAccountComplete = require('../middleware/isAccountComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const filterPostController = require('../controllers/favorites/filter/post');
const pullPostController = require('../controllers/favorites/pull/post');
const pushPostController = require('../controllers/favorites/push/post');

router.post(
  '/filter',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    filterPostController
);
router.post(
  '/pull',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    pullPostController
);
router.post(
  '/push',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    pushPostController
);

module.exports = router;
