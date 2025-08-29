HazyMaze.light = class extends HazyMaze.entity {
    init() {
        this.color = [
            Math.randomRange(0.25, 1.0),
            Math.randomRange(0.25, 1.0),
            Math.randomRange(0.25, 1.0)
        ]
    }
    update() {
        HazyMaze.addLightToRender([
            this.x,0,this.y,
            ...this.color,
            0.25,3,0
        ])
    }
}