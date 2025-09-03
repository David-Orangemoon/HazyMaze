HazyMaze.player = class extends HazyMaze.entity {
    init() {
        this.shape = HazyMaze.meshes.torus;
    }

    update() {
        HazyMaze.shader.setUniforms({
            u_transform: [
                0, 1, this.x, 
                0, 1, 0,
                0, 1, this.y
            ],
        });

        HazyMaze.shader.setBuffers(this.shape);
        HazyMaze.postProcess.drawFromBuffers(6);
    }
};