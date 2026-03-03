var express = require("express");
const { addContactUs, getContactUs } = require('../controller/contactUsController');
const { googleLogin } = require("../controller/userController");
const { deepResearch } = require("../controller/deepResearchController");
var indexRoute = express.Router();

indexRoute.post('/contactus', addContactUs);
indexRoute.get('/contactus', getContactUs);
indexRoute.post('/google-login', googleLogin);
indexRoute.post('/deep-research', deepResearch);
module.exports = indexRoute;
