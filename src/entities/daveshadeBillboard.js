HazyMaze.billboardObject = class extends HazyMaze.entity {
    init() {
        this.route = [];
    }

    update() {
        const cameraRotation = HazyMaze.shader.uniforms.u_cameraRot.value;

        HazyMaze.shader.setUniforms({
            u_texture: HazyMaze.texture.texture,
            u_uvTransform: [5/6,0, 1/6,1],
            u_transform: [
                -cameraRotation[0], cameraRotation[1], this.x, 
                0, 1, Math.abs(Math.sin(this.interp * Math.PI * 2) * 0.25),
                0, 1, this.y
            ],
            u_angleShade: [
                0.625,-0.25,0.125,1.0
            ]
        });

        HazyMaze.shader.setBuffers(HazyMaze.billboard);
        HazyMaze.shader.drawFromBuffers(6);
    }
};