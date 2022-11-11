export default function Vectorize(url, options = { draw: false, scale: 1 }) {
    let img = new Image()
    img.src = url

    let imageArray = []
    let imgData
    let sorted
    let colorMap

    img.addEventListener("load", () => {
        let canvas = document.createElement("canvas")
        let ctx = canvas.getContext("2d")

        canvas.height = img.height
        canvas.width = img.width

        ctx.drawImage(img, 0, 0)

        imgData = getImageData(ctx, img)
        sorted = sortPixels(imgData)
        colorMap = setPixels(sorted)
        imageArray = reShape(colorMap, img.height, img.width)

        if (options.draw) {
            let zcanv = document.createElement("canvas")
            let ztx = zcanv.getContext("2d")
            zcanv.height = imageArray[0].length * options.scale
            zcanv.width = imageArray.length * options.scale

            document.body.appendChild(zcanv)

            drawArray(ztx, imageArray, options.scale)
        }
    })
    return imageArray
}

function getImageData(ctx, img) {
    return ctx.getImageData(0, 0, img.width, img.height).data
}

function sortPixels(array) {
    // TODO: add handler for transparent pixels (r=0, g=0, b=0, a=0)

    let out = [] // our temporary array for sorting

    // read image data
    for (let i = 0; i < array.length; i++) {
        /* we only want the rgba values 255 and 0,
         * a white pixel is r=255, g=255, b=255, a=255
         * a black pixel is r=0, g=0, b=0, a=255 */
        if (array[i] == 255) {
            out.push(255)
        } else if (array[i] == 0) {
            out.push(0)
        } else {
            console.error("⚠️ Please provide a black and white image")
            // here we use break so we dont get the same error for each colored pixel
            break
        }
    }
    return out
}

function setPixels(array) {
    let a = []
    // for each pixel, check if its black or white, put into new array
    for (let n = 0; n < array.length; n += 4) {
        // shorthand if statement: if white pixel, push 1, if black, push 0
        array[n] == 255 ? a.push(1) : a.push(0)
    }

    return a
}

function reShape(array, rows, cols) {
    // convert 1d array to 2d

    var copy = array.slice(0) // Copy all elements.
    array.length = 0 // Clear out existing array.

    // go through each (x, y) pair
    for (var x = 0; x < rows; x++) {
        var row = []
        // build array of length rows (image width)
        for (var y = 0; y < cols; y++) {
            var n = x * cols + y
            if (n < copy.length) {
                row.push(copy[n])
            }
        }
        // push that row to the 2d array
        array.push(row)
    }
    // return rotated 2d array
    console.table(transpose(array))

    return transpose(array)
}

function transpose(matrix) {
    // rotate 2d array 90 degrees to the right
    return matrix.reduce(
        (prev, next) => next.map((item, i) => (prev[i] || []).concat(next[i])),
        []
    )
}

function drawArray(
    ctx,
    array,
    scale = 1,
    colors = { fg: "white", bg: "black" }
) {
    // loop through each indice
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            if (array[x][y] == 1) {
                // '1' == black
                ctx.fillStyle = colors.fg

                // you could add a different width or height arguments for each square
                // it would be interesting but sort of pointless, so we do it this way

                // here we need (x * scale) cause that will give us the coordinate to draw on the canvas
                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
            if (array[x][y] == 0) {
                // '0' == white
                ctx.fillStyle = colors.bg

                // you could add a different width or height arguments for each square
                // it would be interesting but sort of pointless, so we do it this way

                // here we need (x * scale), etc. cause that will give us the coordinate to draw on the canvas
                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
        }
    }
}
