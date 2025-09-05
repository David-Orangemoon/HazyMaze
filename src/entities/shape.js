HazyMaze.floatingShape = class extends HazyMaze.entity {
    init() {
        const keys = Object.keys(HazyMaze.meshes);
        this.shape = HazyMaze.meshes[keys[Math.randomIRange(0, keys.length - 1)]];

        this.timer = this.x + this.y * HazyMaze.level.width;

        this.yaw = [0, 1];
        this.pitch = [0, 1];
        this.roll = [0, 1];
    }

    update() {
        HazyMaze.shader.setUniforms({
            u_texture: HazyMaze.white.texture,
            u_transform: [
                ...this.yaw, this.x, 
                ...this.pitch, 0,
                ...this.roll, this.y
            ],
            u_angleShade: [
                0.625,-0.25,0.125,0.5
            ]
        });

        HazyMaze.shader.setBuffers(this.shape.mesh);
        HazyMaze.shader.drawFromBuffers(this.shape.pointCount);

        this.timer += HazyMaze.deltaTime;

        this.yaw = [Math.sin(this.timer), Math.cos(this.timer)];
        this.pitch = [Math.sin(this.timer * 2), Math.cos(this.timer * 2)];
    }
};