HazyMaze.entity = class {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.init();
    }

    goto(x, y) {
        this.x = x;
        this.y = y;
        this.taken = {};
        this.moveAlong = false;
    }

    getTileAt(x, y) {
        return HazyMaze.level.getTile(Math.floor(x), Math.floor(y));
    }

    getTileID(x, y) {
        return (Math.floor(y) * HazyMaze.level.width) + Math.floor(x);
    }

    getInTileOffset(x, y) {
        return [
            Math.floor((x % 1) * 50) / 50,
            Math.floor((y % 1) * 50) / 50,
        ]
    }

    init() {}
    update() {}
    draw() {}
}