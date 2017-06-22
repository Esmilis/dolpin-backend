"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Ehofas on 6/22/2017.
 */
var opts = {};
var path = require('path');
var player = require('play-sound')(opts);
var resourcePath = './resources/sounds/';
var SoundManager = (function () {
    function SoundManager() {
        this.list = [];
        this.playing = false;
    }
    SoundManager.prototype.play = function (event) {
        console.log("playing sound", event);
        this.queue(path.resolve(resourcePath, event.teamName + '.mp3'));
        this.queue(path.resolve(resourcePath, event.event + '.mp3'));
    };
    ;
    SoundManager.prototype.playOne = function (name) {
        this.queue(path.resolve(resourcePath, name + '.mp3'));
    };
    SoundManager.prototype.queue = function (sound) {
        var _this = this;
        if (this.playing) {
            this.list.push(sound);
        }
        else {
            this.playing = true;
            player.play(sound, function () {
                _this.callback();
            });
        }
    };
    SoundManager.prototype.callback = function () {
        var _this = this;
        console.log("callback", this.list.length);
        if (this.list.length == 0) {
            this.playing = false;
            return;
        }
        else {
            player.play(this.list.splice(0, 1)[0], function () {
                _this.callback();
            });
        }
    };
    return SoundManager;
}());
exports.default = SoundManager;
//
//
//
