HazyMaze.canvas = document.getElementById("generationDebug");
HazyMaze.daveShade = DaveShade.createInstance(HazyMaze.canvas, { antialias: false, preserveDrawingBuffer: true });
HazyMaze.daveShade.cullFace(DaveShade.side.BACK);
HazyMaze.daveShade.useZBuffer(true);
HazyMaze.daveShade.renderToCanvas();

//Make the shader
HazyMaze.shader = HazyMaze.daveShade.createShader(
`precision highp float;

attribute vec3 a_position;
attribute vec2 a_texcoord;
attribute vec4 a_color;
attribute vec3 a_normal;

varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

uniform vec3 u_cameraPos;
uniform vec3 u_cameraRot;

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
    gl_Position = vec4(r_position - vec3(0,0,0.25), r_position.z) * 10.0;
    gl_Position.x *= u_cameraRot.z;

    //Set varyings
    v_position = a_position;
    v_texcoord = a_texcoord;
    v_color = a_color;
    v_normal = a_normal;
}`,
`precision highp float;

varying vec2 v_texcoord;
varying vec4 v_color;
varying vec3 v_position;
varying vec3 v_normal;

uniform sampler2D u_texture;
uniform vec3 u_ambient;

uniform mat3 u_lights[64];
uniform float u_lightCount;

void main() {
    vec3 lightTotal = u_ambient;

    for (int i=0; i<64; i++) {
        //Break if we pass
        if (i >= int(u_lightCount)) { break; }
        vec3 offset = v_position - u_lights[i][0];

        if (dot(offset, v_normal) > 0.0) { continue; }

        //Calculate light stuff
        float influence = (u_lights[i][2][0] / pow(length(offset), u_lights[i][2][1]));
        if (influence < 0.01) { continue; }

        vec3 color = u_lights[i][1];

        //Add total
        lightTotal += influence * color;
    }

    gl_FragColor = texture2D(u_texture, v_texcoord) * v_color * vec4(lightTotal,1);
}`);

HazyMaze.isNight = Math.randomIRange(0, 0) == 0;

if (HazyMaze.isNight) HazyMaze.shader.setUniforms({u_ambient: [0.1,0.2,0.25]});
else HazyMaze.shader.setUniforms({u_ambient: [1,1,1]});

//Light stuff :)
HazyMaze.lights = 0;
HazyMaze.lightQueue = new Array(64)
HazyMaze.addLightToRender = (light) => {
    if (HazyMaze.lights >= HazyMaze.lightQueue.length) return;
    HazyMaze.lightQueue[HazyMaze.lights] = light;

    //Set uniform
    HazyMaze.shader.uniforms.u_lights[HazyMaze.lights].value = light;

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