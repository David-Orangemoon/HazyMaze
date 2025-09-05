HazyMaze.lastTime = Date.now();
HazyMaze.deltaTime = 0.016;

HazyMaze.update = () => {
    HazyMaze.canvas.width = 640;//window.innerWidth;
    HazyMaze.canvas.height = 480;//window.innerHeight;
    HazyMaze.daveShade.GL.viewport(0, 0, HazyMaze.canvas.width, HazyMaze.canvas.height);

    //Render maze
    if (HazyMaze.mesh && HazyMaze.texture) {
        //Setup render
        HazyMaze.daveShade.cullFace(DaveShade.side.BACK);
        HazyMaze.framebuffer.use();
        HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT);

        //Draw objects
        HazyMaze.lights = 0;
        for (let entID in HazyMaze.level.entities) {
            HazyMaze.level.entities[entID].update();
        }

        //Draw maze
        HazyMaze.shader.setUniforms({
            u_texture: HazyMaze.texture.texture,
            u_uvTransform: [0,0, 1,1],
            u_transform: [
                0,1,0,
                0,1,0,
                0,1,0
            ],
            u_angleShade: [
                1,0,0,0.85
            ]
        });

        HazyMaze.shader.setBuffers(HazyMaze.mesh);
        HazyMaze.shader.drawFromBuffers(HazyMaze.meshPoints);
    }

    //Move render to canvas and finalize
    HazyMaze.daveShade.renderToCanvas();
    HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT);
    HazyMaze.daveShade.cullFace(DaveShade.side.NEITHER);
    HazyMaze.postProcess.setUniforms({
        u_lightCount: HazyMaze.lights,
        u_color: HazyMaze.framebuffer.attachments[0].texture,
        u_position: HazyMaze.framebuffer.attachments[1].texture,
        u_normal: HazyMaze.framebuffer.attachments[2].texture,
    });
    HazyMaze.postProcess.setBuffers(HazyMaze.daveShade.textureReadingQuad);
    HazyMaze.postProcess.drawFromBuffers(6);

    requestAnimationFrame(HazyMaze.update);

    HazyMaze.deltaTime = (Date.now() - HazyMaze.lastTime) / 1000;
    HazyMaze.lastTime = Date.now();
}

HazyMaze.generate();

requestAnimationFrame(HazyMaze.update);