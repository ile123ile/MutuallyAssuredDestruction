var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MutuallyAssuredDestruction;
(function (MutuallyAssuredDestruction) {
    var GamePlayState = (function (_super) {
        __extends(GamePlayState, _super);
        function GamePlayState() {
            _super.call(this);
        }
        GamePlayState.prototype.create = function () {
        };
        return GamePlayState;
    })(Phaser.State);
    MutuallyAssuredDestruction.GamePlayState = GamePlayState;
})(MutuallyAssuredDestruction || (MutuallyAssuredDestruction = {}));
//# sourceMappingURL=GamePlayState.js.map