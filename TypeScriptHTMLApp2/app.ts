﻿module Game {
    export class MutuallyAssuredDestruction {
        game: Phaser.Game;
        constructor() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        preload() {

        }
        create() {
        }

    }
}

window.onload = () => {
    var game = new Game.MutuallyAssuredDestruction();
};