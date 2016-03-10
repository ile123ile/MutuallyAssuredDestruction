var Game;
(function (Game) {
    var TypeScriptHTMLApp3 = (function () {
        function TypeScriptHTMLApp3() {
            this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', {
                create: this.create, preload: this.preload
            });
        }
        TypeScriptHTMLApp3.prototype.preload = function () {
        };
        TypeScriptHTMLApp3.prototype.create = function () {
        };
        return TypeScriptHTMLApp3;
    })();
    Game.TypeScriptHTMLApp3 = TypeScriptHTMLApp3;
})(Game || (Game = {}));
window.onload = function () {
    var game = new Game.TypeScriptHTMLApp3();
};
//# sourceMappingURL=app.js.map