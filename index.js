'use strict';

const createDatabaseConnection = require('./app/db/databaseConnection');
const environment = process.env.NODE_ENV || 'dev';

let nconf = '';

if (environment === 'dev') {
  nconf = require('./app/environments/environments.dev');
} else {
  nconf = require('./app/environments/environments.prod');
}
const SERVER = nconf.get('SERVER');
const DATABASE = nconf.get('DATABASE');

createDatabaseConnection(DATABASE.HOST, DATABASE.PORT, DATABASE.NAME);

const app = require('./app/server/server-express');

const serverSocket = require('./app/server-socket/server.socket')(app);

serverSocket.listen(SERVER.PORT, () => console.log(`Server is running on: http://${SERVER.HOST}:${SERVER.PORT}`));
