var express = require("express");
const { addContactUs, getContactUs } = require('../controller/contactUsController');
const { googleLogin } = require("../controller/userController");
const { deepResearch } = require("../controller/deepResearchController");
const { generateText, generateImage } = require("../controller/aimodalController");
var indexRoute = express.Router();

indexRoute.post('/contactus', addContactUs);
indexRoute.get('/contactus', getContactUs);
indexRoute.post('/google-login', googleLogin);
indexRoute.post('/deep-research', deepResearch);
indexRoute.post("/generate-text", generateText);
indexRoute.post("/generate-image", generateImage);

module.exports = indexRoute;