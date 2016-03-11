module MutuallyAssuredDestruction {
    export enum PlayerState { IDLE, WALKING }
    export class Player extends Phaser.Sprite {
        game: Phaser.Game;
        playerState: PlayerState;
        RIGHT_ARROW: Phaser.Key;
        LEFT_ARROW: Phaser.Key;

        walkingSpeed: number;

        public static MAX_SPEED: number = 30;
    }
}