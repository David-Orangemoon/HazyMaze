(function() {
    const holder = document.getElementById("CUGI-holder");
    let popup = true;

    
    const filePopup = document.createElement("input");
    filePopup.type = "file";
    filePopup.accept = ".png,.jpeg,.jpg,.webp";

    const fileReader = new FileReader;

    //Read into texture
    fileReader.onload = () => {

        const image = new Image();
        image.onload = () => {
            HazyMaze.texture = HazyMaze.daveShade.createTexture(image);
            HazyMaze.texture.setFiltering(DaveShade.filtering.NEAREST, true);
            HazyMaze.texture.setFiltering(DaveShade.filtering.NEAREST, false);
        }
        image.src = fileReader.result;
    }

    //File Popup
    filePopup.onchange = (event) => {
        const file = event.target.files[0];
        fileReader.readAsDataURL(file);
    }

    holder.appendChild(CUGI.createList([
        { type: "boolean", key: "fitToScreen", text: "Fit to Screen", target: HazyMaze, onchange: HazyMaze.adjustScreenSize},
        { type: "vec2", key: "overrideSize", text: "Screen Size", target: HazyMaze, onchange: HazyMaze.adjustScreenSize },
        { type: "boolean", key: "stretchToFit", text: "Stretch to Fit", target: HazyMaze, onchange: HazyMaze.adjustScreenSize},
        "---",
        { type: "slider", min: 0, max: 25, step: 0.1, key: "timescale", text: "Timescale", target: HazyMaze},
        "---",
        "---",
        { type: "vec2", key: "mazeDimensions", text: "New Size", target: HazyMaze },
        { type: "boolean", key: "isNight", text: "Night Mode", target: HazyMaze },
        { type: "int", key: "ratCount", text: "Rat Count", min: 0, max: 25, target: HazyMaze },
        { type: "button", text: "New Maze", onclick: () => {
            HazyMaze.generate();
        }},
        "---",
        "---",
        { type: "button", text: "Upload Texture", onclick: () => {
            filePopup.click();
        }},
        { type: "link", text: "Original Texture", link: `${location.href.replaceAll(/\/$/g, "")}/assets/TILES.png` },
        "---",
        "---",
        "Hazy Maze created by",
        { type: "link", text: "ObviousAlexC", link:"https://github.com/David-Orangemoon" },
        "press O to collapse this menu"
    ]));

    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() == "o") {
            popup = !popup;

            if (popup) holder.style.opacity = "100%";
            else holder.style.opacity = "0%";
        }
    });
})();