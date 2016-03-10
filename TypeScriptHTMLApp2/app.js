var Game;
(function (Game) {
    var MutuallyAssuredDestruction = (function () {
        function MutuallyAssuredDestruction() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        MutuallyAssuredDestruction.prototype.preload = function () {
        };
        MutuallyAssuredDestruction.prototype.create = function () {
        };
        return MutuallyAssuredDestruction;
    })();
    Game.MutuallyAssuredDestruction = MutuallyAssuredDestruction;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.MutuallyAssuredDestruction();
};
//# sourceMappingURL=app.js.map