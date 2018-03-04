import Random from './Random';
import Rectangle from './Rectangle';

const MIN_LEAF_SIZE = 8;

class Leaf {
    constructor(xPos, yPos, width, height) {
        this.mX = xPos;
        this.mY = yPos;
        this.mWidth = width;
        this.mHeight = height;

        this.leftChild = null;
        this.rightChild = null;
        this.room = null;
        this.halls = [];
    }

    split() {
        let { leftChild, rightChild, width, height, x, y } = this;

        // begin splitting the leaf into 2 children
        if( leftChild != null || rightChild != null ) {
            return false; // we already split
        }

        let splitH = Math.random() > 0.5;

        if( width > height && height / width >= 0.05 ) {
            splitH = false;
        }
        else if( height > width && width / height >= 0.05 ) {
            splitH = true;
        }

        let max = ( splitH ? height : width ) - MIN_LEAF_SIZE;
        if( max <= MIN_LEAF_SIZE ) {
            return false; // too small to split any more
        }

        let split = Random.range( MIN_LEAF_SIZE, max );

        if( splitH ) {
            this.leftChild = new Leaf( x, y, width, split );
            this.rightChild = new Leaf( x, y + split, width, height - split );
        }
        else {
            this.leftChild = new Leaf( x, y, split, height );
            this.rightChild = new Leaf( x + split, y, width - split, height );
        }

        return true;
    }

    getRoom() {
        let { room, leftChild, rightChild } = this;

        if( room != null ) 
            return room;
        else {
            let lRoom = null;
            let rRoom = null;

            if( leftChild != null ) {
                lRoom = leftChild.getRoom();
            }

            if( rightChild != null ) {
                rRoom = rightChild.getRoom();
            }

            if( lRoom == null && rRoom == null ) {
                return null;
            }
            else if( rRoom == null ) {
                return lRoom;
            }
            else if( lRoom == null ) {
                return rRoom;
            }
            else if( Math.random() > .5 ) {
                return lRoom;
            }
            else {
                return rRoom;
            }
        }
    }

    createRooms() {
        let { leftChild, rightChild } = this;

        if( leftChild != null || rightChild !=  null ){
            if( leftChild != null ) {
                this.leftChild.createRooms();
            }

            if( rightChild != null ) {
                this.rightChild.createRooms();
            }

            if( leftChild != null && rightChild != null ) {
                this.createHall( this.leftChild.getRoom(), this.rightChild.getRoom() );
            }
        }
        else {
            let roomSize = { x: Random.range( 3, this.width - 2 ), y: Random.range( 3, this.height - 2) };
            let roomPos = { x: Random.range( 1, this.width - roomSize.x - 1 ), y: Random.range( 1, this.height - roomSize.y - 1 ) };
            this.room = new Rectangle( this.x + roomPos.x, this.y + roomPos.y, roomSize.x, roomSize.y );
        }
    }

    createHall( left, right ) {
        const MIN = 3;

        let point1 = { x: Random.range( left.left + 1, left.right - MIN ), y: Random.range( left.top + 1, left.bottom - MIN ) };
        let point2 = { x: Random.range( right.left + 1, right.right - MIN ), y: Random.range( right.top + 1, right.bottom - MIN ) };

        let w = point2.x - point1.x;
        let h = point2.y - point1.y;

        if( w < 0 ) {
            if( h < 0 ) {
                if( Math.random() * 0.5 ) {
                    this.halls.push( new Rectangle( point2.x, point1.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point2.x, point2.y, MIN, Math.abs(h) )  );
                }
                else {
                    this.halls.push( new Rectangle( point2.x, point2.y, Math.abs(w), MIN) );
					this.halls.push( new Rectangle( point1.x, point2.y, MIN, Math.abs(h) ) );
                }
            }
            else if( h > 0 ) {
                if (Math.random() * 0.5) {
                    this.halls.push( new Rectangle( point2.x, point1.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point2.x, point1.y, MIN, Math.abs(h) ) );
                }
                else {
                    this.halls.push( new Rectangle( point2.x, point2.y, Math.abs(w), MIN) );
                    this.halls.push( new Rectangle( point1.x, point1.y, MIN, Math.abs(h) ) );
                }
            }
            else {
                this.halls.push( new Rectangle( point2.x, point2.y, Math.abs(w), MIN ) );
            }
        }
        else if( w > 0 ) {
            if (h < 0) {
                if (Math.random() * 0.5)
                {
                    this.halls.push( new Rectangle( point1.x, point2.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point1.x, point2.y, MIN, Math.abs(h) ) );
                }
                else
                {
                    this.halls.push( new Rectangle( point1.x, point1.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point2.x, point2.y, MIN, Math.abs(h) ) );
                }
            }
            else if (h > 0)
            {
                if (Math.random() * 0.5)
                {
                    this.halls.push( new Rectangle( point1.x, point1.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point2.x, point1.y, MIN, Math.abs(h) ) );
                }
                else
                {
                    this.halls.push( new Rectangle( point1.x, point2.y, Math.abs(w), MIN ) );
                    this.halls.push( new Rectangle( point1.x, point1.y, MIN, Math.abs(h) ) );
                }
            }
            else
            {
                this.halls.push( new Rectangle( point1.x, point1.y, Math.abs(w), MIN ) );
            }
        }
        else {
            if (h < 0) {
                this.halls.push( new Rectangle(point2.x, point2.y, MIN, Math.abs(h) ) );
            }
            else if (h > 0) {
                this.halls.push( new Rectangle(point1.x, point1.y, MIN, Math.abs(h) ) );
            }
        }
    }

