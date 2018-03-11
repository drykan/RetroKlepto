import styles from './css/style.css';

import Game from './Game';

// add a handy distance function to the Math object
Math.distance = function( obj1, obj2 ) {
    return Math.sqrt( Math.pow((obj2.x - obj1.x), 2) + Math.pow((obj2.y - obj1.y), 2 ) );
}

let gameCanvas = document.createElement('canvas');
gameCanvas.id = "game";
gameCanvas.width = 640;
gameCanvas.height = 480;

document.body.appendChild( gameCanvas );

let G = new Game(gameCanvas, 2, 60 );
G.start();