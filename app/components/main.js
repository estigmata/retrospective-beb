'use strict';

const retrospectiveRoutes = require('./retrospectives/retrospective.routes');
const itemRoutes = require('./items/item.routes');
const playerRoutes = require('./players/player.routes');
const userRoutes = require('./users/user.routes');

function loadRoutes (app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Authorization');
    res.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
  });
  app.use('/items', itemRoutes);
  app.use('/retrospectives', retrospectiveRoutes);
  app.use('/players', playerRoutes);
  app.use('/users', userRoutes);

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({ error: { title: err.title, message: err.message } });
    next();
  });
}

module.exports = loadRoutes;
