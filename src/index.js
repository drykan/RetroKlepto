import styles from './css/style.css';

import Game from './Game';


let gameCanvas = document.createElement('canvas');
gameCanvas.id = "game";
gameCanvas.width = 640;
gameCanvas.height = 480;

document.body.appendChild( gameCanvas );

let G = new Game(gameCanvas, 2, 60 );
G.start();