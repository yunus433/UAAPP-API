const express = require('express');
const router = express.Router();

const isLoggedIn = require('../middleware/isLoggedIn');

const confirmGetController = require('../controllers/auth/confirm/get');
const logoutGetController = require('../controllers/auth/logout/get');

const confirmPostController = require('../controllers/auth/confirm/post');
const loginPostController = require('../controllers/auth/login/post');
const registerPostController = require('../controllers/auth/register/post');

router.get(
  '/confirm',
    isLoggedIn,
    confirmGetController
);
router.get(
  '/logout',
    isLoggedIn,
    logoutGetController
);

router.post(
  '/confirm',
    isLoggedIn,
    confirmPostController
);
router.post(
  '/login',
    loginPostController
);
router.post(
  '/register',
    registerPostController
);

module.exports = router;
