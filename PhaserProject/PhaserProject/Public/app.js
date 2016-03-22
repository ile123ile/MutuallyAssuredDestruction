var Game;
(function (Game) {
    var PhaserProject = (function () {
        function PhaserProject() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        PhaserProject.prototype.preload = function () {
            //Graphics
            this.game.load.image("title", "/Graphics/titletemplate.jpg");
            this.game.load.image("greenSquare", "/Graphics/greenSquare.png");
            //Spritesheets if we use any animations
            //Audio
            this.game.load.audio("TitleSong", ["Sounds/TitleSong.mp3", "Sounds/TitleSong.ogg", "Songs/TitleSong.wav"]);
        };
        PhaserProject.prototype.create = function () {
            this.game.state.add("TitleScreenState", MutuallyAssuredDestruction.TitleScreenState, true); //running state
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //handle resolutions automatically
        };
        return PhaserProject;
    })();
    Game.PhaserProject = PhaserProject;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.PhaserProject();
};
//# sourceMappingURL=app.js.map