var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MutuallyAssuredDestruction;
(function (MutuallyAssuredDestruction) {
    (function (PlayerState) {
        PlayerState[PlayerState["IDLE"] = 0] = "IDLE";
        PlayerState[PlayerState["WALKING"] = 1] = "WALKING";
    })(MutuallyAssuredDestruction.PlayerState || (MutuallyAssuredDestruction.PlayerState = {}));
    var PlayerState = MutuallyAssuredDestruction.PlayerState;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.apply(this, arguments);
        }
        Player.MAX_SPEED = 30;
        return Player;
    })(Phaser.Sprite);
    MutuallyAssuredDestruction.Player = Player;
})(MutuallyAssuredDestruction || (MutuallyAssuredDestruction = {}));
//# sourceMappingURL=Player.js.map