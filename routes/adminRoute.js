const express = require('express');

const router = express.Router();

const isAdmin = require('../middleware/isAdmin');

const indexGetController = require('../controllers/admin/index/get');
const loginGetController = require('../controllers/admin/login/get');
const managersIndexGetController = require('../controllers/admin/managers/index/get');
const managersCreateGetController = require('../controllers/admin/managers/create/get');
const managersDeleteGetController = require('../controllers/admin/managers/delete/get');

const loginPostController = require('../controllers/admin/login/post');
const managersCreatePostController = require('../controllers/admin/managers/create/post');

router.get(
  '/',
    isAdmin,
    indexGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/managers',
    isAdmin,
    managersIndexGetController
);
router.get(
  '/managers/create',
    isAdmin,
    managersCreateGetController
);
router.get(
  '/managers/delete',
    isAdmin,
    managersDeleteGetController
);

router.post(
  '/login',
    loginPostController
);
router.post(
  '/managers/create',
    isAdmin,
    managersCreatePostController
);

module.exports = router;
