class Rectangle {
    constructor( xPos, yPos, width, height ) {
        this.mX = xPos;
        this.mY = yPos;
        this.mWidth = width;
        this.mHeight = height;
    }

    overlaps( otherRect ) {
        let result = false;

        if( this.x < otherRect.right && this.right > otherRect.x &&
            this.y < otherRect.bottom && this.bottom > otherRect.y ) {
                result = true;
            }

        return result;
    }

    get x() { return this.mX; }
    get y() { return this.mY; }
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }
    get left() { return this.mX; }
    get right() { return this.mX + this.mWidth; }
    get top() { return this.mY; }
    get bottom() { return this.mY + this.mHeight; }

    set x(value) { this.mX = value; }
    set y(value) { this.mY = value; }
}

export default Rectangle;