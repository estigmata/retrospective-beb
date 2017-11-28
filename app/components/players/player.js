'use strict';

const mongoose = require('mongoose');
const playerSchema = require('./player.schema');
const playerModel = mongoose.model('player', playerSchema);

module.exports = playerModel;
