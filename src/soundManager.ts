import {eventType, SoundEvent} from "./jira-processor";
/**
 * Created by Ehofas on 6/22/2017.
 */
var opts = {};
const path = require('path');
var player = require('play-sound')(opts);
const resourcePath = './resources/sounds/';

export default class SoundManager {
    public play(event: SoundEvent) {
        console.log("playing sound", event);
        if(event.event !== eventType.unknown) {
            this.queue(path.resolve(resourcePath, event.teamName + '.mp3'));
            this.queue(path.resolve(resourcePath, event.event + '.mp3'));
        }
    };

    public playOne(name: string) {
        this.queue(path.resolve(resourcePath, name + '.mp3'));

    }

    private list = [];
    private playing = false;

    private queue(sound: string) {
        if (this.playing) {
            this.list.push(sound);
        }
        else {
            this.playing = true;
            player.play(sound, () => {
                this.callback()
            });
        }
    }

    private callback() {
        console.log("callback", this.list.length);
        if (this.list.length == 0) {
            this.playing = false;
            return;
        }
        else {
            player.play(this.list.splice(0, 1)[0], () => {
                this.callback()
            });
        }
    }
}


//
//
//


