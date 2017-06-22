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
                            case "Blocker":
                                return eventType.ISSUE_CREATED_BLOCKER;
                            case "Critical":
                                return eventType.ISSUE_CREATED_CRITICAL;
                            case "Major":
                                return eventType.ISSUE_CREATED_MAJOR;
                            case "Minor":
                                return eventType.ISSUE_CREATED_MINOR;
                            case "Trivial":
                                return eventType.ISSUE_CREATED_TRIVIAL;
                        }
                        return eventType.issueCreated;
                    case "Task":
                        return eventType.issueTaken;
                    case "Story":
                        switch (body.user.key) {
                            case "dohlpin":
                                return eventType.dolpinIssueCreated;
                            default:
                                return eventType.issueCreated;
                        }
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
    eventType[eventType["ISSUE_CREATED_BLOCKER"] = "issue-created-blocker"] = "ISSUE_CREATED_BLOCKER";
    eventType[eventType["ISSUE_CREATED_CRITICAL"] = "issue-created-critical"] = "ISSUE_CREATED_CRITICAL";
    eventType[eventType["ISSUE_CREATED_MAJOR"] = "majorIssueCreated"] = "ISSUE_CREATED_MAJOR";
    eventType[eventType["ISSUE_CREATED_MINOR"] = "minorIssueCreated"] = "ISSUE_CREATED_MINOR";
    eventType[eventType["ISSUE_CREATED_TRIVIAL"] = "issue-created-trivial"] = "ISSUE_CREATED_TRIVIAL";
    eventType[eventType["issueCreated"] = "issueCreated"] = "issueCreated";
    eventType[eventType["issueTaken"] = "issueTaken"] = "issueTaken";
    eventType[eventType["issueFinished"] = "issueFinished"] = "issueFinished";
    eventType[eventType["issueClosed"] = "issueClosed"] = "issueClosed";
    eventType[eventType["sprintClosed"] = "celebration"] = "sprintClosed";
    eventType[eventType["sprintStarted"] = "sprintStarted"] = "sprintStarted";
    eventType[eventType["buildStarted"] = "buildStarted"] = "buildStarted";
    eventType[eventType["buildFailed"] = "buildFailed"] = "buildFailed";
    eventType[eventType["buildSucceeded"] = "buildSucceeded"] = "buildSucceeded";
    eventType[eventType["unknown"] = "no idea"] = "unknown";
    eventType[eventType["dolpinIssueCreated"] = "dolphinLaugh"] = "dolpinIssueCreated";
})(eventType = exports.eventType || (exports.eventType = {}));
