var express = require("express");
const { addContactUs, getContactUs } = require('../controller/contactUsController');
const { googleLogin } = require("../controller/userController");
var indexRoute = express.Router();

indexRoute.post('/contactus', addContactUs);
indexRoute.get('/contactus', getContactUs);
indexRoute.post('/google-login', googleLogin);
module.exports = indexRoute;
