import { SoundEvent } from "./jira-processor";

export default class JenkinsProcessor {
    public static process(body: object): SoundEvent {
        return new SoundEvent("TEST", this.getStatus(body));
    }

    private static getStatus(body: object): eventTypeJenkins {
        switch (body.build.phase) {
            case "STARTED":
                return eventTypeJenkins.BUILD_STARTED;

            case "COMPLETED":
                switch (body.build.status) {
                    case "FAILURE":
                        return eventTypeJenkins.BUILD_FAILED;
                    case "SUCCESS":
                        return eventTypeJenkins.BUILD_SUCCEEDED;
                    default:
                        return eventTypeJenkins.UNKNOWN
                }
            default:
                return eventTypeJenkins.UNKNOWN;
        }
    }
}

export enum eventTypeJenkins {
    BUILD_STARTED = <any> "build-started",
    BUILD_FAILED = <any> "build-failed",
    BUILD_SUCCEEDED = <any> "build-success",
    UNKNOWN = <any> "---"
}
