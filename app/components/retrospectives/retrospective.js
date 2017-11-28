'use strict';

const mongoose = require('mongoose');
const RetrospectiveSchema = require('./retrospective.schema');

module.exports = mongoose.model('retrospective', RetrospectiveSchema);
