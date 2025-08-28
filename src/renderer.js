HazyMaze.canvas = document.getElementById("generationDebug");
HazyMaze.daveShade = DaveShade.createInstance(HazyMaze.canvas, { antialias: false });
HazyMaze.daveShade.cullFace(DaveShade.side.BACK);
HazyMaze.daveShade.useZBuffer(true);
HazyMaze.daveShade.renderToCanvas();

//Make the shader
HazyMaze.shader = HazyMaze.daveShade.createShader(
`precision highp float;

attribute vec3 a_position;
attribute vec2 a_texcoord;

varying vec2 v_texcoord;

uniform vec3 u_cameraPos;
uniform vec2 u_cameraRot;

void main() {
    //Set the position
    vec3 r_position = a_position - u_cameraPos;

    //Rotate
    r_position = vec3(
    r_position.z * u_cameraRot.x + r_position.x * u_cameraRot.y,
    r_position.y,
    r_position.z * u_cameraRot.y - r_position.x * u_cameraRot.x
    );

    //position
    gl_Position = vec4(r_position - vec3(0,0,0.5), r_position.z) * 10.0;

    v_texcoord = a_texcoord;
}`,
`precision highp float;

varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
}`);

//Load the image
HazyMaze.textureImage = new Image();
HazyMaze.textureImage.onload = () => {
    HazyMaze.texture = HazyMaze.daveShade.createTexture(HazyMaze.textureImage);
    HazyMaze.texture.setFiltering(DaveShade.filtering.NEAREST, true);

    HazyMaze.shader.setUniforms({
        u_texture: HazyMaze.texture.texture,
    });

    HazyMaze.generate();
}
HazyMaze.textureImage.src = "assets/TILES.png";

setInterval(() => {
    HazyMaze.daveShade.GL.viewport(0, 0, HazyMaze.canvas.width, HazyMaze.canvas.height);
    HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT);

    //Update player
    HazyMaze.currentPlayer.update();

    //Render
    if (HazyMaze.mesh && HazyMaze.shader && HazyMaze.texture) {
        HazyMaze.shader.setBuffers(HazyMaze.mesh);
        HazyMaze.shader.drawFromBuffers(HazyMaze.meshPoints);
    }
}, 16);