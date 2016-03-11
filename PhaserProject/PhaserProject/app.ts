module Game {
    export class PhaserProject {
        game: Phaser.Game;

        constructor() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        preload() {

            //Graphics
            this.game.load.image("title", "/Graphics/titletemplate.jpg");
            this.game.load.image("greenSquare", "/Graphics/greenSquare.png");
            //Spritesheets if we use any animations
            //Audio
            this.game.load.audio("TitleSong", ["Sounds/TitleSong.mp3", "Sounds/TitleSong.ogg", "Songs/TitleSong.wav"]);
        }
        create() {
            this.game.state.add("TitleScreenState",
                MutuallyAssuredDestruction.TitleScreenState, true);//running state
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;//handle resolutions automatically
            
        }
    }
}

window.onload = () => {
    var game = new Game.PhaserProject();
};