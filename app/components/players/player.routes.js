'use strict';

const express = require('express');
const PlayerController = require('./player.controller');
const { validateId } = require('./../../middlewares/id-validator.middleware');

const router = express.Router({ mergeParams: true });
router.get('/:playerId', validateId('playerId'), PlayerController.getPlayer);

module.exports = router;
