"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var jiraAddress = "http://172.20.10.2:8080";
var aggregatorAddress = "http://172.20.10.3:8082/api/";
var adminJiraUser = "admin";
var suprScrtPwd = "admin";
var JiraHooks = (function () {
    function JiraHooks() {
    }
    JiraHooks.prototype.initHooks = function () {
        this.setupSprintStartEnd("TEST");
        this.setupSprintStartEnd("BAD");
        this.setupIssueHooks("TEST");
        this.setupIssueHooks("BAD");
    };
    JiraHooks.prototype.setupIssueHooks = function (project) {
        var jiraEvents = ["jira:issue_created", "jira:issue_updated"];
        var name = "DophinIssueHook" + project;
        this.createGenericHook(name, jiraEvents, project);
    };
    JiraHooks.prototype.setupSprintStartEnd = function (project) {
        var jiraEvents = ["sprint_started", "sprint_closed"];
        var name = "DophinStartEnd" + project;
        this.createGenericHook(name, jiraEvents, project);
    };
    JiraHooks.prototype.createGenericHook = function (name, jiraEvents, project) {
        request.post(jiraAddress, {
            json: {
                "name": name,
                "url": aggregatorAddress + "jirasprints",
                "events": jiraEvents,
                "jqlFilter": "Project = " + project,
                "excludeIssueDetails": false
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }).auth(adminJiraUser, suprScrtPwd, false);
    };
    return JiraHooks;
}());
exports.default = JiraHooks;
