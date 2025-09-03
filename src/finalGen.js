HazyMaze.generate = () => {
    HazyMaze.genMaze();
    HazyMaze.genMesh();

    //After that we can now summon entities since this is the final generator.
    const spawnCandidates = [];
    for (let y=0; y<HazyMaze.level.height; y++) {
        for (let x=0; x<HazyMaze.level.width; x++) {
            const tile = HazyMaze.level.getTile(x,y);

            //Make sure we aren't an empty version
            if ((tile & HazyMaze.EMPTY)) {
                spawnCandidates.push([x,y]);
            }
        }
    }

    const getRandomSpawn = () => {
        const candidateID = Math.randomIRange(0, spawnCandidates.length - 1);
        const output = spawnCandidates[candidateID];
        spawnCandidates.splice(candidateID, 1);

        return output;
    }


    let spawnPos = getRandomSpawn();
    const player = new HazyMaze.player(spawnPos[0] + 0.5, spawnPos[1] + 0.5);
    HazyMaze.level.entities.push(player);

    //Night Lights
    if (HazyMaze.isNight) {
        for (let i = 0; i<32; i++) {
            spawnPos = getRandomSpawn();
            
            const light = new HazyMaze.light(spawnPos[0] + 0.5, spawnPos[1] + 0.5);
            HazyMaze.level.entities.push(light);
        }
    }
}