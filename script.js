
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const upload = document.getElementById('upload');
let img = new Image();

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
        };
        reader.readAsDataURL(file);
    }
});

function applyGrayscale() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }
    ctx.putImageData(imageData, 0, 0);
}

function applyBlur() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    const width = canvas.width;
    const height = canvas.height;
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
    ctx.putImageData(imageData, 0, 0);
}
