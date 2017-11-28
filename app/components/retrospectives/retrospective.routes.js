'use strict';
const express = require('express');
const { validateId } = require('./../../middlewares/id-validator.middleware');
const RetrospectiveController = require('./retrospective.controller');
const { validateSchema } = require('./../../middlewares/schema-validator.middleware');
const RetrospectiveMiddleware = require('./../../middlewares/authorization.middleware');
const RetrospectiveSchema = require('./retrospective.schema-validator');

const router = express.Router();

router.post('/', RetrospectiveMiddleware.validateAuthorization, validateSchema(RetrospectiveSchema), RetrospectiveController.createNewRetrospective);
router.get('/:retrospectiveId', validateId('retrospectiveId'), RetrospectiveController.getRetrospective);
router.get('/:retrospectiveId/players', validateId('retrospectiveId'), RetrospectiveController.getPlayers);
router.post(
  '/:retrospectiveId/players',
  validateId('retrospectiveId'),
  RetrospectiveMiddleware.getUserAuthorization,
  RetrospectiveController.createAnonymousPlayer,
  RetrospectiveMiddleware.createPlayerToken);
router.get('/:retrospectiveId/items', validateId('retrospectiveId'), RetrospectiveController.getItems);
router.post('/:retrospectiveId/groups', validateId('retrospectiveId'), RetrospectiveController.createGroup);
router.get('', RetrospectiveController.getRetrospectives);
router.put('/:retrospectiveId', RetrospectiveMiddleware.validateAuthorization, validateId('retrospectiveId'), RetrospectiveController.updateRetrospectiveById);

module.exports = router;
