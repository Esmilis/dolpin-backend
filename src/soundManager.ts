/**
 * Created by Ehofas on 6/22/2017.
 */
var opts = {};
const path = require('path');
var player = require('play-sound')(opts);

export default class soundManager {
    public static playSound() {
        console.log("playing sound")
        player.play(path.resolve('./resources/sounds/dolphinLaugh.mp3'), err => { console.log("shit", err);});
    };
}



//
//
//


