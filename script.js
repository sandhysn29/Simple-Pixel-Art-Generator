let container = document.querySelector(".container");
let gridButton = document.getElementById("submit-grid");
let clearGridButton = document.getElementById("clear-grid");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let colorButton = document.getElementById("color-input");
let eraseBtn = document.getElementById("erase-btn");
let paintBtn = document.getElementById("paint-btn");
let downloadBtn = document.getElementById("download-btn");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");

let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend"
    },
};

let deviceType = "";

let draw = false;
let erase = false;

const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

isTouchDevice();

gridButton.addEventListener("click", () => {
    container.innerHTML = "";
    for (let i = 0; i < gridHeight.value; i++) {
        let div = document.createElement("div");
        div.classList.add("gridRow");

        for (let j = 0; j < gridWidth.value; j++) {
            let col = document.createElement("div");
            col.classList.add("gridCol");
            col.setAttribute("id", `gridCol-${i}-${j}`); // Tambahkan ID unik
            col.addEventListener(events[deviceType].down, () => {
                draw = true;
                if (erase) {
                    col.style.backgroundColor = "transparent";
                } else {
                    col.style.backgroundColor = colorButton.value;
                }
            });

            col.addEventListener(events[deviceType].move, (e) => {
                if (draw) {
                    let element = document.elementFromPoint(
                        !isTouchDevice() ? e.clientX : e.touches[0].clientX,
                        !isTouchDevice() ? e.clientY : e.touches[0].clientY,
                    );
                    if (element && element.classList.contains("gridCol")) {
                        if (erase) {
                            element.style.backgroundColor = "transparent";
                        } else {
                            element.style.backgroundColor = colorButton.value;
                        }
                    }
                }
            });

            col.addEventListener(events[deviceType].up, () => {
                draw = false;
            });

            div.appendChild(col);
        }
        container.appendChild(div);
    }

    downloadBtn.disabled = false;
});

clearGridButton.addEventListener("click", () => {
    container.innerHTML = "";
    downloadBtn.disabled = true;
});

eraseBtn.addEventListener("click", () => {
    erase = true;
});

paintBtn.addEventListener("click", () => {
    erase = false;
});

gridWidth.addEventListener("input", () => { // Ubah dari "click" ke "input"
    widthValue.innerHTML = gridWidth.value < 10 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => { // Ubah dari "click" ke "input"
    heightValue.innerHTML = gridHeight.value < 10 ? `0${gridHeight.value}` : gridHeight.value;
});

window.onload = () => {
    gridHeight.value = 1;
    gridWidth.value = 1;
    widthValue.innerHTML = "01";
    heightValue.innerHTML = "01";
};

downloadBtn.addEventListener("click", () => {
    // Buat canvas
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let gridCols = document.querySelectorAll(".gridCol");
    let colWidth = gridCols[0].offsetWidth;
    let colHeight = gridCols[0].offsetHeight;
    canvas.width = gridWidth.value * colWidth;
    canvas.height = gridHeight.value * colHeight;

    // Gambar setiap kolom ke canvas
    gridCols.forEach((col) => {
        let row = parseInt(col.id.split("-")[1]);
        let colIndex = parseInt(col.id.split("-")[2]);
        ctx.fillStyle = col.style.backgroundColor || "#ffffff";
        ctx.fillRect(colIndex * colWidth, row * colHeight, colWidth, colHeight);
    });

    // Buat link unduh
    let link = document.createElement("a");
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL("image/png");
    link.click();
});