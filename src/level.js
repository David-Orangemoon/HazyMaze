//Define directions
HazyMaze.NORTH = 1;
HazyMaze.SOUTH = 2;
HazyMaze.EAST = 4;
HazyMaze.WEST = 8;

HazyMaze.level = {
    //Function that creates a blank level
    createEmpty: (width, height) => {
        HazyMaze.level.width = width;
        HazyMaze.level.height = height;
        HazyMaze.level.tiles = new Uint8Array(width*height);
        for (let i in HazyMaze.level.tiles) { HazyMaze.level.tiles[i] = 255 }
        return HazyMaze.level.tiles;
    },
    //Tile modification
    setTile: (x, y, val) => {
        //Make sure we aren't OOB
        if (x < 0 || x >= HazyMaze.level.width) return 0;
        if (y < 0 || y >= HazyMaze.level.height) return 0;

        HazyMaze.level.tiles[(y * HazyMaze.level.width) + x] = val;
        return HazyMaze.level.getTile(x, y);
    },
    getTile: (x, y) => {
        //Make sure we aren't OOB
        if (x < 0 || x >= HazyMaze.level.width) return 0;
        if (y < 0 || y >= HazyMaze.level.height) return 0;

        return HazyMaze.level.tiles[(y * HazyMaze.level.width) + x];
    },
    getPathsFrom: (x, y) => {
        let returned = 0;

        //Check directions and augment accordingly
        if (HazyMaze.level.getTile(x+1, y) >= 0) {
            if (HazyMaze.level.getTile(x+1, y) & HazyMaze.WEST) returned |= HazyMaze.EAST;
            if (HazyMaze.level.getTile(x-1, y) & HazyMaze.EAST) returned |= HazyMaze.WEST;
            if (HazyMaze.level.getTile(x, y+1) & HazyMaze.SOUTH) returned |= HazyMaze.NORTH;
            if (HazyMaze.level.getTile(x, y-1) & HazyMaze.NORTH) returned |= HazyMaze.SOUTH;
        }

        return returned;
    },
    //Level data
    width:1,
    height:1,
    tiles:new Uint8Array(1)
};

HazyMaze.level.createEmpty(16,16);