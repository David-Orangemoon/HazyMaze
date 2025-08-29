HazyMaze.update = () => {
    HazyMaze.canvas.width = 640;//window.innerWidth;
    HazyMaze.canvas.height = 480;//window.innerHeight;
    HazyMaze.daveShade.GL.viewport(0, 0, HazyMaze.canvas.width, HazyMaze.canvas.height);
    HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT);

    HazyMaze.lights = 0;
    for (let entID in HazyMaze.level.entities) {
        HazyMaze.level.entities[entID].update();
    }

    //Render
    if (HazyMaze.mesh && HazyMaze.shader && HazyMaze.texture) {
        HazyMaze.shader.setUniforms({
            u_lightCount: HazyMaze.lights,
        });

        HazyMaze.shader.setBuffers(HazyMaze.mesh);
        HazyMaze.shader.drawFromBuffers(HazyMaze.meshPoints);
    }

    window.requestAnimationFrame(HazyMaze.update);
}

HazyMaze.generate();

window.requestAnimationFrame(HazyMaze.update);