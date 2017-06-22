"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var jiraAddress = "http://172.20.10.4:8080/rest/webhooks/1.0/webhook";
var aggregatorAddress = "http://172.20.10.3:8082/api/";
var adminJiraUser = "admin";
var suprScrtPwd = "admin";
var JiraHooks = (function () {
    function JiraHooks() {
    }
    JiraHooks.prototype.initHooks = function () {
        this.setupSprintStartEnd();
        this.setupIssueHooks("TEST");
        this.setupIssueHooks("BAD");
    };
    JiraHooks.prototype.setupIssueHooks = function (project) {
        var jiraEvents = ["jira:issue_created", "jira:issue_updated"];
        var name = "DophinIssueHook" + project;
        var endpoint = "jiraissues";
        this.createGenericHook(name, jiraEvents, project, endpoint);
    };
    JiraHooks.prototype.setupSprintStartEnd = function () {
        var jiraEvents = ["sprint_started", "sprint_closed"];
        var name = "DophinStartEnd";
        var endpoint = "jirasprints";
        this.createGenericHook(name, jiraEvents, "", endpoint);
    };
    JiraHooks.prototype.createGenericHook = function (name, jiraEvents, project, endpoint) {
        console.log("will post something: " + jiraAddress);
        console.log(" name " + name);
        console.log(" url " + aggregatorAddress);
        console.log(" events " + jiraEvents);
        console.log(" project " + project);
        console.log(" endpoint " + endpoint);
        request.post(jiraAddress, {
            json: {
                "name": name,
                "url": aggregatorAddress + endpoint,
                "events": jiraEvents,
                "jqlFilter": "Project = \"" + project + "\"",
                "excludeIssueDetails": false
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //console.log(body)
                //console.log(error);
                //console.log(response);
            }
        }).auth(adminJiraUser, suprScrtPwd, true);
    };
    return JiraHooks;
}());
exports.default = JiraHooks;
