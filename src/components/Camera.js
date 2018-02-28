class Camera {
    constructor( xOffset, yOffset, width, height ) {
        this.mXOffset = xOffset;
        this.mYOffset = yOffset;
        this.width = width;
        this.height = height;
        this.target = null;
        this.targetHalfWide = 0;
        this.targetHalfHi = 0;
    }

    follow( target ) {
        if( target ) {
            this.target = target;
            this.targetHalfWide = target.fWidth * 0.5;
            this.targetHalfHi = target.fHeight * 0.5;
            this.xOffset = this.target.x - (this.width * 0.5) + this.targetHalfWide;
            this.yOffset = this.target.y - (this.height * 0.5) + this.targetHalfHi;
        }
        else {
            target = null;
        }
    }

    unfollow() {
        this.target = null;
    }

    update() {
        if( this.target ) {
            this.xOffset = this.target.x - (this.width * 0.5) + this.targetHalfWide;
            this.yOffset = this.target.y - (this.height * 0.5) + this.targetHalfHi;
        }
    }

    get xOffset() { return this.mXOffset; }
    get yOffset() { return this.mYOffset; }
    get viewWidth() { return this.width; }
    get viewHeight() { return this.height; }

    set xOffset(value) { this.mXOffset = value; }
    set yOffset(value) { this.mYOffset = value; }
}

export default Camera;