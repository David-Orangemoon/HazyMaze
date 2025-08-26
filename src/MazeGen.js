(function() {
    HazyMaze.level = {
        createEmpty: (width, height) => { HazyMaze.level.tiles = Int8Array(width*height) },
        tiles:Int8Array(1)
    };

    createEmpty(16,16);
})();