Math.randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

Math.randomIRange = (min, max) => {
    return Math.floor(Math.randomRange(min, max));
}