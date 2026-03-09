HazyMaze.userControlled = false;
HazyMaze.noclip = false;
HazyMaze.view = "firstPerson";

HazyMaze.player = class extends HazyMaze.entity {
    init() {
        this.route = [];
        this.direction = 90;
        this.tDirection = 90;
        this.interp = 0;
        this.state = 4;
        this.popup = 0;
        this.targetRoll = 0;
        this.roll = 0;

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

    collideLine(line) {
        const pointLineX = Math.min(line.x + 1, Math.max(line.x, line.x + (this.x - line.x) * line.dx));
        const pointLineY = Math.min(line.y + 1, Math.max(line.y, line.y + (this.y - line.y) * line.dy));

        const distance = Math.sqrt(Math.pow(this.x - pointLineX, 2) + Math.pow(this.y - pointLineY, 2));
        if (distance < 0.25) {
            const directionX = (pointLineX - this.x) / distance;
            const directionY = (pointLineY - this.y) / distance;
            const pushout = (0.25 - distance);

            this.x -= directionX * pushout;
            this.y -= directionY * pushout;
        }
        else return false;
    }

    moveAndCollideBy(x, y) {
        const tileX = Math.floor(this.x);
        const tileY = Math.floor(this.y);
        let tile = this.getTileAt(this.x, this.y);

        this.x += x;
        this.y += y;

        if (HazyMaze.noclip) return;

        if (tile & HazyMaze.NORTH) {
            this.collideLine({ x: tileX, y: tileY + 1, dx: 1, dy: 0});
        }

        if (tile & HazyMaze.SOUTH) {
            this.collideLine({ x: tileX, y: tileY, dx: 1, dy: 0});
        }

        if (tile & HazyMaze.EAST) {
            this.collideLine({ x: tileX + 1, y: tileY, dx: 0, dy: 1});
        }

        if (tile & HazyMaze.WEST) {
            this.collideLine({ x: tileX, y: tileY, dx: 0, dy: 1});
        }
    }

    update() {
        if (this.roll < this.targetRoll) this.roll += HazyMaze.deltaTime * 180;
        else this.roll = this.targetRoll;

        let convertedAngle = this.direction * 0.01745329;
        let convertedRoll = this.roll * 0.01745329;
        let converted = [
            Math.sin(convertedAngle), Math.cos(convertedAngle), 0,
            Math.sin(convertedRoll), Math.cos(convertedRoll), 1
        ];

        //Simple FPS movement if the user requests it.
        if (HazyMaze.userControlled && this.state != 4) {
            if (HazyMaze.keysDown["a"]) this.direction += 180 * HazyMaze.deltaTime * converted[4];
            if (HazyMaze.keysDown["d"]) this.direction -= 180 * HazyMaze.deltaTime * converted[4];
            if (HazyMaze.keysDown["w"]) this.moveAndCollideBy(
                -converted[0] * HazyMaze.deltaTime * 1.5,
                converted[1] * HazyMaze.deltaTime * 1.5
            );
            if (HazyMaze.keysDown["s"]) this.moveAndCollideBy(
                converted[0] * HazyMaze.deltaTime * 1.5,
                -converted[1] * HazyMaze.deltaTime * 1.5
            );
        }
        else {
            //Movement
            switch (this.state) {
                //Move forward
                case 0:
                    //Current and next positions
                    const cur = Math.floor(this.interp);

                    if (cur >= this.route.length - 1) {
                        this.state = 5;
                        return;
                    }

                    const nex = cur + 1;

                    //Calculate deltas
                    const dx = this.route[nex][0] - this.route[cur][0];
                    const dy = this.route[nex][1] - this.route[cur][1];

                    //Move along path
                    this.x = this.route[cur][0] + (dx) * (this.interp % 1) + 0.5;
                    this.y = this.route[cur][1] + (dy) * (this.interp % 1) + 0.5;

                    //First get the Arc Tangent, the turn it into degrees, then flip it if y<0 else explode
                    this.tDirection = -((Math.atan2(-dy, dx) * 180 / Math.PI) + 90);

                    let dd = this.tDirection - this.direction;
                    if (dd >= 180) this.direction += 360;
                    if (dd <= -180) this.direction -= 360;

                    //Recalculate and turn
                    dd = this.tDirection - this.direction;
                    //Turn and compensate for overturn
                    if (dd > 0) {
                        this.direction += 180 * HazyMaze.deltaTime;
                        if (this.direction > this.tDirection) this.direction = this.tDirection;
                    }
                    else if (dd < 0) {
                        this.direction -= 180 * HazyMaze.deltaTime;
                        if (this.direction < this.tDirection) this.direction = this.tDirection;
                    }

                    this.interp += HazyMaze.deltaTime;
                    break;

                    break;
                
                //Turning (Unused)
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
                    if (this.popup < 1) this.popup += 0.5 * HazyMaze.deltaTime;
                    else {
                        this.state = 0;
                        this.popup = 1;
                    }
                    break;
                
                //Exit animation
                case 5:
                    if (this.popup > 0) this.popup -= 0.5 * HazyMaze.deltaTime;
                    else {
                        this.state = 4;
                        this.popup = 0;
                        HazyMaze.generate()
                    }
                    if ((this.targetRoll % 360) == 180) this.targetRoll += 180;
                    break;
            }
        }

        //View mode configuration
        let aspectStretch = 0.75;
        let cameraPosition = [this.x, Math.cos(convertedRoll) * 0.05, this.y];
        
        //Just in-case we need/want to add more.
        switch (HazyMaze.view) {
            case "fullView":
                converted[0] = 0;
                converted[1] = 1;
                converted[2] = 1;
                converted[3] = 0;
                converted[4] = 1;
                converted[5] = 0;

                const halfWidth = HazyMaze.level.width / 2;
                const halfHeight = HazyMaze.level.height / 2;

                cameraPosition = [halfWidth, Math.sqrt(Math.pow(halfWidth, 2) + Math.pow(halfHeight, 2)), halfHeight];
                
                aspectStretch = 1;
                break;

            case "topDown":
                converted[2] = 1;
                converted[5] = 0;
                converted[3] = 0;
                converted[4] = 1;

                cameraPosition[1] = 3;
                
                aspectStretch = 1;
                break;
        
            default:
                break;
        }
        
        HazyMaze.shader.setUniforms({
            u_cameraPos: cameraPosition,
            u_cameraRot: [...converted, (HazyMaze.canvas.height / HazyMaze.canvas.width) / aspectStretch, this.popup, 0],
        });

        //If not in first person do a billboard thingimajig.
        if (HazyMaze.view != "firstPerson") {
            const cameraRotation = HazyMaze.shader.uniforms.u_cameraRot.value;

            //We need to draw both sides for flipping.
            HazyMaze.shader.setUniforms({
                u_texture: HazyMaze.texture.texture,
                u_uvTransform: [6/HazyMaze.atlasSize,0, 1/HazyMaze.atlasSize,1],
                u_transform: [
                    -Math.sin(convertedAngle), Math.cos(convertedAngle), this.x, 
                    -cameraRotation[2], cameraRotation[5], 0,
                    -Math.sin(convertedRoll), Math.cos(convertedRoll), this.y
                ],
                u_angleShade: [
                    0.625,-0.25,0.125,1.0
                ]
            });

            HazyMaze.shader.setBuffers(HazyMaze.billboard);
            HazyMaze.shader.drawFromBuffers(6);

            HazyMaze.shader.setUniforms({
                u_transform: [
                    -Math.sin(convertedAngle), Math.cos(convertedAngle), this.x, 
                    -cameraRotation[2], cameraRotation[5], 0.5,
                    -Math.sin(convertedRoll), -Math.cos(convertedRoll), this.y
                ],
            });
            HazyMaze.shader.drawFromBuffers(6);
        }

        const entityCount = HazyMaze.level.entities.length;
        for (let entID = 0; entID < entityCount; entID++) {
            const entity = HazyMaze.level.entities[entID];
            if (entity.getCurrentTileID() == this.getCurrentTileID()) entity.touchedPlayer(this);
        }

    }
};