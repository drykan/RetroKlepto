class Game {
    constructor( canvas, scale, fps ) {
        this.initialized = false;
        this.gameWidth = canvas.width;
        this.gameHeight = canvas.height;
        this.gameScale = scale;
        this.gameFPS = fps;
        this.timestep = 1000 / fps;
        this.accumulator = 0;
        this.maxAcc = 2000 / fps - 1;
        this.prevTime = this.curTime = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lostFocus = false;

        this.loop = this.loop.bind(this);
    }

    /**
     * Initialize the game
     */
    init() {
        window.addEventListener( 'click', (event) => {
            this.lostFocus = event.target.id != "game";
        });

        this.canvas.addEventListener( 'click', this.onMouseClick );
        
        // canvas element can't be focused, add key listeners to the window object
        window.addEventListener( 'keydown', this.onKeyDown );
        window.addEventListener( 'keyup', this.onKeyUp );

        this.initialized = true;
    }

    onKeyDown( event ) {
        console.log( event.keyCode );
    }

    onKeyUp( event ) {
        console.log( event.keyCode );
    }

    onMouseClick( event ) {
        console.log( event );
    }

    /**
     * Start the game
     */
    start() {
        if( !this.initialized ) {
            this.init();
        }

        this.prevTime = window.performance.now();

        if( !requestAnimationFrame ) {
            alert("RequestAnimationFrame not available" );
        }
        else {
            requestAnimationFrame( this.loop );
        }
    }

    /**
     * The main game loop, handles timing
     */
    loop() {
        this.curTime = window.performance.now();

        this.accumulator += this.curTime - this.prevTime;

        if( this.accumulator > this.maxAcc ) {
            this.accumulator = this.maxAcc;
        }

        while( this.accumulator >= this.timestep ) {
            this.update( this.timestep );
            this.accumulator -= this.timestep;
        }


        this.prevTime = this.curTime;
        this.render();        
        requestAnimationFrame( this.loop );
    }

    /**
     * Update the game world
     * @param {Number} elapsed - milliseconds since this method last ran
     */
    update( elapsed ) {

    }

    /**
     * Draw to the canvas
     */
    render() {
        this.ctx.clearRect( 0, 0, this.width, this.height );
    }

    // Getters
    get width() { return this.gameWidth; }
    get height() { return this.gameHeight; }
    get scale() { return this.gameScale; }
    get FPS() { return this.gameFPS; }
}

export default Game;