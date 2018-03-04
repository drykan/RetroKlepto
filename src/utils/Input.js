export default {
    // helpers
    UP: 0,
    DOWN: 1,
    JUST_PRESSED: 2,
    JUST_RELEASED: 3,

    // alphabet keys
    A:65, B:66, C:67, D:68, E:69, F:70, G:71, H:72, I:73, J:74, K:75, L:76, M:77,
    N:78, O:79, P:80, Q:81, R:82, S:83, T:84, U:85, V:86, W:87, X:88, Y:89, Z:90,

    // arrows
    LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40,

    // miscellanious keys
    BACKSPACE:8, TAB:9, ENTER:13, SHIFT:16, CONTROL:17, ALT:18, 
    CAPSLOCK:20, ESCAPE:27, SPACE:32, PAGEUP:33, PAGEDOWN:34, 
    END:35, HOME:36, INSERT:45, DELETE:46, SEMICOLON:186, 
    COMMA:188, PERIOD:190, SLASH:191, GRAVE:192, LEFTBRACKET:219, 
    BACKSLASH:220, RIGHTBRACKET:221, QUOTE:222, 

    keys: [],

    // mouse buttons
    LEFT_MOUSE: 0,
    MIDDLE_MOUSE: 1,
    RIGHT_MOUSE: 2,
    mouse: [],
    mouseClick: { x: -1, y: -1 },

    locked: false,

    /**
     * Initialize the keys
     */
    init: function() {
        for( let i = 0; i < 256; ++i ) {
            this.keys[i] = { cur: this.UP, last: this.UP };
        }

        for( let j = 0; j < 3; ++j ) {
            this.mouse[j] = { cur: this.UP, last: this.UP };
        }
    },

    /**
     * Locks input and resets all the keys/buttons
     */
    lock() {
        this.locked = true;
        this.init();
    },

    /**
     * Unlocks input
     */
    unlock() {
        this.locked = false;
    },

    /**
     * Update the keys and mouse
     */
    update: function() {
        if( this.locked == true ) { return }
        this.keys.map( (key) => {
            if( key.last == this.JUST_PRESSED && key.cur == this.JUST_PRESSED ) {
                key.cur = this.DOWN;
            }
            else if( key.last == this.JUST_RELEASED && key.cur == this.JUST_RELEASED ) {
                key.cur = this.UP;
            }

            key.last = key.cur;
        });

        this.mouse.map( (btn) => {
            if( btn.last == this.JUST_PRESSED && btn.cur == this.JUST_PRESSED ) {
                btn.cur = this.DOWN;
            }
            else if( btn.last == this.JUST_RELEASED && btn.cur == this.JUST_RELEASED ) {
                btn.cur = this.UP;
            }

            btn.last = btn.cur;
        });
    },

    /**
     * Don't do anything, we use mouse down/up
     */
    handleMouseClick( event ) {

    },

    /**
     * Handle mouse down events
     */
    handleMouseDown( event ) {
        if( this.locked == true ) { return }
        let btn = this.mouse[event.button];
        this.mouseClick.x = event.offsetX * 0.5; // cut in half because our game is scaled by 2
        this.mouseClick.y = event.offsetY * 0.5;
        if( btn.cur == this.UP ){
            btn.cur = this.JUST_PRESSED;
        }
        else {
            btn.cur = this.DOWN;
        }
    },

    /**
     * Handle mouse up events
     */
    handleMouseUp( event ) {
        if( this.locked == true ) { return }
        let btn = this.mouse[ event.button ];
        if( btn.cur > this.UP ) {
            btn.cur = this.JUST_RELEASED;
        }
        else {
            btn.cur = this.UP;
        }
    },

    /**
     * Handle key down events
     */
    handleKeyDown: function( event ) {
        if( this.locked == true ) { return }
        var keyObj = this.keys[event.keyCode];
        if( keyObj.cur == this.UP ) {
            keyObj.cur = this.JUST_PRESSED;
        }
        else {
            keyObj.cur = this.DOWN;
        }
    },

    /**
     * Handle key up events
     */
    handleKeyUp: function( event ) {
        if( this.locked == true ) { return }
        var keyObj = this.keys[event.keyCode];
        if( keyObj.cur > this.UP ) {
            keyObj.cur = this.JUST_RELEASED;
        }
        else {
            keyObj.cur = this.UP;
        }
    },

    /**
     * @param {string} key - The key to check
     * @returns True if the key is pressed down, false otherwise
     */
    isKeyDown: function( key ) {
        let checkKey = this.keys[ this[key] ];
        return ( checkKey.cur == this.DOWN || checkKey.cur == this.JUST_PRESSED );
    },

    /**
     * @param {string} key - The key to check
     * @returns True if the key is was JUST pressed down, false otherwise
     */
    justPressed: function( key ) {
        return (this.keys[ this[key] ].cur == this.JUST_PRESSED);
    },

    /**
     * @param {string} key - The key to check
     * @returns True if the key was JUST released, false otherwise
     */
    justReleased: function( key ) {
        return (this.keys[ this[key] ].cur == this.JUST_RELEASED);
    },

    mouseJustReleased: function( btn ) {
        return (this.mouse[ this[btn] ].cur == this.JUST_RELEASED );
    },

    mouseJustPressed: function( btn ) {
        return (this.mouse[ this[btn] ].cur == this.JUST_PRESSED );
    },

    /**
     * Get the key code for the passed in key
     */
    getKeyCode: function( key ) {
        return this[key];
    },

    /**
     * @returns {Boolean} True if any key is pressed
     */
    any: function() {
        var result = false;
        var i = -1;
        while( ++i < 256 ) {
            if( this.keys[i].cur != this.UP ) {
                result = true;
                i = 999;
            }
        }
        return result;
    },

    /**
     * Reset the keys to their initial states
     */
    reset: function() {
        this.init();
    }
}