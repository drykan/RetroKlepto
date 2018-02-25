class Rectangle {
    constructor( xPos, yPos, width, height ) {
        this.mX = xPos;
        this.mY = yPos;
        this.mWidth = width;
        this.mHeight = height;
        this.mLeft = xPos;
        this.mTop = yPos;
        this.mRight = xPos + width;
        this.mBottom = yPos + height;
    }

    get x() { return this.mX; }
    get y() { return this.mY; }
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }
    get left() { return this.mLeft; }
    get right() { return this.mRight; }
    get top() { return this.mTop; }
    get bottom() { return this.mBottom; }
}

export default Rectangle;