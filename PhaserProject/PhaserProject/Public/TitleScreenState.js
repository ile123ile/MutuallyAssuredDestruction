var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MutuallyAssuredDestruction;
(function (MutuallyAssuredDestruction) {
    var TitleScreenState = (function (_super) {
        __extends(TitleScreenState, _super);
        function TitleScreenState() {
            _super.call(this);
        }
        TitleScreenState.prototype.create = function () {
            this.titleScreenImage = this.add.sprite(0, 0, "title");
            this.titleScreenImage.scale.setTo(this.game.width / this.titleScreenImage.width, this.game.height / this.titleScreenImage.height); //scales image
            this.music = this.game.add.audio("TitleSong");
            this.music.volume = 100;
            this.music.loop = true;
            this.music.play();
        };
        return TitleScreenState;
    })(Phaser.State);
    MutuallyAssuredDestruction.TitleScreenState = TitleScreenState;
})(MutuallyAssuredDestruction || (MutuallyAssuredDestruction = {}));
//# sourceMappingURL=TitleScreenState.js.map