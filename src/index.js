"use strict";
// server.js
Object.defineProperty(exports, "__esModule", { value: true });
// BASE SETUP
// =============================================================================
var soundManager_1 = require("./soundManager");
var jira_processor_1 = require("./jira-processor");
// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// #mongoose.connect('mongodb://localhost:27017/dolphin'); // connect to our database
var player = new soundManager_1.default();
// var Cat = mongoose.model('Cat', { name: String });
//
// var kitty = new Cat({ name: 'Zildjian' });
// kitty.save(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('meow');
//     }
// });
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var port = process.env.PORT || 8082; // set our port
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router
// test route to make sure everything is working (accessed at GET http://localhost:8082/api)
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
router.route('/jiraissues').post(function (req, res) {
    player.play(jira_processor_1.JiraProcessor.processIssue(req.body));
});
router.route('/jirasprints').post(function (req, res) {
    player.play(jira_processor_1.JiraProcessor.processSprint(req.body));
});
router.route('/jenkinshooks').post(function (req, res) {
    player.playOne("sprintClosed");
});
router.route('/updateConfig').get(function (req, res) {
    console.log("updateConfig");
    res.json({ message: 'update config' });
});
// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
