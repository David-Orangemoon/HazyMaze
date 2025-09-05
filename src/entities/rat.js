HazyMaze.rat = class extends HazyMaze.entity {
    init() {
        this.route = [];
        this.interp = 0;
        this.state = 0;

        this.createRoute();
    }

    createRoute() {
        //Bring back Mazy but finding a path, Pathy!
        const pathyPosition = new Uint16Array(2);
        pathyPosition[0] = this.x;
        pathyPosition[1] = this.y;
        this.route.push([pathyPosition[0], pathyPosition[1]]);

        //Calculate paths from Pathy
        let paths = HazyMaze.level.getMovesFrom(...pathyPosition);
        const currentPath = [];
        const been = {};
        while (paths != 0 || currentPath.length > 0) {
            const possible = [];

            //Recalculate
            if (paths != 0) {
                //Get moves
                if (paths & HazyMaze.NORTH) possible.push([0,1, HazyMaze.NORTH, HazyMaze.SOUTH]);
                if (paths & HazyMaze.SOUTH) possible.push([0,-1, HazyMaze.SOUTH, HazyMaze.NORTH]);
                if (paths & HazyMaze.WEST) possible.push([-1,0, HazyMaze.WEST, HazyMaze.EAST]);
                if (paths & HazyMaze.EAST) possible.push([1,0, HazyMaze.EAST, HazyMaze.WEST]);

                //Save current path and been
                currentPath.push([pathyPosition[0], pathyPosition[1]]);
                been[`${pathyPosition[0]}|${pathyPosition[1]}`] = (been[`${pathyPosition[0]}|${pathyPosition[1]}`] || 0) | possible[0][2];
                pathyPosition[0] += possible[0][0];
                pathyPosition[1] += possible[0][1];
                been[`${pathyPosition[0]}|${pathyPosition[1]}`] = (been[`${pathyPosition[0]}|${pathyPosition[1]}`] || 0) | possible[0][3];
            }
            //Go back if needed
            else {
                pathyPosition[0] = currentPath[currentPath.length - 1][0];
                pathyPosition[1] = currentPath[currentPath.length - 1][1];
                currentPath.splice(currentPath.length - 1, 1);
            }
            
            //Add position to route and get new path
            this.route.push([pathyPosition[0], pathyPosition[1]]);

            paths = HazyMaze.level.getMovesFrom(...pathyPosition);

            //Remove where we have been
            const tileBeen = been[`${pathyPosition[0]}|${pathyPosition[1]}`] || 0;
            if ((paths & HazyMaze.NORTH) && (tileBeen & HazyMaze.NORTH)) paths -= HazyMaze.NORTH;
            if ((paths & HazyMaze.SOUTH) && (tileBeen & HazyMaze.SOUTH)) paths -= HazyMaze.SOUTH;
            if ((paths & HazyMaze.EAST) && (tileBeen & HazyMaze.EAST)) paths -= HazyMaze.EAST;
            if ((paths & HazyMaze.WEST) && (tileBeen & HazyMaze.WEST)) paths -= HazyMaze.WEST;

            this.x = pathyPosition[0] + 0.5;
            this.y = pathyPosition[1] + 0.5;
        }
    }

    update() {
        //Movement
        switch (this.state) {
            //Move forward
            case 0:
                //Current and next positions
                const cur = Math.floor(this.interp) % this.route.length;
                const nex = (cur + 1) % this.route.length;

                //Calculate deltas
                const dx = this.route[nex][0] - this.route[cur][0];
                const dy = this.route[nex][1] - this.route[cur][1];

                //Move along path
                this.x = this.route[cur][0] + (dx) * (this.interp % 1) + 0.5;
                this.y = this.route[cur][1] + (dy) * (this.interp % 1) + 0.5;

                this.interp += HazyMaze.deltaTime * 1.5;
                break;
        }

        const cameraRotation = HazyMaze.shader.uniforms.u_cameraRot.value;

        HazyMaze.shader.setUniforms({
            u_texture: HazyMaze.texture.texture,
            u_uvTransform: [4/6,0, 1/6,1],
            u_transform: [
                -cameraRotation[0], cameraRotation[1], this.x, 
                0, 1, Math.abs(Math.sin(this.interp * Math.PI * 2) * 0.25),
                0, 1, this.y
            ],
            u_angleShade: [
                0.625,-0.25,0.125,1.0
            ]
        });

        HazyMaze.shader.setBuffers(HazyMaze.billboard);
        HazyMaze.shader.drawFromBuffers(6);
    }
};