import Global from '../utils/Global';

class Tilemap {
    constructor( tileImg, tileWidth, tileHeight, mapData ) {
        this.mImage = new Image();
        this.mImage.src = tileImg;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.mapData = mapData;
        this.position = { x: 0, y: 0};
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

    // Getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }

    // Setters
    set x( value ) { this.position.x = value; }    
    set y( value ) { this.position.y = value; }
}

export default Tilemap;