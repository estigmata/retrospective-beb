'use strict';

const mongoose = require('mongoose');
const UserSchema = require('./user.schema');

module.exports = mongoose.model('user', UserSchema);
