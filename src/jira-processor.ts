import * as _ from "underscore";
import {eventTypeJenkins} from "./jenkins-processor";

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

    private static detectIssue(body: object): eventTypeJira {
        switch (body.issue_event_type_name) {
            case "issue_created":
                switch (body.issue.fields.issuetype.name) {
                    case "Bug":
                        switch (body.issue.fields.priority.name) {
                            case "Blocker":
                                return eventTypeJira.ISSUE_CREATED_BLOCKER;
                            case "Critical":
                                return eventTypeJira.ISSUE_CREATED_CRITICAL;
                            case "Major":
                                return eventTypeJira.ISSUE_CREATED_MAJOR;
                            case "Minor":
                                return eventTypeJira.ISSUE_CREATED_MINOR;
                            case "Trivial":
                                return eventTypeJira.ISSUE_CREATED_TRIVIAL;
                        }
                        return eventTypeJira.ISSUE_CREATED;

                    case "Task":
                        return eventTypeJira.issueTaken;

                    case "Story":
                        switch (body.user.key) {
                            case "dohlpin":
                                return eventTypeJira.dolpinIssueCreated;
                            default :
                                return eventTypeJira.ISSUE_CREATED;
                        }
                }
                return eventTypeJira.ISSUE_CREATED;

            case "issue_updated":
            case "issue_generic":
                let lastChange = _.last(body.changelog.items);
                switch (body.issue.fields.issuetype.name) {
                    case "Bug":
                        switch (lastChange.toString) {
                            case "In Progress":
                                return eventTypeJira.BUG_TAKEN;
                            case "Done":
                                return eventTypeJira.BUG_CLOSED;
                            default:
                                return;
                        }
                    default:
                        switch (lastChange.field) {
                            case "Requirements":
                                return eventTypeJira.ISSUE_EDIT_REQUIREMENTS;
                            case "status":
                                switch (lastChange.toString) {
                                    case "In Progress":
                                        return eventTypeJira.ISSUE_STATUS_IN_PROGRESS;
                                    case "Done":
                                        return eventTypeJira.ISSUE_STATUS_DONE;
                                    default:
                                        return;
                                }
                            default:
                                return;
                        }
                }
            default:
                return eventTypeJira.UNKNOWN;
        }
    }

    private static detectSprint(body: object): eventTypeJira {
        switch (body.webhookEvent) {
            case "sprint_closed":
                return eventTypeJira.sprintClosed;

            case "sprint_started":
                return eventTypeJira.sprintStarted;
        }
    }
}

export class SoundEvent {
    public teamName: string;
    public event: eventTypeJenkins | eventTypeJira;

    constructor(teamname: string, event: eventTypeJenkins | eventTypeJira) {
        this.teamName = teamname;
        this.event = event;
    }
}

export enum eventTypeJira {
    ISSUE_CREATED_BLOCKER = <any> "issue-created-blocker",
    ISSUE_CREATED_CRITICAL = <any> "issue-created-critical",
    ISSUE_CREATED_MAJOR = <any> "issue-created-major",
    ISSUE_CREATED_MINOR = <any> "issue-created-minor",
    ISSUE_CREATED_TRIVIAL = <any> "issue-created-trivial",
    ISSUE_CREATED = <any> "issue-created",
    dolpinIssueCreated = <any> "dolphinLaugh",

    ISSUE_EDIT_REQUIREMENTS = <any> "issue-edit-requirements",

    issueTaken = <any> "issueTaken",
    ISSUE_STATUS_IN_PROGRESS = <any> "issue-status-in-progress",
    ISSUE_STATUS_DONE = <any> "issue-status-done",
    ISSUE_STATUS_CLOSED = <any> "issue-status-closed",
    BUG_CLOSED = <any> "bugClosed",
    BUG_TAKEN = <any> "bugTaken",

    sprintClosed = <any> "celebration",
    sprintStarted = <any> "sprintStarted",

    UNKNOWN = <any> "no idea",

    BITCH_ASS_NIGA = <any> "kaz" // need Kaz issue type - bitch ass niga, would be valuable to get authentic input
}