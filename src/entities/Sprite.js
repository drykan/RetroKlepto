class Sprite {
    constructor( spriteImg, width, height, frameWidth, frameHeight, isAnimated, xPos, yPos ) {
        this.mImage = new Image();
        this.mImage.src = spriteImg;
        this.animations = {};
        this.currentAnimationName = "";
        this.isAnimated = isAnimated;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.position = {
            x: xPos || 0, 
            y: yPos || 0
        };
    }

    addAnimation( name, startFrame, numFrames, speed ) {
        this.animations[name] = {
            name,
            speed,
            startFrame,
            numFrames,
            endFrame: startFrame + numFrames,
            frameWidth,
            frameHeight,
            currentFrame: startFrame,
            time: 0
        };
    }

    playAnimation( name ) {
        this.currentAnimationName = name;
    }

    update( elapsed ) {
        if( this.isAnimated == true && this.currentAnimationName != "" ) {
            let curAnim = this.animations[ this.currentAnimationName ];

            curAnim.time += elapsed;
            if( curAnim.time >= curAnim.speed ) {
                if( curAnim.currentFrame + 1 < curAnim.endFrame ) {
                    ++curAnim.currentFrame;
                }
            }
        }
    }

    // Getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    get image() { return this.mImage; }
    get fWidth() { return this.frameWidth; }
    get fHeight() { return this.frameHeight; }

    // Setters
    set x( value ) { this.position.x = value; }    
    set y( value ) { this.position.y = value; }
}

export default Sprite;