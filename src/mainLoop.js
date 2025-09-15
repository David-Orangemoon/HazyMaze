HazyMaze.lastTime = Date.now();
HazyMaze.deltaTime = 0.016;
HazyMaze.timescale = 1;

HazyMaze.update = () => {
    
    
    HazyMaze.daveShade.viewport(0, 0, HazyMaze.canvas.width, HazyMaze.canvas.height);

    //Render maze
    if (HazyMaze.mesh && HazyMaze.texture) {
        //Setup render
        HazyMaze.daveShade.cullFace(HazyMaze.daveShade.SIDE.BACK);
        HazyMaze.framebuffer.use();
        HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT | HazyMaze.daveShade.GL.COLOR_BUFFER_BIT);

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
    HazyMaze.daveShade.cullFace(HazyMaze.daveShade.SIDE.NEITHER);
    HazyMaze.postProcess.setUniforms({
        u_lightCount: HazyMaze.lights,
        u_color: HazyMaze.framebuffer.ATTACHMENTS[0].texture,
        u_position: HazyMaze.framebuffer.ATTACHMENTS[1].texture,
        u_normal: HazyMaze.framebuffer.ATTACHMENTS[2].texture,
    });
    HazyMaze.postProcess.setBuffers(HazyMaze.daveShade.TEXTURE_READING_QUAD);
    HazyMaze.postProcess.drawFromBuffers(6);

    requestAnimationFrame(HazyMaze.update);

    HazyMaze.deltaTime = ((Date.now() - HazyMaze.lastTime) / 1000) * HazyMaze.timescale;
    HazyMaze.lastTime = Date.now();
}

HazyMaze.generate();

requestAnimationFrame(HazyMaze.update);