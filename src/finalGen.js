HazyMaze.generate = () => {
    HazyMaze.genMaze();
    HazyMaze.genMesh();

    //After that we can now summon entities since this is the final generator.
    const spawnCandidates = [];
    for (let y=0; y<HazyMaze.level.height; y++) {
        for (let x=0; x<HazyMaze.level.width; x++) {
            const tile = HazyMaze.level.getTile(x,y);

            //Make sure we aren't an empty version
            if (tile != 255) {
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
    HazyMaze.currentPlayer.x = spawnPos[0] + 0.5;
    HazyMaze.currentPlayer.y = spawnPos[1] + 0.5;
    HazyMaze.currentPlayer.stepTime = 1;
}