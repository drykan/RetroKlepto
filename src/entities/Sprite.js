import Global from '../utils/Global';

class Sprite {
    constructor( spriteImg, width, height, frameWidth, frameHeight, isAnimated, xPos, yPos ) {
        this.mImage = new Image();
        this.mImage.src = spriteImg;
        this.animations = {};
        this.currentAnimationName = "";
        this.isAnimated = isAnimated;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.mStaticPosition = false;
        this.position = {
            x: (xPos || 0),
            y: (yPos || 0)
        };
    }

    addAnimation( name, frames, speed ) {
        this.animations[name] = {
            name,
            speed,
            frames: frames,
            currentFrame: 0,
            time: 0
        };
    }

    playAnimation( name ) {
        this.currentAnimationName = name;
    }

    update( elapsed ) {
        if( this.isAnimated == true && this.currentAnimationName != "" ) {
            let curAnim = this.animations[ this.currentAnimationName ];

            if( curAnim.speed > 0 ) {
                curAnim.time += elapsed;
                if( curAnim.time >= curAnim.speed ) {
                    if( curAnim.currentFrame + 1 < curAnim.frames.length ) {
                        ++curAnim.currentFrame;
                    }
                    else {
                        curAnim.currentFrame = 0;
                    }
                    curAnim.time = 0;
                }
            }
        }
    }

    render( canvasCtx ) {
        if( this.staticPosition != true ) {
            if( this.currentAnimationName != "" ) {
                let curAnim = this.animations[ this.currentAnimationName ];
                canvasCtx.drawImage( this.image, curAnim.frames[curAnim.currentFrame] * this.fWidth, 0, this.frameWidth, this.frameHeight, 
                                this.x - Global.camera.xOffset, this.y - Global.camera.yOffset, this.fWidth, this.fHeight );
            }
            else {
                canvasCtx.drawImage( this.image, this.x - Global.camera.xOffset, this.y - Global.camera.yOffset, this.fWidth, this.fHeight );
            }
        }
        else {
            canvasCtx.drawImage( this.image, this.x, this.y, this.fWidth, this.fHeight );
        }
    }

    // Getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    get image() { return this.mImage; }
    get fWidth() { return this.frameWidth; }
    get fHeight() { return this.frameHeight; }
    get staticPosition() { return this.mStaticPosition; }

    // Setters
    set x( value ) { this.position.x = value; }
    set y( value ) { this.position.y = value; }
    set centered( value ) { this.mCentered = value; }
    set staticPosition( value ) { this.mStaticPosition = value; }
}

export default Sprite;