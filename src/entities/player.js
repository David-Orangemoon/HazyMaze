HazyMaze.player = class extends HazyMaze.entity {
    init() {
        this.route = [];
        this.taken = {};
        this.direction = 90;
        this.tDirection = 90;
        this.interp = 0;
        this.state = 4;
        this.popup = 0;

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
        let converted = this.direction * 0.01745329;
        converted = [Math.sin(converted), Math.cos(converted)];

        //Movement
        switch (this.state) {
            //Move forward
            case 0:
                //Current and next positions
                const cur = Math.floor(this.interp);
                const nex = cur + 1;

                //Calculate deltas
                const dx = this.route[nex][0] - this.route[cur][0];
                const dy = this.route[nex][1] - this.route[cur][1];

                //Move along path
                this.x = this.route[cur][0] + (dx) * (this.interp % 1) + 0.5;
                this.y = this.route[cur][1] + (dy) * (this.interp % 1) + 0.5;

                //First get the Arc Tangent, the turn it into degrees, then flip it if y<0 else explode
                this.tDirection = -((Math.atan2(-dy, dx) * 180 / Math.PI) + 90);

                const dd = this.tDirection - this.direction;
                if (dd >= 180) this.direction += 360;
                if (dd <= -180) this.direction -= 360;
                this.direction += (this.tDirection - this.direction) * 0.0625;

                this.interp += HazyMaze.deltaTime;
                break;

                break;
            
            //Turning
            case 1:
                this.direction -= 2;
                if (this.direction % 90 == 0) this.state = 0;
                break;
            
            case 2:
                this.direction += 2;
                if (this.direction % 90 == 0) this.state = 0;
                break;

            //Initial animation
            case 4:
                if (this.popup < 1) this.popup += 0.01;
                else {
                    this.state = 0;
                    this.popup = 1;
                }
        }

        HazyMaze.shader.setUniforms({
            u_cameraPos: [this.x, 0, this.y],
            u_cameraRot: [...converted, (HazyMaze.canvas.height / HazyMaze.canvas.width) / 0.75, this.popup],
        });
    }
};