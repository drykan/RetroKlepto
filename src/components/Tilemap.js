import Global from '../utils/Global';
import Rectangle from '../utils/Rectangle';

class Tilemap {
    constructor( tileImg, tileWidth, tileHeight, mapData ) {
        this.mImage = new Image();
        this.mImage.src = tileImg;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapData = mapData;
        this.position = { x: 0, y: 0};

        this.colTiles = [];
        this.colTilesOnScreen = [];
        let curRow = null;
        for( let r = 0; r < mapData.length; ++r ) {
            curRow = mapData[r];
            for( let c = 0, len = curRow.length; c < len; ++c ) {
                if( curRow[c] == 0 ) {
                    this.colTiles.push( new Rectangle( c * tileWidth, r * tileHeight, tileWidth, tileHeight ) );
                }
            }
        }
    }

    update(elapsed) {

    }

    render( canvasCtx ) {
        let { mapData, mImage, tileWidth, tileHeight, x, y } = this;

        let curRow;
        let drawX = 0;
        let drawY = 0;
        for( let r = 0, numRows = mapData.length; r < numRows; ++r ) {
            curRow = mapData[r];
            for( let c = 0, numCols = curRow.length; c < numCols; ++c ) {
                drawX = ( x + (c * tileWidth) - Global.camera.xOffset );
                drawY = ( y + (r * tileHeight) - Global.camera.yOffset );
                canvasCtx.drawImage( mImage, curRow[c] * tileWidth, 0, tileWidth, tileHeight,
                                drawX, drawY, tileWidth, tileHeight );
            }
        }
    }

    collides( sprite ) {
        if( sprite.toString() != "Sprite" ) {
            throw new Error( "Checking collision on invalid type. Type Sprite expected, got " + typeof sprite );
        }

        //this.colTilesOnScreen = this.getCollisionTilesOnScreen();
        let result = false;
        let bounds = sprite.bounds;
        let count = 0;
        let limit = this.colTiles.length;
        while( count < limit ) {
            if( bounds.overlaps( this.colTiles[count] ) ) {
                result = true;
                count = limit;
            }
            ++count;
        }

        return result;
    }

    getCollisionTilesOnScreen() {
        return this.colTiles.filter( (item) => {
            return item.overlaps( Global.camera.bounds );
        });
    }

    destroy() {
        this.mImage = null;
        this.tileWidth = null;
        this.tileHeight = null;
        this.mapData = null;
        this.position = null;

        this.colTiles = null;
        this.colTilesOnScreen = null;
    }

    // Getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }

    // Setters
    set x( value ) { this.position.x = value; }    
    set y( value ) { this.position.y = value; }
}

export default Tilemap;