    get x() { return this.mX; }
    get y() { return this.mY; }
    get width() { return this.mWidth; }
    get height() { return this.mHeight; }
}

class MapGen {
    constructor( scale ) {
        scale = scale || 8;
        this.canvas = document.createElement( "canvas" );
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale( scale, scale );
        this.rooms = [];
        this.halls = [];
        this.leaves = [];
        this.scale = scale;
    }

    reset() {
        this.rooms.map( (item) => {
            item = null;
        });

        this.halls.map( (item) => {
            item = null;
        });

        this.leaves.map( (item) => {
            item = null;
        });

        this.rooms = [];
        this.halls = [];
        this.leaves = [];
    }

    makeMap( width, height ) {
        this.reset();
        let { rooms, halls, leaves } = this;

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.clearRect( 0, 0, width, height );
        this.ctx.fillStyle = 'black';        
        this.ctx.fillRect( 0, 0, width, height );

        let root = new Leaf( 0, 0, width, height );
        leaves.push( root );

        let didSplit = true;
        let maxCalls = 20;
        let calls = 0;
        while( didSplit ) {
            didSplit = false;
            leaves.forEach( (l) => {
                if( l.leftChild == null && l.rightChild == null ) {
                    if( l.width > 20 || l.height > 20 || Math.random() > 0.25 ) {
                        if( l.split() ) {
                            leaves.push( l.leftChild );
                            leaves.push( l.rightChild );
                            didSplit = true;
                        }
                    }
                }
            });

            calls++;
            if( calls >= maxCalls ) { break; }
        }

        root.createRooms();

        leaves.forEach( (l) => {
            if( l.room != null ) {
                this.drawRoom( l.room );
            }

            if( l.halls != null && l.halls.length > 0 ) {
                this.drawHalls( l.halls );
            }
        } );
    }

    drawHalls( halls ) {
        this.ctx.fillStyle = "white";
        halls.forEach( (rect) => {
            this.ctx.fillRect( rect.x, rect.y, rect.width, rect.height );
            this.halls.push(rect);
        });
    }

    drawRoom( room ) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect( room.x, room.y, room.width, room.height );
        this.rooms.push(room);
    }

    getMapImageData() {        
        return this.canvas.toDataURL('image/jpeg');
    }

    getTileData() {
        let pixelData = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );
        let cols = pixelData.width;
        let rows = pixelData.height;        
        let tileData = [];

        for( let r = 0; r < rows; ++r ) {
            tileData.push( [] );
        }

        let colCount = 0;
        let curRow = 0;
        for( let i = 0; i < pixelData.data.length; i += 4 ) {
            if( pixelData.data[i] === 0 ) {
                tileData[curRow].push( 0 );
            }
            else {
                tileData[curRow].push( 1 );
            }

            ++colCount;
            if( colCount == cols ) {
                ++curRow;
                colCount = 0;
            }
        }

        return tileData;
    }

    getStartRoomAndPos() {
        let result = { room: null, pos: null };

        if( this.rooms && this.rooms.length > 0 ) {
            result.room = this.rooms[ Random.range( 0, this.rooms.length - 1 ) ];
        }

        if( result.room ) {
            result.pos = { x: Random.range( result.room.x, result.room.x + result.room.width - 1 ), y: Random.range( result.room.y, result.room.y + result.room.height - 1 ) };
        }

        return result;
    }
}

export default MapGen;