HazyMaze.floatingShape = class extends HazyMaze.entity {
    init() {
        const keys = Object.keys(HazyMaze.meshes);
        this.shape = HazyMaze.meshes[keys[Math.randomIRange(0, keys.length - 1)]];
    }

    update() {
        HazyMaze.shader.setUniforms({
            u_texture: HazyMaze.white.texture,
            u_transform: [
                0, 1, this.x, 
                0, 1, 0,
                0, 1, this.y
            ],
            u_angleShade: [
                0.625,-0.25,0.125,0.5
            ]
        });

        HazyMaze.shader.setBuffers(this.shape.mesh);
        HazyMaze.shader.drawFromBuffers(this.shape.pointCount);
    }
};