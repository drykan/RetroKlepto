import Global from '../utils/Global';
import Rectangle from '../utils/Rectangle';

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
        this.mVelocity = { x: 0, y: 0 };
        this.mMaxVelocity = { x: 100, y: 100};
        this.mAlpha = 1;
        this.position = {
            x: (xPos || 0),
            y: (yPos || 0)
        };
        this.lastPosition = { x: this.position.x, y: this.position.y };
        this.screenPosition = { x: this.position.x - Global.camera.xOffset, y: this.position.y - Global.camera.yOffset };
        this.mBounds = new Rectangle( this.x, this.y, this.fWidth, this.fHeight );
        this.mBoundsOffsetX = 0;
        this.mBoundsOffsetY = 0;
        this.fadeTimer = 0;
        this.fadeTarget = -1;
        this.fadeCallback = null;
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

        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        this.x += this.xVelocity * elapsed;
        this.y += this.yVelocity * elapsed;
        this.mBounds.x = this.x + this.mBoundsOffsetX;
        this.mBounds.y = this.y + this.mBoundsOffsetY;
        this.screenPosition.x = this.x - Global.camera.xOffset;
        this.screenPosition.y = this.y - Global.camera.yOffset;

        if( this.fadeTimer < this.fadeTarget ) {
            this.fadeTimer += elapsed;
            let percent = this.fadeTimer / this.fadeTarget;
            if( percent < 1 ) {
                this.alpha = 1 - percent;
            }
            else {
                this.fadeTarget = -1;
                this.fadeTimer = 0;
                this.alpha = 0;
                if( this.fadeCallback != null ) {
                    this.fadeCallback();
                }
            }
        }
    }

    render( canvasCtx ) {
        if( this.alpha < 1 ) {
            canvasCtx.globalAlpha = this.alpha;
        }

        if( this.staticPosition != true ) {
            if( this.currentAnimationName != "" ) {
                let curAnim = this.animations[ this.currentAnimationName ];
                canvasCtx.drawImage( this.image, curAnim.frames[curAnim.currentFrame] * this.fWidth, 0, this.frameWidth, this.frameHeight, 
                                this.screenPosition.x, this.screenPosition.y, this.fWidth, this.fHeight );
            }
            else {
                canvasCtx.drawImage( this.image, this.screenPosition.x, this.screenPosition.y, this.fWidth, this.fHeight );
            }
        }
        else {
            if( this.currentAnimationName != "" ) {
                let curAnim = this.animations[ this.currentAnimationName ];
                canvasCtx.drawImage( this.image, curAnim.frames[curAnim.currentFrame] * this.fWidth, 0, this.frameWidth, this.frameHeight, 
                                this.x, this.y, this.fWidth, this.fHeight );
            }
            else {
                canvasCtx.drawImage( this.image, this.x, this.y, this.fWidth, this.fHeight );
            }
        }

        canvasCtx.globalAlpha = 1;
    }

    fade( timeInSeconds, force, callback ) {
        if( force == true || ( this.fadeTarget == -1 && this.alpha > 0 ) ) {
            this.fadeTimer = 0;
            this.fadeTarget = timeInSeconds * 1000;
            this.fadeCallback = callback;
        }
    }

    isOnScreen() {
        let result = false;
        if( this.x + this.fWidth > Global.camera.xOffset && this.x < (Global.camera.xOffset + Global.camera.viewWidth) ) {
            if( this.y + this.fHeight > Global.camera.yOffset && this.y < (Global.camera.yOffset + Global.camera.viewHeight ) ) {
                result = true;
            }
        }

        return result;
    }

    getScreenPos() {
        return this.screenPosition;
    }

    toString() {
        return "Sprite";
    }

    // Getters
    get x() { return this.position.x; }
    get y() { return this.position.y; }
    get lastX() { return this.lastPosition.x; }
    get lastY() { return this.lastPosition.y; }
    get image() { return this.mImage; }
    get fWidth() { return this.frameWidth; }
    get fHeight() { return this.frameHeight; }
    get staticPosition() { return this.mStaticPosition; }
    get xVelocity() { return this.mVelocity.x; }
    get yVelocity() { return this.mVelocity.y; }
    get maxVelocityX() { return this.mMaxVelocity.x; }
    get maxVelocityY() { return this.mMaxVelocity.y; }
    get bounds() { return this.mBounds; }
    get alpha() { return this.mAlpha; }
    
    // Setters
    set x( value ) { this.position.x = value; }
    set y( value ) { this.position.y = value; }
    set centered( value ) { this.mCentered = value; }
    set staticPosition( value ) { this.mStaticPosition = value; }
    set xVelocity( value ) { 
        if( value < this.maxVelocityX )
            this.mVelocity.x = value;
    }
    set yVelocity( value ) { 
        if( value < this.maxVelocityY )
            this.mVelocity.y = value; 
    }
    set maxVelocityX( value ) { this.mMaxVelocity.x = value; }
    set maxVelocityY( value ) { this.mMaxVelocity.y = value; }
    set boundsOffsetX( value ) { this.mBoundsOffsetX = value; }
    set boundsOffsetY( value ) { this.mBoundsOffsetY = value; }
    set boundsWidth( value ) { this.bounds.width = value; }
    set boundsHeight( value ) { this.bounds.height = value; }
    set alpha( value ) { this.mAlpha = value; }
}

export default Sprite;