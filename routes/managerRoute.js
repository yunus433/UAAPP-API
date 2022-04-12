const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './public/res/uploads/' });

const isManager = require('../middleware/isManager');
const isRouteAllowedForManager = require('../middleware/isRouteAllowedForManager');
const uploadImage = require('../middleware/uploadImage');

const announcementsIndexGetController = require('../controllers/manager/announcements/index/get');
const announcementsCreateGetController = require('../controllers/manager/announcements/create/get');
const announcementsDeleteGetController = require('../controllers/manager/announcements/delete/get');
const announcementsEditGetController = require('../controllers/manager/announcements/edit/get');

const indexGetController = require('../controllers/manager/index/get');

const lateBusGetController = require('../controllers/manager/late_bus/get');

const loginGetController = require('../controllers/manager/login/get');

const matchesIndexGetController = require('../controllers/manager/matches/index/get');
const matchesCreateGetController = require('../controllers/manager/matches/create/get');
const matchesDeleteGetController = require('../controllers/manager/matches/delete/get');
const matchesEditGetController = require('../controllers/manager/matches/edit/get');

const teamsIndexGetController = require('../controllers/manager/teams/index/get');
const teamsCreateGetController = require('../controllers/manager/teams/create/get');
const teamsEditGetController = require('../controllers/manager/teams/edit/get');

const uniformsIndexGetController = require('../controllers/manager/uniforms/index/get');
const uniformsCreateGetController = require('../controllers/manager/uniforms/create/get');
const uniformsDeleteGetController = require('../controllers/manager/uniforms/delete/get');
const uniformsEditGetController = require('../controllers/manager/uniforms/edit/get');

const announcementsCreatePostController = require('../controllers/manager/announcements/create/post');
const announcementsEditPostController = require('../controllers/manager/announcements/edit/post');

const loginPostController = require('../controllers/manager/login/post');

const matchesCreatePostController = require('../controllers/manager/matches/create/post');
const matchesEditPostController = require('../controllers/manager/matches/edit/post');

const teamsCreatePostController = require('../controllers/manager/teams/create/post');
const teamsEditPostController = require('../controllers/manager/teams/edit/post');

const uniformsCreatePostController = require('../controllers/manager/uniforms/create/post');
const uniformsEditPostController = require('../controllers/manager/uniforms/edit/post');

router.get(
  '/',
    isManager,
    indexGetController
);
router.get(
  '/announcements',
    isManager,
    isRouteAllowedForManager,
    announcementsIndexGetController
);
router.get(
  '/announcements/create',
    isManager,
    isRouteAllowedForManager,
    announcementsCreateGetController
);
router.get(
  '/announcements/delete',
    isManager,
    isRouteAllowedForManager,
    announcementsDeleteGetController
);
router.get(
  '/announcements/edit',
    isManager,
    isRouteAllowedForManager,
    announcementsEditGetController
);
router.get(
  '/login',
    loginGetController
);
router.get(
  '/late_bus',
    isManager,
    isRouteAllowedForManager,
    lateBusGetController
);
router.get(
  '/matches',
    isManager,
    isRouteAllowedForManager,
    matchesIndexGetController
);
router.get(
  '/matches/create',
    isManager,
    isRouteAllowedForManager,
    matchesCreateGetController
);
router.get(
  '/matches/delete',
    isManager,
    isRouteAllowedForManager,
    matchesDeleteGetController
);
router.get(
  '/matches/edit',
    isManager,
    isRouteAllowedForManager,
    matchesEditGetController
);
router.get(
  '/teams',
    isManager,
    isRouteAllowedForManager,
    teamsIndexGetController
);
router.get(
  '/teams/create',
    isManager,
    isRouteAllowedForManager,
    teamsCreateGetController
);
router.get(
  '/teams/edit',
    isManager,
    isRouteAllowedForManager,
    teamsEditGetController
);
router.get(
  '/uniforms',
    isManager,
    isRouteAllowedForManager,
    uniformsIndexGetController
);
router.get(
  '/uniforms/create',
    isManager,
    isRouteAllowedForManager,
    uniformsCreateGetController
);
router.get(
  '/uniforms/delete',
    isManager,
    isRouteAllowedForManager,
    uniformsDeleteGetController
);
router.get(
  '/uniforms/edit',
    isManager,
    isRouteAllowedForManager,
    uniformsEditGetController
);

router.post(
  '/announcements/create',
    upload.single('file'),
    isManager,
    isRouteAllowedForManager,
    uploadImage,
    announcementsCreatePostController
);
router.post(
  '/announcements/edit',
    isManager,
    isRouteAllowedForManager,
    announcementsEditPostController
);
router.post(
  '/login',
    loginPostController
);
router.post(
  '/matches/create',
    isManager,
    isRouteAllowedForManager,
    matchesCreatePostController
);
router.post(
  '/matches/edit',
    isManager,
    isRouteAllowedForManager,
    matchesEditPostController
);
router.post(
  '/teams/create',
    upload.single('file'),
    isManager,
    isRouteAllowedForManager,
    uploadImage,
    teamsCreatePostController
);
router.post(
  '/teams/edit',
    isManager,
    isRouteAllowedForManager,
    teamsEditPostController
);
router.post(
  '/uniforms/create',
    upload.single('file'),
    isManager,
    isRouteAllowedForManager,
    uploadImage,
    uniformsCreatePostController
);
router.post(
  '/uniforms/edit',
    isManager,
    isRouteAllowedForManager,
    uniformsEditPostController
);

module.exports = router;
