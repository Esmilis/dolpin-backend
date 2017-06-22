export class JiraProcessor {
    public static process(body: object): SoundEvent {
        return new SoundEvent(this.detectTeam(body), this.detectIssue(body))
    }

    private static detectTeam(body: object): string {
        return body.issue.fields.project.name;
    }

    private static detectIssue(body: object): eventType {
        switch (body.issue_event_type_name) {
            case "issue_created":
                return eventType.issueCreated;

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
    issueCreated = <any> "issueCreated",
    issueTaken = <any> "issueTaken",
    issueFinished = <any> "issueFinished",
    issueClosed = <any> "issueClosed",
    unknown = <any> "no idea",
}