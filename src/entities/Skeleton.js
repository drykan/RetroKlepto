import Enemy from './Enemy';
import Random from '../utils/Random';
import Global from '../utils/Global';
import SoundEngine from '../utils/SoundEngine';
import EventEngine from '../utils/EventEngine';
import skeletonImg from '../img/skeleton.png';


class Skeleton extends Enemy {
    constructor( xPos, yPos, lvl, hp, atkSpeed, moveSpeed, strength ) {
        super( skeletonImg, 32, 32, 32, 32, true, xPos, yPos, hp, lvl, atkSpeed, moveSpeed, strength );

        this.boundsOffsetX = 7;
        this.boundsWidth = 16;
        this.goIdle = this.goIdle.bind(this);
        this.addAnimation( "idle", [1], 0 );
        this.addAnimation( "walkLeft", [ 3, 4, 5 ], 120, true );
        this.addAnimation( "walkRight", [ 0, 1, 2 ], 120, true );
        this.addAnimation( "attack", [4,5], 60, false, this.goIdle );
        this.isAttacking = false;
    }

    goIdle() {
        this.playAnimation("idle");
        this.isAttacking = false;
    }

    update( elapsed ) {

        if( Global.isGameOver == true || this.isOnScreen() != true ) {
            this.switchState( this.states.IDLE );
        }

        if( this.isAlive ) {
            switch( this.curState ) {
                case this.states.IDLE: {
                    this.xVelocity = this.yVelocity = 0;
                    this.playAnimation( "idle" );
                    this.idleTimer -= elapsed;
                    if( this.idleTimer <= 0 ) {
                        this.idleTimer = Random.range( 500, 1500 );
                        this.wanderTimer = Random.range( 1000, 2000 );
                        this.mCurDirection = this.directions.NONE;
                        this.switchState( this.states.WANDER );
                    }
                }
                break;

                case this.states.WANDER: {
                    this.doWander( elapsed );
                }
                break;

                case this.states.COMBAT: {
                    this.doCombat( elapsed );
                }
                break;
            }

            if( !this.isAttacking ) {
                if( this.xVelocity < 0 || this.yVelocity > 0 ) {
                    this.playAnimation("walkLeft");
                }
                else if( this.xVelocity > 0 || this.yVelocity < 0 ) {
                    this.playAnimation("walkRight");
                }
            }
            super.update( elapsed );
        }
    }

    doWander( elapsed ) {
        if( this.curDirection == this.directions.NONE ) {
            this.mCurDirection = Random.range( 0, 4 );
            this.wanderTimer = Random.range( 1000, 2000 );
        }
        else {
            switch( this.curDirection ) {
                case this.directions.LEFT: {
                    this.xVelocity = -this.moveSpeed;
                }
                break;

                case this.directions.UP: {
                    this.yVelocity = -this.moveSpeed;
                }
                break;

                case this.directions.RIGHT: {
                    this.xVelocity = this.moveSpeed;
                }
                break;

                case this.directions.DOWN: {
                    this.yVelocity = this.moveSpeed;
                }
                break;
            }

            this.wanderTimer -= elapsed;
            if( this.wanderTimer <= 0 ){
                this.switchState( this.states.IDLE );
            }
        }

        if( this.distanceFromPlayer < 45 ) {
            this.switchState( this.states.COMBAT );
        }
    }

    doCombat( elapsed ) {
        if( this.distanceFromPlayer > 22 ) {
            if( Global.playerPos.x < this.x ) {
                this.xVelocity = -this.moveSpeed;
            }
            else if( Global.playerPos.x > this.x ) {
                this.xVelocity = this.moveSpeed;
            }

            if( Global.playerPos.y < this.y ) {
                this.yVelocity = -this.moveSpeed;
            }
            else if( Global.playerPos.y > this.y ) {
                this.yVelocity = this.moveSpeed;
            }
        }
        else {
            this.xVelocity = this.yVelocity = 0;
        }

        this.doAttack( elapsed );

        if( this.distanceFromPlayer > 45 ) {
            this.switchState( this.states.IDLE );
        }
    }

    doAttack( elapsed ) {
        this.attackTimer -= elapsed;
        if( this.attackTimer <= 0 ) {
            this.isAttacking = true;
            this.playAnimation( "attack" );
            this.attackTimer = this.mAttackSpeed;

            let hitChance = Math.random() * 100;
            if( hitChance > 33 ) {
                EventEngine.emit( "playerHit", this.strength );
                SoundEngine.play("playerHit");
            }
            else {
                SoundEngine.play("miss");
            }
        }
    }
}

export default Skeleton;