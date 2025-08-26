Math.randomRange = (min, max) => {
    return Math.random() * (max - min) + min;
}

Math.randomIRange = (min, max) => {
    return Math.round(Math.randomRange(min, max));
}