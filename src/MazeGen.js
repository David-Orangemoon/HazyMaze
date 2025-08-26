HazyMaze.generate = () => {
    const mazyPosition = new Uint16Array(2);

    mazyPosition[0] = Math.randomIRange(0, HazyMaze.level.width - 1);
    mazyPosition[1] = Math.randomIRange(0, HazyMaze.level.height - 1);

    const worm = () => {
        const oldPos = new Uint16Array(mazyPosition);
        console.log(`Generating from ${oldPos}`);

        let paths = HazyMaze.level.getPathsFrom(...mazyPosition);
        console.log(paths);
        while (paths != 0) {
            const possible = [];

            if (Math.randomIRange(1, 25) == 5) {
                worm();
                paths = HazyMaze.level.getPathsFrom(...mazyPosition);
            }

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
            }

            paths = HazyMaze.level.getPathsFrom(...mazyPosition);
        }

        //Go back to old position;
        mazyPosition[0] = oldPos[0];
        mazyPosition[1] = oldPos[1];
    }

    worm();

    return HazyMaze.level.tiles;
};