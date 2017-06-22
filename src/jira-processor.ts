import * as _ from "underscore";

export class JiraProcessor {
    public static processIssue(body: object): SoundEvent {
        return new SoundEvent(this.detectTeam(body), this.detectIssue(body))
    }

    public static processSprint(body: object): SoundEvent {
        console.log(body);
        return new SoundEvent(this.detectSprintTeam(body), this.detectSprint(body));
    }

    private static detectTeam(body: object): string {
        return body.issue.fields.project.name;
    }

    private static detectSprintTeam(body: object): string {
        if (body.sprint.name.match(/BAD[\w\s]+/))
            return "Bad Project";
        else if (body.sprint.name.match(/TEST[\w\s]+/))
            return "TEST";
    }

    private static detectIssue(body: object): eventType {
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
                        switch (body.user.key){
                            case "Dohlpin":
                                return eventType.dolpinIssueCreated;
                            default :
                                return eventType.issueTaken;
                        }
                }
                return eventType.issueCreated;

            case "issue_updated":
            case "issue_generic":
                let lastChange = _.last(body.changelog.items).toString;
                switch (lastChange) {
                    case "In Progress":
                        return eventType.issueTaken;

                    case "Done":
                        return eventType.issueFinished;
                }
            default:
                return eventType.unknown;
        }
    }

    private static detectSprint(body: object): eventType {
        switch (body.webhookEvent) {
            case "sprint_closed":
                return eventType.sprintClosed;

            case "sprint_started":
                return eventType.sprintStarted;
        }
    }
}

export class SoundEvent {
    public teamName: string;
    public event: eventType;

    constructor(teamname: string, event: eventType) {
        this.teamName = teamname;
        this.event = event;
    }
}

export enum eventType {
    ISSUE_CREATED_BLOCKER = <any> "issue-created-blocker",
    ISSUE_CREATED_CRITICAL = <any> "issue-created-critical",
    ISSUE_CREATED_MAJOR = <any> "majorIssueCreated",
    ISSUE_CREATED_MINOR = <any> "minorIssueCreated",
    ISSUE_CREATED_TRIVIAL = <any> "issue-created-trivial",

    issueCreated = <any> "issueCreated",
    issueTaken = <any> "issueTaken",
    issueFinished = <any> "issueFinished",
    issueClosed = <any> "issueClosed",
    sprintClosed = <any> "celebration",
    sprintStarted = <any> "sprintStarted",
    buildStarted = <any> "buildStarted",
    buildFailed = <any> "buildFailed",
    buildSucceeded = <any> "buildSucceeded",
    unknown = <any> "no idea",
    dolpinIssueCreated = <any> "dolphinLaugh"
}