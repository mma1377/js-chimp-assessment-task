

function uploadImage() {
    let inputElement = document.getElementById('imageInput');
    let file = inputElement.files[0];
    verifyImage(file);
}


function convolution(input, filter) {
    let res = Array(input.length).fill(0);
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < filter.length; j++) {
            const index = i - Math.floor(filter.length / 2) + j;
            if (0 <= index && index < input.length) {
                res[i] += input[index] * filter[j];
            }
        }
    }
    return res;
}

function argmax(input) {
    let argmax= 0;
    let max = input[0];
    for (let i = 0; i < input.length; ++i) {
        if (input[i] > max) {
            argmax = i;
            max = input[i];
        }
    }
    return argmax;
}

function get_dominant_color(imageDataClamped) {
    let histogram_red = Array(256).fill(0);
    let histogram_green = Array(256).fill(0);
    let histogram_blue = Array(256).fill(0);
    for (let i = 0; i < imageDataClamped.length / 4; ++i) {
        let alpha = imageDataClamped[i * 4 + 3];
        if (alpha !== 0) {
            histogram_red[imageDataClamped[i * 4]]++;
            histogram_green[imageDataClamped[i * 4 + 1]]++;
            histogram_blue[imageDataClamped[i * 4 + 2]]++;
        }
    }
    let gaussian_filter = [0.2, 0.4, 0.6, 0.8, 0.9, 1, 0.9, 0.8, 0.6, 0.4, 0.2];
    let filtered_red_hist = convolution(histogram_red, gaussian_filter);
    let filtered_green_hist = convolution(histogram_green, gaussian_filter);
    let filtered_blue_hist = convolution(histogram_blue, gaussian_filter);
    let res = [0, 0, 0];
    res[0] = argmax(filtered_red_hist);
    res[1] = argmax(filtered_green_hist);
    res[2] = argmax(filtered_blue_hist);
    return res;
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

                console.log(get_dominant_color(imageDataClamped));

            }
        }
    }
    else {
        alert("Invalid file");
    }
}