(function() {
    HazyMaze.mesh = null;
    HazyMaze.meshPoints = 0;
    HazyMaze.genMesh = () => {
        let json = {
            a_position: [],
            a_texcoord: [],
        };

        HazyMaze.mesh = null;
        HazyMaze.meshPoints = 0;

        for (let y=0; y<HazyMaze.level.height; y++) {
            for (let x=0; x<HazyMaze.level.width; x++) {
                const tile = HazyMaze.level.getTile(x,y);

                //Make sure we aren't an empty version
                if (tile != 255) {
                    json.a_position.push(
                        x, -0.5, y,
                        x + 1, -0.5, y,
                        x, -0.5, y + 1,

                        x + 1, -0.5, y,
                        x + 1, -0.5, y + 1,
                        x, -0.5, y + 1
                    );

                    json.a_texcoord.push(
                        0, 0,
                        1/3, 0,
                        0, 1,

                        1/3, 0,
                        1/3, 1,
                        0, 1
                    );

                    json.a_position.push(
                        x + 1, 0.5, y,
                        x, 0.5, y,
                        x + 1, 0.5, y + 1,

                        x, 0.5, y,
                        x, 0.5, y + 1,
                        x + 1, 0.5, y + 1
                    );

                    json.a_texcoord.push(
                        1, 0,
                        2/3, 0,
                        1, 1,

                        2/3, 0,
                        2/3, 1,
                        1, 1
                    );

                    HazyMaze.meshPoints += 12;

                    //Walls
                    if (tile & HazyMaze.NORTH) {
                        json.a_position.push(
                            x, -0.5, y + 1,
                            x + 1, -0.5, y + 1,
                            x, 0.5, y + 1,

                            x + 1, -0.5, y + 1,
                            x + 1, 0.5, y + 1,
                            x, 0.5, y + 1
                        );

                        json.a_texcoord.push(
                            1/3, 1,
                            2/3, 1,
                            1/3, 0,

                            2/3, 1,
                            2/3, 0,
                            1/3, 0
                        );

                        HazyMaze.meshPoints += 6;
                    }

                    if (tile & HazyMaze.SOUTH) {
                        json.a_position.push(
                            x + 1, -0.5, y,
                            x, -0.5, y,
                            x + 1, 0.5, y,

                            x, -0.5, y,
                            x, 0.5, y,
                            x + 1, 0.5, y
                        );

                        json.a_texcoord.push(
                            1/3, 1,
                            2/3, 1,
                            1/3, 0,

                            2/3, 1,
                            2/3, 0,
                            1/3, 0
                        );

                        HazyMaze.meshPoints += 6;
                    }

                    if (tile & HazyMaze.WEST) {
                        json.a_position.push(
                            x, -0.5, y,
                            x, -0.5, y + 1,
                            x, 0.5, y,

                            x, -0.5, y + 1,
                            x, 0.5, y + 1,
                            x, 0.5, y
                        );

                        json.a_texcoord.push(
                            1/3, 1,
                            2/3, 1,
                            1/3, 0,

                            2/3, 1,
                            2/3, 0,
                            1/3, 0
                        );

                        HazyMaze.meshPoints += 6;
                    }

                    if (tile & HazyMaze.EAST) {
                        json.a_position.push(
                            x + 1, -0.5, y + 1,
                            x + 1, -0.5, y,
                            x + 1, 0.5, y + 1,

                            x + 1, -0.5, y,
                            x + 1, 0.5, y,
                            x + 1, 0.5, y + 1
                        );

                        json.a_texcoord.push(
                            1/3, 1,
                            2/3, 1,
                            1/3, 0,

                            2/3, 1,
                            2/3, 0,
                            1/3, 0
                        );

                        HazyMaze.meshPoints += 6;
                    }
                }
            }
        }

        json.a_position = new Float32Array(json.a_position);
        json.a_texcoord = new Float32Array(json.a_texcoord);

        HazyMaze.mesh = HazyMaze.daveShade.buffersFromJSON(json);
    }
})();