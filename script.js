
function uploadImage() {
    let inputElement = document.getElementById('imageInput');
    let file = inputElement.files[0];
    verifyImage(file);
}

function verifyImage(imageFile) {
    if (imageFile) {
        if (imageFile.type.startsWith('image/')) {
            let threshold = 5;
            let img = new Image();
            img.src = URL.createObjectURL(imageFile);
            img.onload = function () {
                if (img.width !== 512 || img.height !== 512)
                    alert("Invalid sizes");
                let canvas = document.createElement('canvas');
                let ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                let imageDataClamped= ctx.getImageData(
                    0, 0, img.width, img.height
                ).data;
                for (let i = 0; i < imageDataClamped.length / 4; ++i) {
                    let x = i % img.width;
                    let y = Math.floor(i / img.width);
                    let alpha = imageDataClamped[i * 4 + 3];
                    if (Math.sqrt((x - 256) ** 2 + (y - 256) ** 2) > 256 + threshold && alpha !== 0) {
                        alert("Transparent pixels outside circle");
                        break;
                    }
                }
            }
        }
    }
    else {
        alert("Invalid file");
    }
}