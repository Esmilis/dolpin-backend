import * as _ from "underscore";

export class JiraProcessor {
    public static process(body: object): SoundEvent {
        console.log(body);
        return new SoundEvent(this.detectTeam(body), this.detectIssue(body))
    }

    private static detectTeam(body: object): string {
        return body.issue.fields.project.name;
    }

    private static detectIssue(body: object): eventType {


        switch (body.issue_event_type_name) {
            case "issue_created":
                return eventType.issueCreated;

            case "issue_updated":
                let lastChange = _.last(body.changelog.items).toString;
                switch(lastChange) {
                    case "In Progress":
                        return eventType.issueTaken;

                    case "Done":
                        return eventType.issueFinished;
                }
            default:
                return eventType.unknown;
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
    criticalIssueCreated = <any> "criticalIssueCreated",
    blockerIssueCreated = <any> "blockerIssueCreated",
    trivialIssueCreated = <any> "trivialIssueCreated",
    issueCreated = <any> "issueCreated",
    issueTaken = <any> "issueTaken",
    issueFinished = <any> "issueFinished",
    issueClosed = <any> "issueClosed",
    unknown = <any> "no idea",
}