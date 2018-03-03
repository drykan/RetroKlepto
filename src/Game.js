import ActionScene from './scenes/ActionScene';
import SoundEngine from './utils/SoundEngine';
import Camera from './components/Camera';
import Input from './utils/Input';
import Global from './utils/Global';

// data imports
import SoundData from './data/AudioData.json';

class Game {
    constructor( canvas, scale, fps ) {
        this.initialized = false;
        this.gameWidth = canvas.width / scale;
        this.gameHeight = canvas.height / scale;
        this.gameScale = scale;
        this.gameFPS = fps;
        this.timestep = 1000 / fps;
        this.accumulator = 0;
        this.maxAcc = 2000 / fps - 1;
        this.prevTime = this.curTime = 0;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lostFocus = false;
        this.scene = null;
        
        this.loop = this.loop.bind(this);

        this.ctx.scale( scale, scale );

        Global.game = this;
    }

    /**
     * Initialize the game
     */
    init() {
        this.camera = new Camera( 0, 0, this.gameWidth, this.gameHeight );
        Global.camera = this.camera;

        Input.init();
        SoundEngine.init( SoundData );

        this.scene = new ActionScene();       

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
        Input.handleKeyDown(event);
    }

    onKeyUp( event ) {
        Input.handleKeyUp(event);
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

        this.scene.init();

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
        if( this.scene && this.scene.initialized && !this.lostFocus ) {
            this.curTime = window.performance.now();

            this.accumulator += this.curTime - this.prevTime;

            if( this.accumulator > this.maxAcc ) {
                this.accumulator = this.maxAcc;
            }

            while( this.accumulator >= this.timestep ) {
                this.update( this.timestep );
                this.accumulator -= this.timestep;
            }


            this.render();
            this.prevTime = this.curTime;
        }
        requestAnimationFrame( this.loop );
    }

    /**
     * Update the game world
     * @param {Number} elapsed - milliseconds since this method last ran
     */
    update( elapsed ) {
        Input.update();
        this.scene.update( elapsed );
        this.camera.update( elapsed );
    }

    /**
     * Draw to the canvas
     */
    render() {
        const { ctx, width, height, scene } = this;
        ctx.clearRect( 0, 0, width, height );
        scene.render( ctx );
    }

    // Getters
    get width() { return this.gameWidth; }
    get height() { return this.gameHeight; }
    get scale() { return this.gameScale; }
    get FPS() { return this.gameFPS; }
}

export default Game;