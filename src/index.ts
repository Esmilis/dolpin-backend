// server.js

// BASE SETUP
// =============================================================================
import SoundManager from './soundManager';
import {eventType, JiraProcessor, SoundEvent} from "./jira-processor";
import JiraHooks from './requests/jira/jira-requests';
import JenkinsProcessor from "./jenkins-processor";
// call the packages we need

var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// #mongoose.connect('mongodb://localhost:27017/dolphin'); // connect to our database
var player = new SoundManager();
var jiraHooksManufactory = new JiraHooks();
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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8082;        // set our port

var placeholderConfig = {
    blockerIssue: true,
    bugCreated: false,
    buildCompleted: true,
    buildFailed: true,
    buildFailing: true,
    buildStarted: false,
    criticalIssue: true,
    issueClosed: false,
    issueCreated: false,
    issueFinished: false,
    issueTaken: false,
    majorIssue: true,
    minorIssue: false,
    name: "randomTeam",
    newPullRequest: true,
    pullRequestApproved: true,
    pullRequestNeedsWork: true,
    sprintFinished: true,
    sprintStarted: true,
    trivialIssue: false,
    unknown: false,
    usClosed: true
};

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8082/api)
router.get('/', function (req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

router.route('/jiraissues').post((req, res) => {
    player.play(JiraProcessor.processIssue(req.body));
});

router.route('/jirasprints').post((req, res) => {
    player.play(JiraProcessor.processSprint(req.body));
});

router.route('/setupjirahooks').get((req, res) => {
    console.log("starting init of hooks");
    jiraHooksManufactory.initHooks();
});

router.route('/jenkinshooks').post((req, res) => {
    player.play(JenkinsProcessor.process(req.body));
});

router.route('/updateConfig').post(function (req, res) {
    //this has to go to database.
    console.log("req:", req.body);
    res.json({message: 'update config'});
});

router.route('/getConfig').get(function (req, res) {
    console.log("getConfig!");
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(placeholderConfig));
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);