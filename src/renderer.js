HazyMaze.canvas = document.getElementById("generationDebug");
HazyMaze.daveShade = DaveShade.createInstance(HazyMaze.canvas, {});
HazyMaze.daveShade.cullFace(DaveShade.side.NEITHER);
HazyMaze.daveShade.useZBuffer(true);

HazyMaze.shader = HazyMaze.daveShade.createShader(
`precision highp float;

attribute vec4 a_position;

uniform vec3 u_cameraPos;

void main() {
    //vec3 r_position = a_position - u_cameraPos;
    gl_Position = a_position;
}`,
`precision highp float;

void main() {
    gl_FragColor = vec4(0,0,0,1);
}`);

setInterval(() => {
    HazyMaze.daveShade.GL.viewport(0, 0, HazyMaze.canvas.width, HazyMaze.canvas.height);
    if (HazyMaze.mesh && HazyMaze.shader) {
        HazyMaze.daveShade.clear(HazyMaze.daveShade.GL.DEPTH_BUFFER_BIT);
        HazyMaze.shader.setBuffers(HazyMaze.mesh);
        HazyMaze.shader.drawFromBuffers(HazyMaze.meshPoints);
    }
}, 16);