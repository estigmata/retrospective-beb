'use strict';

const mongoose = require('mongoose');
const itemSchema = require('./item.schema');
const itemModel = mongoose.model('item', itemSchema);

module.exports = itemModel;
