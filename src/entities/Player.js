import Input from '../utils/Input';
import Sprite from './Sprite';

// image import
import playerImg from '../img/playerSprite.png';

class Player extends Sprite {
    constructor( xPos, yPos, hp ) {
        super( playerImg, 24, 24, 24, 24, true, xPos, yPos, hp );
        this.speed = 0.045;
        this.loot = [];
        this.currentLootIndex = 0;
        this.isAttacking = false;
        this.onAttackComplete = this.onAttackComplete.bind(this);
    }

    init() {
        this.addAnimation( "idle", [0], 0 );
        this.addAnimation( "walk", [0, 1], 200, true );
        this.addAnimation( "atkR", [0, 2], 60, false, this.onAttackComplete );
        this.addAnimation( "atkL", [0, 3], 60, false, this.onAttackComplete );
        this.addAnimation( "atkD", [0, 4], 60, false, this.onAttackComplete );
        this.addAnimation( "atkU", [0, 5], 60, false, this.onAttackComplete );
    }

    onAttackComplete() {
        this.isAttacking = false;
    }

    getLootItem() {
        return this.loot[this.currentLootIndex];
    }

    getNextLootItem() {
        if( this.currentLootIndex < this.loot.length - 1 ) {
            ++this.currentLootIndex;
        }
        else {
            this.currentLootIndex = 0;
        }

        return this.loot[ this.currentLootIndex ];
    }

    getPrevLootItem() {
        if( this.currentLootIndex > 0 ) {
            --this.currentLootIndex;
        }
        else {
            this.currentLootIndex = this.loot.length - 1;
        }

        return this.loot[ this.currentLootIndex ];
    }

    update( elapsed ) {
        if( this.isAlive ) {
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
 
            if( Input.mouseJustPressed( "LEFT_MOUSE" ) ) {
                // test attack
                if( Math.abs( Math.distance( this.screenPosition, Input.mouseClick ) ) < 50 ) {
                    let xDif = (this.screenPosition.x + this.fWidth * 0.5) - Input.mouseClick.x;
                    let yDif = (this.screenPosition.y + this.fHeight * 0.5) - Input.mouseClick.y;
                    let angle = Math.atan2( yDif, xDif ) * 180 / Math.PI;

                    this.isAttacking = true;
                    if( angle >= 45 && angle <= 145 ) {
                        this.playAnimation("atkU");
                    }
                    else if( angle > 145 || angle <= -137 ) {
                        this.playAnimation("atkR");
                    }
                    else if( angle > -137 && angle <= -41 ) {
                        this.playAnimation("atkD");
                    }
                    else {
                        this.playAnimation("atkL");
                    }

                    //console.log('A:',angle);
                }
            }

            if( !this.isAttacking ) {
                if( this.xVelocity != 0 || this.yVelocity != 0 ) {
                    this.playAnimation("walk");
                }
                else {
                    this.playAnimation("idle");
                }
            }

            super.update(elapsed);
        }
    }
}

export default Player;