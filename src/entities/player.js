HazyMaze.player = class extends HazyMaze.entity {
    init() {
        this.taken = {};
        this.direction = 90;
        this.state = 2;
        this.moveAlong = false;
    }

    update() {
        let converted = this.direction * 0.01745329;
        converted = [Math.sin(converted), Math.cos(converted)];

        //Movement
        switch (this.state) {
            //Move forward
            case 0:
                //Do front checks
                let inTileOffset = this.getInTileOffset(this.x, this.y);
                if (inTileOffset[0] == 0.5 && inTileOffset[1] == 0.5) {
                    let dir = 0;
                    let left = 0;
                    let right = 0;

                    //Direction stuff
                    switch (this.direction % 360) {
                        case 90: dir = HazyMaze.WEST; left = HazyMaze.SOUTH; right = HazyMaze.NORTH; break;
                        case 270: dir = HazyMaze.EAST; left = HazyMaze.NORTH; right = HazyMaze.SOUTH; break;
                        case 180: dir = HazyMaze.SOUTH; left = HazyMaze.EAST; right = HazyMaze.WEST; break;
                        case 0: dir = HazyMaze.NORTH; left = HazyMaze.WEST; right = HazyMaze.EAST; break;
                    
                        default: dir = 0; break;
                    }

                    //Turn guesses
                    const curTile = this.getTileAt(this.x, this.y)
                    if ((curTile & dir) != 0) {
                        if ((curTile & left) != 0) this.state = 1;
                        else this.state = 2;
                        this.moveAlong = true;
                        break;
                    }
                    else if (!this.moveAlong) {
                        //Check if left is taken, if not turn.
                        if ((curTile & left) == 0 && 
                        !this.taken[this.getTileID(this.x + converted[1], this.y + converted[0])]) {
                            this.taken[this.getTileID(this.x + converted[1], this.y + converted[0])] = true;
                            this.state = 2;
                            this.moveAlong = true;
                            break;
                        }

                        //Check if left is taken, if not turn.
                        if ((curTile & right) == 0 && 
                        !this.taken[this.getTileID(this.x - converted[1], this.y + converted[0])]) {
                            this.taken[this.getTileID(this.x - converted[1], this.y + converted[0])] = true;
                            this.state = 1;
                            this.moveAlong = true;
                            break;
                        }
                    }
                }

                this.x -= Math.round(converted[0]) * 0.02;
                this.y += Math.round(converted[1]) * 0.02;
                
                if(this.moveAlong) {
                    this.moveAlong = false;
                }

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
        }

        if (this.direction < 0) this.direction = 360 - this.direction;

        HazyMaze.shader.setUniforms({
            u_cameraPos: [this.x, 0, this.y],
            u_cameraRot: [...converted, (HazyMaze.canvas.height / HazyMaze.canvas.width) / 0.75],
        });
    }
};