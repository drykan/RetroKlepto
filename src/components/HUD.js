import Sprite from '../entities/Sprite';

class HUD {
    constructor() {
        this.mPlayerHealth;
        this.mFloor;
    }    

    update( elapsed ) {
        // do nothing
    }

    render( canvasCtx ) {
        this.drawText( canvasCtx );
    }

    drawText( canvasCtx ) {
        canvasCtx.font = "8px Consolas";
        canvasCtx.fillStyle = "#fff";
        canvasCtx.fillText( `Health: ${this.mPlayerHealth}`, 10, 235 );

        canvasCtx.fillText( `Floor: ${this.mFloor}`, 140, 235 );
    }

    // setters
    set floor( value ) { this.mFloor = value; }
    set playerHealth( value ) { this.mPlayerHealth = value; }
}

export default HUD;