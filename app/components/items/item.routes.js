'use strict';

const express = require('express');
const { validateId } = require('./../../middlewares/id-validator.middleware');
const { validateSchema } = require('./../../middlewares/schema-validator.middleware');
const ItemController = require('./item.controller');
const ItemSchema = require('./../items/item.schema-validator');
const RetrospectiveMiddleware = require('./../../middlewares/authorization.middleware');

const router = express.Router({ mergeParams: true });
router.post('/', RetrospectiveMiddleware.validateTokenRetrospective, RetrospectiveMiddleware.validateRole, validateSchema(ItemSchema), ItemController.saveItem);
router.put('/:itemId', RetrospectiveMiddleware.validateTokenRetrospective, RetrospectiveMiddleware.validateRole, ItemController.updateItemById);
router.put('/:itemId/votes', validateId('itemId'), RetrospectiveMiddleware.validateTokenRetrospective, ItemController.updateVotes);
router.delete('/:itemId', validateId('itemId'), RetrospectiveMiddleware.validateTokenRetrospective, ItemController.deleteItem);
router.post('/:itemId', validateId('itemId'), RetrospectiveMiddleware.validateTokenRetrospective, RetrospectiveMiddleware.validateRole, ItemController.addChild);
router.put('/:itemId/ungroup', validateId('itemId'), RetrospectiveMiddleware.validateTokenRetrospective, RetrospectiveMiddleware.validateRole, ItemController.removeItemByGroup);
module.exports = router;
