import Global from '../utils/Global';
import Rectangle from '../utils/Rectangle';

class Sprite {
    constructor( spriteImg, width, height, frameWidth, frameHeight, isAnimated, xPos, yPos, hp ) {
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
        this.fadeEffect = { timer: 0, timeTarget: -1, toValue: 0, fromValue: 0, difference: 0, callback: null };
        this.fadeCallback = null;
        this.mMaxHitPoints = hp || 3; // default to 3
        this.mHitPoints = hp || 3; 
        this.mAlive = true;
    }

    addAnimation( name, frames, speed, loop, endCallback ) {
        if( loop == undefined ) {
            loop = true;
        }
        this.animations[name] = {
            name,
            speed,
            frames: frames,
            currentFrame: 0,
            time: 0,
            loop: loop,
            onComplete: endCallback
        };
    }

    playAnimation( name ) {
        this.currentAnimationName = name;
    }

    updateAnimation( elapsed ) {
        if( this.isAnimated == true && this.currentAnimationName != "" ) {
            let curAnim = this.animations[ this.currentAnimationName ];

            if( curAnim.speed > 0 ) {
                curAnim.time += elapsed;
                if( curAnim.time >= curAnim.speed ) {
                    if( curAnim.currentFrame + 1 < curAnim.frames.length ) {
                        ++curAnim.currentFrame;
                    }
                    else {
                        if( curAnim.loop == true ) {
                            curAnim.currentFrame = 0;
                        }
                        else {
                            if( curAnim.onComplete != null ) {
                                curAnim.onComplete();
                            }
                        }
                    }

                    curAnim.time = 0;
                }
            }
        }
    }

    updateFader( elapsed ) {
        if( this.fadeEffect.timer < this.fadeEffect.timeTarget ) {
            this.fadeEffect.timer += elapsed;
            let percent = this.fadeEffect.timer / this.fadeEffect.timeTarget;
            if( percent < 1 ) {
                if( this.fadeEffect.toValue < this.fadeEffect.fromValue ) {
                    this.alpha = this.fadeEffect.fromValue - ( percent * this.fadeEffect.difference );
                }
                else {
                    this.alpha = this.fadeEffect.fromValue + ( percent * this.fadeEffect.difference );
                }
            }
            else {
                this.fadeEffect.timeTarget = -1;
                this.fadeEffect.timer = 0;
                this.alpha = this.fadeEffect.toValue;
                if( this.fadeEffect.callback != null ) {
                    this.fadeEffect.callback();
                }
            }
        }
    }

    updatePosition( elapsed ) {
        this.lastPosition.x = this.x;
        this.lastPosition.y = this.y;
        this.x += this.xVelocity * elapsed;
        this.y += this.yVelocity * elapsed;
        this.mBounds.x = this.x + this.mBoundsOffsetX;
        this.mBounds.y = this.y + this.mBoundsOffsetY;
        this.screenPosition.x = this.x - Global.camera.xOffset;
        this.screenPosition.y = this.y - Global.camera.yOffset;
    }

    update( elapsed ) {
        if( this.mAlive == true ) {
            this.updateAnimation( elapsed );        
            this.updatePosition( elapsed );
            this.updateFader( elapsed );
        }
    }

    render( canvasCtx ) {
        if( this.mAlive == true ) {
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
    }

    fade( timeInSeconds, toValue, fromValue, force, callback ) {
        if( force == true || this.fadeEffect.timeTarget == -1 ) {
            this.fadeEffect.timer = 0;
            this.fadeEffect.timeTarget = timeInSeconds * 1000;
            this.fadeEffect.toValue = toValue;
            this.fadeEffect.fromValue = fromValue || this.alpha;
            this.fadeEffect.difference = Math.abs(toValue - fromValue);
            this.fadeEffect.callback = callback;
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

    isUnderPoint( pt ) {
        let result = false;
        if( this.isOnScreen() ) {
            if( this.screenPosition.x < pt.x && this.screenPosition.x + this.fWidth > pt.x ) {
                if( this.screenPosition.y < pt.y && this.screenPosition.y + this.fHeight > pt.y ) {
                    result = true;
                }
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

    damage( value ) {
        this.mHitPoints -= value;
        if( this.mHitPoints <= 0 ){
            this.mHitPoints = 0;
            this.mAlive = false;
        }
    }

    revive() {
        this.mHitPoints = this.mMaxHitPoints;
        this.mAlive = true;
    }

    kill() {
        this.mHitPoints = 0;
        this.mAlive = false;
    }

    destroy() {
        this.mImage = null;
        this.animations = null;
        this.currentAnimationName = null;
        this.isAnimated = null;
        this.frameWidth = null;
        this.frameHeight = null;
        this.mStaticPosition = null;
        this.mVelocity = null;
        this.mMaxVelocity = null;
        this.mAlpha = null;
        this.position = null;
        this.lastPosition = null;
        this.screenPosition = null;
        this.mBounds = null;
        this.mBoundsOffsetX = null;
        this.mBoundsOffsetY = null;
        this.fadeTimer = null;
        this.fadeTarget = null;
        this.fadeEffect = null;
        this.fadeCallback = null;
        this.mMaxHitPoints = null;
        this.mHitPoints = null; 
        this.mAlive = null;
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
    get hp() { return this.mHitPoints; }
    get isAlive() { return this.mAlive; }
    get midPoint() { 
        return {
            x: this.x + this.fWidth * 0.5,
            y: this.y + this.fHeight * 0.5
        };
    }
    
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