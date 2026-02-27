var express = require("express");
const { addContactUs, getContactUs } = require('../controller/contactUsController');

var indexRoute = express.Router();

indexRoute.post('/contactus', addContactUs);
indexRoute.get('/contactus', getContactUs);

module.exports = indexRoute;
