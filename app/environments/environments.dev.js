'use strict';

const nconf = require('nconf');

nconf.env();
nconf.file({ file: `${__dirname}/config.json` });

nconf.set('SERVER:HOST', 'localhost');
nconf.set('SERVER:PORT', '13002');
nconf.set('DATABASE:HOST', 'localhost');
nconf.set('DATABASE:NAME', 'retrospective-db');
nconf.set('DATABASE:PORT', '27017');
module.exports = nconf;
