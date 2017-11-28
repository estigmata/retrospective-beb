'use strict';
const express = require('express');
const { validateId } = require('./../../middlewares/id-validator.middleware');
const UserController = require('./user.controller');

const router = express.Router();
router.get('/:userId', validateId('userId'), UserController.getUser);
router.get(
  '/:userId/retrospectives/:retrospectiveId/players',
  validateId('userId'),
  validateId('retrospectiveId'),
  UserController.getPlayerFromRetrospective
);

module.exports = router;
