import Sprite from './Sprite';
import Random from '../utils/Random';
import Global from '../utils/Global';

class Enemy extends Sprite {
    constructor( img, width, height, frameWidth, frameHeight, isAnimated, xPos, yPos, hp, lvl, atkSpeed, moveSpeed, strength ) {
        super( img, width, height, frameWidth, frameHeight, isAnimated, xPos, yPos, hp );
        this.mAttackSpeed = atkSpeed;
        this.mLevel = lvl;
        this.mMoveSpeed = moveSpeed;
        this.mStrength = strength;
        this.wanderTimer = Random.range(200, 400);
        this.idleTimer = Random.range(100, 250);
        this.attackTimer = atkSpeed;
        this.distanceFromPlayer = 1000;

        this.states = {
            IDLE: 0,
            WANDER: 1,
            COMBAT: 2
        };

        this.directions = {
            LEFT: 0,
            UP: 1,
            RIGHT: 2,
            DOWN: 3,
            NONE: 4
        };

        this.mCurDirection = this.directions.NONE;
        this.mCurState = this.states.IDLE;
    }

    update( elapsed ) {
        super.update( elapsed );
        this.distanceFromPlayer = Math.distance( this.midPoint, Global.playerPos );
    }

    render( canvasCtx ) {
        super.render( canvasCtx );
    }

    switchState( value ) {
        if( value >= 0 && value <= 2 ) {
            this.mCurState = value;
        }
    }

    get curState() { return this.mCurState; }
    get curDirection() { return this.mCurDirection; }
    get moveSpeed() { return this.mMoveSpeed; }
    get attackSpeed() { return this.mAttackSpeed; }
    get strength() { return this.mStrength; }
    get level() { return this.mLevel; }
}

export default Enemy;