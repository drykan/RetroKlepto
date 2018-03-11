import lootBg from '../img/lootBg.png';

class LootDisplay {
    constructor() {
        this.mGame = null;
        this.img = new Image();
        this.starImg = new Image();
        this.bgImg = new Image();
        this.bgImg.src = lootBg;
        this.isGameOverDisplay = false;
        this.Game = { img: "./img/games/none.png", title: "", platform: "", release: "", rarity: 0 };
    }

    update( elapsed ) {}

    render( canvasCtx ) {
        const {bgImg, starImg, img, Game} = this;
        const textX = 145;        
        canvasCtx.drawImage( bgImg, 4, 4, bgImg.width * 0.48, bgImg.height * 0.27 );

        canvasCtx.drawImage( img, 10, 8, img.width * 0.5, img.height * 0.5 );
        if( Game.rarity > 0 ) {
            canvasCtx.fillText( `Title: ${Game.title}`, textX, 16 );
            canvasCtx.fillText( `Platform: ${Game.platform}`, textX, 32 );
            canvasCtx.fillText( `Release Date: ${Game.release}`, textX, 48 );
            canvasCtx.fillText( 'Rarity: ', textX, 64 );        
            canvasCtx.drawImage( starImg, 178, 58, starImg.width * 0.5, starImg.height * 0.5 );
        }

        if( this.isGameOverDisplay != true ) {
            canvasCtx.fillText( 'Press Space to Close', 120, 120 );
        }
        else {
            canvasCtx.fillText( 'Game Over (F5 to Reset)', 120, 120 );
            if( this.mGame.rarity > 0 ) {
                canvasCtx.fillText( 'Use the Left and Right arrows', textX, 90  );
                canvasCtx.fillText( 'to view your collection', textX, 102 );
            }
        }
    }

    destroy() {
        this.mGame = null;
        this.img = null;
        this.bgImg = null;
        this.starImg = null;
    }

    set Game( gameObj ) { 
        this.mGame = gameObj; 
        this.img.src = gameObj.img;
        this.starImg.src = `./img/star${gameObj.rarity}.png`;
    }

    get Game() { return this.mGame; }
}

export default LootDisplay;