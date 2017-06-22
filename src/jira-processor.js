"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var JiraProcessor = (function () {
    function JiraProcessor() {
    }
    JiraProcessor.processIssue = function (body) {
        return new SoundEvent(this.detectTeam(body), this.detectIssue(body));
    };
    JiraProcessor.processSprint = function (body) {
        console.log(body);
        return new SoundEvent(this.detectSprintTeam(body), this.detectSprint(body));
    };
    JiraProcessor.detectTeam = function (body) {
        return body.issue.fields.project.name;
    };
    JiraProcessor.detectSprintTeam = function (body) {
        if (body.sprint.name.match(/BAD[\w\s]+/))
            return "Bad Project";
        else if (body.sprint.name.match(/TEST[\w\s]+/))
            return "TEST";
    };
    JiraProcessor.detectIssue = function (body) {
        switch (body.issue_event_type_name) {
            case "issue_created":
                switch (body.issue.fields.issuetype.name) {
                    case "Bug":
                        switch (body.issue.fields.priority.name) {
                            case "Highest":
                                return eventType.issueTaken;
                            case "High":
                                return eventType.issueTaken;
                            case "High":
                                return eventType.issueTaken;
                            case "Medium":
                                return eventType.issueTaken;
                            case "Low":
                                return eventType.issueTaken;
                            case "Lowest":
                                return eventType.issueTaken;
                        }
                        return eventType.issueCreated;
                    case "Task":
                        return eventType.issueTaken;
                    case "Story":
                        return eventType.issueTaken;
                }
                return eventType.issueCreated;
            case "issue_updated":
            case "issue_generic":
                var lastChange = _.last(body.changelog.items).toString;
                switch (lastChange) {
                    case "In Progress":
                        return eventType.issueTaken;
                    case "Done":
                        return eventType.issueFinished;
                }
            default:
                return eventType.unknown;
        }
    };
    JiraProcessor.detectSprint = function (body) {
        switch (body.webhookEvent) {
            case "sprint_closed":
                return eventType.sprintClosed;
            case "sprint_started":
                return eventType.sprintStarted;
        }
    };
    return JiraProcessor;
}());
exports.JiraProcessor = JiraProcessor;
var SoundEvent = (function () {
    function SoundEvent(teamname, event) {
        this.teamName = teamname;
        this.event = event;
    }
    return SoundEvent;
}());
exports.SoundEvent = SoundEvent;
var eventType;
(function (eventType) {
    eventType[eventType["criticalIssueCreated"] = "criticalIssueCreated"] = "criticalIssueCreated";
    eventType[eventType["blockerIssueCreated"] = "blockerIssueCreated"] = "blockerIssueCreated";
    eventType[eventType["trivialIssueCreated"] = "trivialIssueCreated"] = "trivialIssueCreated";
    eventType[eventType["issueCreated"] = "issueCreated"] = "issueCreated";
    eventType[eventType["issueTaken"] = "issueTaken"] = "issueTaken";
    eventType[eventType["issueFinished"] = "issueFinished"] = "issueFinished";
    eventType[eventType["issueClosed"] = "issueClosed"] = "issueClosed";
    eventType[eventType["sprintClosed"] = "sprintClosed"] = "sprintClosed";
    eventType[eventType["sprintStarted"] = "celebration"] = "sprintStarted";
    eventType[eventType["buildStarted"] = "buildStarted"] = "buildStarted";
    eventType[eventType["buildFailed"] = "buildFailed"] = "buildFailed";
    eventType[eventType["buildSucceeded"] = "buildSucceeded"] = "buildSucceeded";
    eventType[eventType["unknown"] = "no idea"] = "unknown";
})(eventType = exports.eventType || (exports.eventType = {}));
