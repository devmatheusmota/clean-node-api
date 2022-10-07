const express = require('express');
const app = express();
const setupRoutes = require('./routes');

const setupApp = require('./setup');

setupApp(app);
setupRoutes(app);

module.exports = app;
