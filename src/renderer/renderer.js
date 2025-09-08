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
    HazyMaze.texture.setFiltering(DaveShade.filtering.NEAREST, false);

    HazyMaze.shader.setUniforms({
        u_texture: HazyMaze.texture.texture,
    });
}

if (location.protocol == "file:") HazyMaze.textureImage.src = HazyMaze.BackupImage;
else HazyMaze.textureImage.src = "assets/TILES.png";

HazyMaze.whiteImage = new Image();
HazyMaze.whiteImage.onload = () => {
    HazyMaze.white = HazyMaze.daveShade.createTexture(HazyMaze.whiteImage);
    HazyMaze.white.setFiltering(DaveShade.filtering.NEAREST, true);
}
HazyMaze.whiteImage.src = HazyMaze.BackupWhite;

HazyMaze.fitToScreen = true;
HazyMaze.overrideSize = { x: 640, y: 480 };
HazyMaze.stretchToFit = false;
HazyMaze.adjustScreenSize = () => {
    //Resize to fit
    let newSize = [];
    if (HazyMaze.fitToScreen) newSize = [window.innerWidth, window.innerHeight];
    else newSize = [HazyMaze.overrideSize.x, HazyMaze.overrideSize.y];

    //Resize buffers
    HazyMaze.framebuffer.resize(...newSize);
    HazyMaze.canvas.width = newSize[0];
    HazyMaze.canvas.height = newSize[1];

    //Apply CSS
    if (HazyMaze.stretchToFit) HazyMaze.canvas.style.setProperty("--aspectRatio", window.innerWidth/window.innerHeight);
    else HazyMaze.canvas.style.setProperty("--aspectRatio", newSize[0]/newSize[1]);
}

window.addEventListener("resize", () => {
    HazyMaze.adjustScreenSize();
})

HazyMaze.adjustScreenSize();