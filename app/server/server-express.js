'use strict';

const express = require(`express`);
const bodyParser = require(`body-parser`);
const loadRoutes = require('./../components/main');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
loadRoutes(app);

module.exports = app;
