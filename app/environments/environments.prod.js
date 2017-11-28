'use strict';

const nconf = require('nconf');

nconf.env();
nconf.file({ file: `${__dirname}/config.json` });

nconf.set('SERVER:HOST', '172.20.168.15');
nconf.set('SERVER:PORT', '13002');
nconf.set('DATABASE:HOST', '172.20.168.15');
nconf.set('DATABASE:NAME', 'retrospective-db');
nconf.set('DATABASE:PORT', '27017');
module.exports = nconf;
