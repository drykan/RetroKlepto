import SoundEngine from '../utils/SoundEngine';
import Sprite from '../entities/Sprite';
import chestImg from '../img/chest.png';
import GameMgr from './GameMgr';
import Random from '../utils/Random';

class Chest extends Sprite {
    constructor( x, y, maxRarityLvl ) {
        super( chestImg, 32, 16, 16, 16, true, x, y );
        this.addAnimation("closed", [0], 0 );
        this.addAnimation("opened", [1], 0 );
        this.playAnimation("closed");
        this.boundsOffsetY = 6;
        this.boundsHeight = 10;
        this.mIsOpen = false;
        this.mContents = GameMgr.getGameByRarity( Random.range( 0, maxRarityLvl ) );
    }

    open() {
        this.playAnimation( "opened" );
        this.mIsOpen = true;
        SoundEngine.play( "chestOpen" );
    }

    get isOpen() { return this.mIsOpen; }
    get contents() { return this.mContents; }
}

export default Chest;