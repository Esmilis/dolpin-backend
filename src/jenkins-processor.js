"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jira_processor_1 = require("./jira-processor");
var JenkinsProcessor = (function () {
    function JenkinsProcessor() {
    }
    JenkinsProcessor.process = function (body) {
        return new jira_processor_1.SoundEvent(body.name, this.getStatus(body));
    };
    JenkinsProcessor.getStatus = function (body) {
        switch (body.build.phase) {
            case "STARTED":
                return jira_processor_1.eventType.buildStarted;
            case "COMPLETED":
                switch (body.build.status) {
                    case "FAILURE":
                        return jira_processor_1.eventType.buildFailed;
                    case "SUCCESS":
                        return jira_processor_1.eventType.buildSucceeded;
                }
        }
    };
    return JenkinsProcessor;
}());
exports.default = JenkinsProcessor;
