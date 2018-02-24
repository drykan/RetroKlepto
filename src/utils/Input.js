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

    init: function() {
        for( let i = 0; i < 256; ++i ) {
            this.keys[i] = { cur: this.UP, last: this.UP };
        }
    },

    update: function() {
        this.keys.map( (key) => {
            if( key.last == this.JUST_PRESSED && key.cur == this.JUST_PRESSED ) {
                key.cur = this.DOWN;
            }
            else if( key.last == this.JUST_RELEASED && key.cur == this.JUST_RELEASED ) {
                key.cur = this.UP;
            }

            key.last = key.cur;
        })
    },

    handleKeyDown: function( event ) {
        var keyObj = this.keys[event.keyCode];
        if( keyObj.cur == this.UP ) {
            keyObj.cur = this.JUST_PRESSED;
        }
        else {
            keyObj.cur = this.DOWN;
        }
    },

    handleKeyUp: function( event ) {
        var keyObj = this.keys[event.keyCode];
        if( keyObj.cur > this.UP ) {
            keyObj.cur = this.JUST_RELEASED;
        }
        else {
            keyObj.cur = this.UP;
        }
    },

    isKeyDown: function( key ) {
        let checkKey = this.keys[ this[key] ];
        return ( checkKey.cur == this.DOWN || checkKey.cur == this.JUST_PRESSED );
    },

    justPressed: function( key ) {
        return (this.keys[ this[key] ].cur == this.JUST_PRESSED);
    },

    justReleased: function( key ) {
        return (this.keys[ this[key] ].cur == this.JUST_RELEASED);
    },

    getKeyCode: function( key ) {
        return this[key];
    },

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

    reset: function() {
        this.init();
    }
}