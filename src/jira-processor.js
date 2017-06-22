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
        return undefined;
    };
    JiraProcessor.detectTeam = function (body) {
        return body.issue.fields.project.name;
    };
    JiraProcessor.detectIssue = function (body) {
        switch (body.issue_event_type_name) {
            case "issue_created":
                return eventType.issueCreated;
            case "issue_updated":
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
    eventType[eventType["unknown"] = "no idea"] = "unknown";
})(eventType = exports.eventType || (exports.eventType = {}));
