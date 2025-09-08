(function() {
    const holder = document.getElementById("CUGI-holder");

    holder.appendChild(CUGI.createList([
        { type: "vec2", key: "mazeDimensions", text: "New Size", target: HazyMaze },
        { type: "boolean", key: "isNight", text: "Night Mode", target: HazyMaze},
        { type: "button", text: "New Maze", onclick: () => {
            HazyMaze.generate();
        }},
        { type: "boolean", key: "fitToScreen", text: "Fit to Screen", target: HazyMaze, onchange: HazyMaze.adjustScreenSize},
        { type: "vec2", key: "overrideSize", text: "Screen Size", target: HazyMaze, onchange: HazyMaze.adjustScreenSize },
        { type: "boolean", key: "stretchToFit", text: "Stretch to Fit", target: HazyMaze, onchange: HazyMaze.adjustScreenSize},
    ]));
})();