const originalCanvas = document.getElementById("canvas-original");
const editedCanvas = document.getElementById("canvas-edited");
const fileUpload = document.getElementById("file-upload");
const effectSelector = document.getElementById("effect-selector");

const originalCtx = originalCanvas.getContext("2d");
const editedCtx = editedCanvas.getContext("2d");

let uploadedImage = null;

fileUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImage = new Image();
            uploadedImage.onload = function() {
                originalCanvas.width = uploadedImage.width;
                originalCanvas.height = uploadedImage.height;
                originalCtx.drawImage(uploadedImage, 0, 0);
                editedCanvas.width = uploadedImage.width;
                editedCanvas.height = uploadedImage.height;
                editedCtx.drawImage(uploadedImage, 0, 0);
            };
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

function applySelectedEffect() {
    const effect = effectSelector.value;
    if (effect === "grayscale") {
        applyGrayscale();
    } else if (effect === "blur") {
        applyBlur();
    }
}

function applyGrayscale() {
    const imageData = editedCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    editedCtx.putImageData(imageData, 0, 0);
}

function applyBlur() {
    const imageData = editedCtx.getImageData(0, 0, editedCanvas.width, editedCanvas.height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    const width = editedCanvas.width;
    const height = editedCanvas.height;
    const radius = 2;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const index = (ny * width + nx) * 4;
                        r += tempData[index];
                        g += tempData[index + 1];
                        b += tempData[index + 2];
                        count++;
                    }
                }
            }
            const i = (y * width + x) * 4;
            data[i] = r / count;
            data[i + 1] = g / count;
            data[i + 2] = b / count;
        }
    }
    editedCtx.putImageData(imageData, 0, 0);
}
