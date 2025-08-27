(function() {
    HazyMaze.mesh = null;
    HazyMaze.meshPoints = 0;
    HazyMaze.genMesh = () => {
        let json = {
            a_position: []
        };

        HazyMaze.mesh = null;
        HazyMaze.meshPoints = 0;

        json.a_position.push(
            -1, -1, 0.5, 1,
            1, -1, 0.5, 1,
            -1, 1, 0.5, 1,
        );
        HazyMaze.meshPoints = 3;

        json.a_position = new Float32Array(json.a_position);

        HazyMaze.mesh = HazyMaze.daveShade.buffersFromJSON(json);
        return;


        for (let y=0; y<HazyMaze.level.height; y++) {
            for (let x=0; x<HazyMaze.level.width; x++) {
                const tile = HazyMaze.level.getTile(x,y);

                //Make sure we aren't an empty version
                if (tile != 255) {
                    json.a_position.push(
                        x, -0.5, y,
                        x + 1, -0.5, y,
                        x, -0.5, y + 1,

                        x + 1, -0.5, y + 1,
                        x + 1, -0.5, y,
                        x, -0.5, y + 1
                    );
                    HazyMaze.meshPoints += 6;
                }
            }
        }

        json.a_position = new Float32Array(json.a_position);

        HazyMaze.mesh = HazyMaze.daveShade.buffersFromJSON(json);
    }
})();