import {SoundEvent} from "./jira-processor";
/**
 * Created by Ehofas on 6/22/2017.
 */
var opts = {};
const path = require('path');
var player = require('play-sound')(opts);

export default class SoundManager {
    public play(event: SoundEvent) {
        console.log("playing sound", event);
        player.play(path.resolve('./resources/sounds/dolphinLaugh.mp3'), err => { console.log("shit", err);}).then(e=>console.log("donePlaying"));
    };
}



//
//
//


