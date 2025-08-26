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
        HazyMaze.level.tiles[(y * HazyMaze.level.width) + x] = val;
        return HazyMaze.level.getTile(x, y);
    },
    getTile: (x, y) => {
        return HazyMaze.level.tiles[(y * HazyMaze.level.width) + x];
    },
    //Level data
    width:1,
    height:1,
    tiles:new Uint8Array(1)
};

HazyMaze.level.createEmpty(16,16);