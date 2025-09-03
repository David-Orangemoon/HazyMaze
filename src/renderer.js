HazyMaze.canvas = document.getElementById("generationDebug");
HazyMaze.daveShade = DaveShade.createInstance(HazyMaze.canvas, { antialias: false, preserveDrawingBuffer: true });
HazyMaze.daveShade.cullFace(DaveShade.side.BACK);
HazyMaze.daveShade.useZBuffer(true);

HazyMaze.framebuffer = HazyMaze.daveShade.createFramebuffer(640, 480, [
    DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA, //Color
    DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT, //Position
    DaveShade.RENDERBUFFER_TYPES.TEXTURE_RGBA_FLOAT, //Normal
    DaveShade.RENDERBUFFER_TYPES.DEPTH, //Depth
]);

HazyMaze.initilizeShaders();

HazyMaze.isNight = Math.randomIRange(0, 4) == 0;

if (HazyMaze.isNight) HazyMaze.postProcess.setUniforms({u_ambient: [0.1,0.2,0.25]});
else HazyMaze.postProcess.setUniforms({u_ambient: [1,1,1]});

//Light stuff :)
HazyMaze.lights = 0;
HazyMaze.lightQueue = new Array(64)
HazyMaze.addLightToRender = (light) => {
    if (HazyMaze.lights >= HazyMaze.lightQueue.length) return;
    HazyMaze.lightQueue[HazyMaze.lights] = light;

    //Set uniform
    HazyMaze.postProcess.uniforms.u_lights[HazyMaze.lights].value = light;

    HazyMaze.lights++;
}

//Load the image
HazyMaze.textureImage = new Image();
HazyMaze.textureImage.onload = () => {
    HazyMaze.texture = HazyMaze.daveShade.createTexture(HazyMaze.textureImage);
    HazyMaze.texture.setFiltering(DaveShade.filtering.NEAREST, true);

    HazyMaze.shader.setUniforms({
        u_texture: HazyMaze.texture.texture,
    });
}

if (location.protocol == "file:") HazyMaze.textureImage.src = HazyMaze.BackupImage;
else HazyMaze.textureImage.src = "assets/TILES.png";