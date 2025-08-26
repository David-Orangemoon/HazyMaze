HazyMaze.generate = () => {
    const mazyPosition = new Int8Array(2);

    mazyPosition[0] = Math.randomIRange(0, HazyMaze.level.width - 1);
    mazyPosition[1] = Math.randomIRange(0, HazyMaze.level.height - 1);

    HazyMaze.level.setTile(...mazyPosition, HazyMaze.level.getTile(...mazyPosition) ^ HazyMaze.WEST);

    return mazyPosition;
};