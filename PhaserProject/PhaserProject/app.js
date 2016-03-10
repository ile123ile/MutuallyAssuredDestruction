var Game;
(function (Game) {
    var PhaserProject = (function () {
        function PhaserProject() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        PhaserProject.prototype.preload = function () {
        };
        PhaserProject.prototype.create = function () {
        };
        return PhaserProject;
    })();
    Game.PhaserProject = PhaserProject;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.PhaserProject();
};
//# sourceMappingURL=app.js.map