/**
 * Created by Ehofas on 6/22/2017.
 */

var player = require('play');

export default class soundManager {
    public static playSound() {
        console.log("playing sound")
        player.sound('./resources/sounds/dolphinLaugh.mp3');
    };
}



//
//
//


