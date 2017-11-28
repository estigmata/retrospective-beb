'use strict';

const mongoose = require('mongoose');

function createDatabaseConnection (HOST, PORT, DATABASE_NAME) {
  mongoose.connect(`mongodb://${HOST}:${PORT}/${DATABASE_NAME}`, { useMongoClient: true });
  mongoose.Promise = Promise;
}
module.exports = createDatabaseConnection;
