import {eventType, SoundEvent} from "./jira-processor";
export default class JenkinsProcessor {
    public static process(body: object): SoundEvent {
        return new SoundEvent(body.name, this.getStatus(body));
    }

    private static getStatus(body: object): eventType {
        switch (body.build.phase) {
            case "STARTED":
                return eventType.buildStarted;

            case "COMPLETED":
                switch (body.build.status) {
                    case "FAILURE":
                        return eventType.buildFailed;

                    case "SUCCESS":
                        return eventType.buildSucceeded;

                }

        }
    }
}
