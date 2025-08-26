HazyMaze.generate = () => {
    const mazyPosition = new Uint16Array(2);

    mazyPosition[0] = Math.randomIRange(0, HazyMaze.level.width - 1);
    mazyPosition[1] = Math.randomIRange(0, HazyMaze.level.height - 1);

    HazyMaze.level.setTile(...mazyPosition, HazyMaze.level.getTile(...mazyPosition) ^ HazyMaze.WEST);

    const worm = () => {
        const oldPos = new Uint16Array(mazyPosition);
        console.log(`Generating from ${oldPos}`);

        console.log(HazyMaze.level.getPathsFrom(...mazyPosition));

        //Go back to old position;
        mazyPosition[0] = oldPos[0];
        mazyPosition[1] = oldPos[1];
    }

    worm()

    return HazyMaze.level.tiles;
};