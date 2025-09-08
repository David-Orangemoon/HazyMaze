HazyMaze.addQuad = (json, x1,y1,z1,u1,v1, x2,y2,z2,u2,v2, x3,y3,z3,u3,v3, x4,y4,z4,u4,v4, nx,ny,nz, cr, cg, cb) => {
    //Floor
    json.a_color.push(
        cr,cg,cb,1,
        cr,cg,cb,1,
        cr,cg,cb,1,
        
        cr,cg,cb,1,
        cr,cg,cb,1,
        cr,cg,cb,1,
    );

    json.a_position.push(
        x1, y1, z1,
        x2, y2, z2,
        x3, y3, z3,

        x2, y2, z2,
        x4, y4, z4,
        x3, y3, z3
    );

    json.a_normal.push(
        nx, ny, nz,
        nx, ny, nz,
        nx, ny, nz,

        nx, ny, nz,
        nx, ny, nz,
        nx, ny, nz
    );

    json.a_texcoord.push(
        u1, v1,
        u2, v2,
        u3, v3,

        u2, v2,
        u4, v4,
        u3, v3
    );

    HazyMaze.meshPoints += 6;
}

HazyMaze.getTileBounds = (tile,imageWidth) => {
    return [
        [tile/imageWidth, 0],
        [(tile + 1)/imageWidth, 0],
        [tile/imageWidth, 1],
        [(tile + 1)/imageWidth, 1]
    ];
};
HazyMaze.tiles = {
    FLOOR: HazyMaze.getTileBounds(0,6),
    CEILING: HazyMaze.getTileBounds(2,6),

    WALL: HazyMaze.getTileBounds(1,6),
    WALL_ALT: HazyMaze.getTileBounds(3,6),
}

HazyMaze.mesh = null;
HazyMaze.meshPoints = 0;
HazyMaze.genMesh = () => {
    let json = {
        a_position: [],
        a_texcoord: [],
        a_color: [],
        a_normal: [],
    };

    HazyMaze.mesh = null;
    HazyMaze.meshPoints = 0;

    for (let y=0; y<HazyMaze.level.height; y++) {
        for (let x=0; x<HazyMaze.level.width; x++) {
            const tile = HazyMaze.level.getTile(x,y);

            //Make sure we aren't an empty version
            if ((tile & HazyMaze.EMPTY)) {
                //Floor
                HazyMaze.addQuad(json,
                    x, -0.5, y, ...HazyMaze.tiles.FLOOR[0],
                    x + 1, -0.5, y, ...HazyMaze.tiles.FLOOR[1],
                    x, -0.5, y + 1, ...HazyMaze.tiles.FLOOR[2],
                    x + 1, -0.5, y + 1, ...HazyMaze.tiles.FLOOR[3],

                    0, 1, 0,
                    1,1,1
                );
                
                //Ceiling
                HazyMaze.addQuad(json,
                    x + 1, 0.5, y, ...HazyMaze.tiles.CEILING[0],
                    x, 0.5, y, ...HazyMaze.tiles.CEILING[1],
                    x + 1, 0.5, y + 1, ...HazyMaze.tiles.CEILING[2],
                    x, 0.5, y + 1, ...HazyMaze.tiles.CEILING[3],

                    0, -1, 0,
                    1,1,1
                );

                //Walls
                let wallTex = (tile & HazyMaze.NORTH_ALT) ? HazyMaze.tiles.WALL_ALT : HazyMaze.tiles.WALL;
                if (tile & HazyMaze.NORTH) {
                    HazyMaze.addQuad(json,
                        x, -0.5, y + 1, ...wallTex[2],
                        x + 1, -0.5, y + 1, ...wallTex[3],
                        x, 0.5, y + 1, ...wallTex[0],
                        x + 1, 0.5, y + 1, ...wallTex[1],

                        0, 0, -1,
                        1,1,1
                    );
                }
                
                wallTex = (tile & HazyMaze.SOUTH_ALT) ? HazyMaze.tiles.WALL_ALT : HazyMaze.tiles.WALL;
                if (tile & HazyMaze.SOUTH) {
                    HazyMaze.addQuad(json,
                        x + 1, -0.5, y, ...wallTex[2],
                        x, -0.5, y, ...wallTex[3],
                        x + 1, 0.5, y, ...wallTex[0],
                        x, 0.5, y, ...wallTex[1],

                        0, 0, 1,
                        1,1,1
                    );
                }

                wallTex = (tile & HazyMaze.WEST_ALT) ? HazyMaze.tiles.WALL_ALT : HazyMaze.tiles.WALL;
                if (tile & HazyMaze.WEST) {
                    HazyMaze.addQuad(json,
                        x, -0.5, y, ...wallTex[2],
                        x, -0.5, y + 1, ...wallTex[3],
                        x, 0.5, y, ...wallTex[0],
                        x, 0.5, y + 1, ...wallTex[1],

                        1, 0, 0,
                        1,1,1
                    );
                }

                wallTex = (tile & HazyMaze.EAST_ALT) ? HazyMaze.tiles.WALL_ALT : HazyMaze.tiles.WALL;
                if (tile & HazyMaze.EAST) {
                    HazyMaze.addQuad(json,
                        x + 1, -0.5, y + 1, ...wallTex[2],
                        x + 1, -0.5, y, ...wallTex[3],
                        x + 1, 0.5, y + 1, ...wallTex[0],
                        x + 1, 0.5, y, ...wallTex[1],

                        -1, 0, 0,
                        1,1,1
                    );
                }
            }
        }
    }

    json.a_color = new Float32Array(json.a_color);
    json.a_position = new Float32Array(json.a_position);
    json.a_texcoord = new Float32Array(json.a_texcoord);
    json.a_normal = new Float32Array(json.a_normal);

    HazyMaze.mesh = HazyMaze.daveShade.buffersFromJSON(json);
}