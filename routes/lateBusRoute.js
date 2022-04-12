const express = require('express');
const router = express.Router();

const isAccountComplete = require('../middleware/isAccountComplete');
const isConfirmed = require('../middleware/isConfirmed');
const isLoggedIn = require('../middleware/isLoggedIn');

const deleteGetController = require('../controllers/late_bus/delete/get');
const findGetController = require('../controllers/late_bus/find/get');

const createPostController = require('../controllers/late_bus/create/post');

router.get(
  '/delete',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    deleteGetController
);
router.get(
  '/find',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    findGetController
);

router.post(
  '/create',
    isLoggedIn,
    isConfirmed,
    isAccountComplete,
    createPostController
);

module.exports = router;
