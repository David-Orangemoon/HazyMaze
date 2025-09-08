HazyMaze.genMaze = () => {
    //Clear entities before generation
    HazyMaze.entities = [];

    //Create mazy the maze generator;
    const mazyPosition = new Uint16Array(2);

    mazyPosition[0] = Math.randomIRange(0, HazyMaze.level.width - 1);
    mazyPosition[1] = Math.randomIRange(0, HazyMaze.level.height - 1);

    let paths = HazyMaze.level.getPathsFrom(...mazyPosition);
    let currentPath = [];
    while (paths != 0 || currentPath.length > 0) {
        const possible = [];

        //Recalculate
        if (paths != 0) {
            //Get moves
            if (paths & HazyMaze.NORTH) possible.push([0,1, HazyMaze.NORTH, HazyMaze.SOUTH]);
            if (paths & HazyMaze.SOUTH) possible.push([0,-1, HazyMaze.SOUTH, HazyMaze.NORTH]);
            if (paths & HazyMaze.WEST) possible.push([-1,0, HazyMaze.WEST, HazyMaze.EAST]);
            if (paths & HazyMaze.EAST) possible.push([1,0, HazyMaze.EAST, HazyMaze.WEST]);

            //Move
            const path = Math.randomIRange(0, possible.length - 1);
            HazyMaze.level.setTile(...mazyPosition, HazyMaze.level.getTile(...mazyPosition) ^ possible[path][2]);
            mazyPosition[0] += possible[path][0];
            mazyPosition[1] += possible[path][1];
            HazyMaze.level.setTile(...mazyPosition, HazyMaze.level.getTile(...mazyPosition) ^ possible[path][3]);

            currentPath.push([mazyPosition[0], mazyPosition[1]]);
        }
        //Go back if needed
        else {
            mazyPosition[0] = currentPath[currentPath.length - 1][0];
            mazyPosition[1] = currentPath[currentPath.length - 1][1];
            currentPath.splice(currentPath.length - 1, 1);
        }

        paths = HazyMaze.level.getPathsFrom(...mazyPosition);
    }

    for (let y=0; y<HazyMaze.level.height; y++) {
        for (let x=0; x<HazyMaze.level.width; x++) {
            const tile = HazyMaze.level.getTile(x, y)
            if (Math.randomIRange(0, 100) == 50 && (tile & HazyMaze.NORTH)) HazyMaze.level.setTile(x, y, HazyMaze.level.getTile(x, y) | HazyMaze.NORTH_ALT);
            if (Math.randomIRange(0, 100) == 50 && (tile & HazyMaze.EAST)) HazyMaze.level.setTile(x, y, HazyMaze.level.getTile(x, y) | HazyMaze.EAST_ALT);
            if (Math.randomIRange(0, 100) == 50 && (tile & HazyMaze.SOUTH)) HazyMaze.level.setTile(x, y, HazyMaze.level.getTile(x, y) | HazyMaze.SOUTH_ALT);
            if (Math.randomIRange(0, 100) == 50 && (tile & HazyMaze.WEST)) HazyMaze.level.setTile(x, y, HazyMaze.level.getTile(x, y) | HazyMaze.WEST_ALT);
        }
    }

    return HazyMaze.level.tiles;
};