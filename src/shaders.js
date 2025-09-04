HazyMaze.initilizeShaders = () => {
    //Make the shader
    HazyMaze.shader = HazyMaze.daveShade.createShader(
        `#version 300 es
        precision highp float;

        in vec3 a_position;
        in vec2 a_texcoord;
        in vec4 a_color;
        in vec3 a_normal;

        out vec2 v_texcoord;
        out vec4 v_color;
        out vec3 v_position;
        out vec3 v_normal;

        uniform vec3 u_cameraPos;
        uniform vec4 u_cameraRot;

        uniform mat3 u_transform;

        void main() {
            //Set the position
            vec3 r_position = a_position;

            //Move to transform
            r_position += vec3(u_transform[0].z, u_transform[1].z, u_transform[2].z);
            //Yaw
            r_position.xz = vec2(
                r_position.z * u_transform[0].x + r_position.x * u_transform[0].y,
                r_position.z * u_transform[0].y - r_position.x * u_transform[0].x
            );
            //Pitch
            r_position.yz = vec2(
                r_position.z * u_transform[1].x + r_position.y * u_transform[1].y,
                r_position.z * u_transform[1].y - r_position.y * u_transform[1].x
            );
            //Roll
            r_position.xy = vec2(
                r_position.y * u_transform[2].x + r_position.x * u_transform[2].y,
                r_position.y * u_transform[2].y - r_position.x * u_transform[2].x
            );

            //For the entrance animation
            if (abs(dot(vec3(0,1,0), a_normal)) != 1.0) { r_position.y = (r_position.y + 0.5) * u_cameraRot.w - 0.5; }

            //We set the position here pre-camera transformation
            v_position = r_position;
            
            //Position around the camera
            r_position -= u_cameraPos;
            r_position.xz = vec2(
                r_position.z * u_cameraRot.x + r_position.x * u_cameraRot.y,
                r_position.z * u_cameraRot.y - r_position.x * u_cameraRot.x
            );
            
            //Debug view
            //r_position = -(r_position).xzy + vec3(0,0,2);
            //r_position.z += r_position.y;

            //position it on screen
            gl_Position = vec4(r_position - vec3(0,0,0.25), r_position.z) * 10.0;
            gl_Position.x *= u_cameraRot.z;

            //Set varyings
            v_texcoord = a_texcoord;
            v_color = a_color;
            v_normal = a_normal;
        }`,
        `#version 300 es
        precision highp float;

        in vec2 v_texcoord;
        in vec4 v_color;
        in vec3 v_position;
        in vec3 v_normal;

        layout(location = 0) out vec4 o_color;
        layout(location = 1) out vec4 o_position;
        layout(location = 2) out vec4 o_normal;

        uniform sampler2D u_texture;
        uniform vec4 u_angleShade;
        
        void main() {
            o_color = texture(u_texture, v_texcoord) * v_color;
            o_color.xyz *= mix(vec3(0.9,0.9,0.9), vec3(u_angleShade.w), min(abs(dot(v_normal, u_angleShade.xyz)) * 2.0, 1.0));
            o_position = vec4(v_position, 1);
            o_normal = vec4(v_normal, 1);
        }`
    );

    HazyMaze.postProcess = HazyMaze.daveShade.createShader(
        `precision highp float;

        attribute vec4 a_position;
        attribute vec2 a_texcoord;

        varying vec2 v_texcoord;

        void main() {
            gl_Position = a_position;
            v_texcoord = a_texcoord;
        }`,
        `precision highp float;

        varying vec2 v_texcoord;
        
        uniform sampler2D u_color;
        uniform sampler2D u_position;
        uniform sampler2D u_normal;
        uniform vec3 u_ambient;

        uniform mat3 u_lights[64];
        uniform float u_lightCount;

        void main() {
            vec3 r_position = texture2D(u_position, v_texcoord).xyz;
            vec3 r_normal = texture2D(u_normal, v_texcoord).xyz;
            vec3 lightTotal = u_ambient;

            //Scrapped idea for "LED LIGHTS"
            //float ceilLightInfluence = max(0.0, (r_position.y - 0.25) * 4.0);
            //if (abs(dot(r_normal, vec3(0,1,0))) == 1.0) { ceilLightInfluence = 0.0; }
            //lightTotal += ceilLightInfluence;

            for (int i=0; i<64; i++) {
                //Break if we pass
                if (i >= int(u_lightCount)) { break; }
                vec3 offset = r_position - u_lights[i][0];

                if (dot(offset, r_normal) > 0.0) { continue; }

                //Calculate light stuff
                float influence = (u_lights[i][2][0] / pow(length(offset), u_lights[i][2][1]));
                if (influence < 0.01) { continue; }

                vec3 color = u_lights[i][1];

                //Add total
                lightTotal += influence * color;
            }

            gl_FragColor = texture2D(u_color, v_texcoord) * vec4(lightTotal,1);
        }`
    );
}