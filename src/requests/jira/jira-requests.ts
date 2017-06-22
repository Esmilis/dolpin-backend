var request = require('request');
var jiraAddress = "http://172.20.10.2:8080";
var aggregatorAddress = "http://172.20.10.3:8082/api/";
var adminJiraUser = "admin";
var suprScrtPwd = "admin";

export default class JiraHooks {
    public initHooks() {
        this.setupSprintStartEnd("TEST");
        this.setupSprintStartEnd("BAD");



    }

    public setupIssueHooks(project){
        var jiraEvents = ["jira:issue_created", "jira:issue_updated"];
        var name = "DophinIssueHook" + project;
    }

    public setupSprintStartEnd(project){
        var jiraEvents = ["sprint_started", "sprint_closed"];
        var name = "DophinStartEnd" + project;
        this.createGenericHook(name, jiraEvents, project);
    }

    private createGenericHook(name: string, jiraEvents: (string | string)[], project) {
        request.post(
            jiraAddress,
            {
                json: {
                    "name": name,
                    "url": aggregatorAddress + "jirasprints",
                    "events": jiraEvents,
                    "jqlFilter": "Project = " + project,
                    "excludeIssueDetails": false
                }

            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        ).auth(adminJiraUser, suprScrtPwd, false);
    }
}
