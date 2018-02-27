import Input from '../utils/Input';
import Sprite from './Sprite';

// image import
import playerImg from '../img/playerSprite.png';

class Player extends Sprite {
    constructor() {
        super( playerImg, 24, 24, 24, 24, true, 0, 0 );
        this.speed = 0.045;
    }

    init() {
        this.addAnimation( "idle", [0], 0 );
        this.addAnimation( "walk", [0,1], 200 );
    }

    update( elapsed ) {

        if( Input.isKeyDown( "A" ) || Input.isKeyDown( "LEFT" ) ) {
            this.xVelocity = -this.speed;
        }
        else if( Input.isKeyDown( "D" ) || Input.isKeyDown( "RIGHT" ) ) {
            this.xVelocity = this.speed;
        }
        else {
            this.xVelocity = 0;
        }

        if( Input.isKeyDown( "W" ) || Input.isKeyDown( "UP" ) ) {
            this.yVelocity = -this.speed;
        }
        else if( Input.isKeyDown( "S" ) || Input.isKeyDown( "DOWN" ) ) {
            this.yVelocity = this.speed;
        }
        else {
            this.yVelocity = 0;
        }

        if( this.xVelocity != 0 || this.yVelocity != 0 ) {
            this.playAnimation("walk");
        }
        else {
            this.playAnimation("idle");
        }

        super.update(elapsed);
    }
}

export default Player;