var fileInput = document.querySelector("#file")
let canvas
let ctx
let imgFile
let imgData
let imageArray = []

function reShape(array, rows, cols) {
    var copy = array.slice(0) // Copy all elements.
    array.length = 0 // Clear out existing array.

    for (var r = 0; r < rows; r++) {
        var row = []
        for (var c = 0; c < cols; c++) {
            var i = r * cols + c
            if (i < copy.length) {
                row.push(copy[i])
            }
        }
        array.push(row)
    }
    return array
}

function transpose(matrix) {
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
    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            if (array[x][y] == 1) {
                ctx.fillStyle = colors.fg
                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
            if (array[x][y] == 0) {
                ctx.fillStyle = colors.bg
                ctx.fillRect(x * scale, y * scale, scale, scale)
            }
        }
    }
}

function sortPixels(array) {
    let out = []
    // read image data into new array
    for (let i = 0; i < array.length; i++) {
        if (array[i] == 255) {
            out.push(255)
        } else if (array[i] == 0) {
            out.push(0)
        } else {
            console.error("⚠️ Please provide a black and white image")
            break
        }
    }
    return out
}

function setPixels(array) {
    let oa = []
    // for each pixel, check if its black or white, put into new array
    for (let n = 0; n < array.length; n += 4) {
        array[n] == 255 ? oa.push(1) : oa.push(0)
    }
    return oa
}

// listen for file input
fileInput.addEventListener("change", e => {
    // create dummy image object
    imgFile = new Image()
    imgFile.src = URL.createObjectURL(e.target.files[0])

    // create canvas to draw to
    canvas = document.createElement("canvas")
    // document.body.appendChild(canvas)

    imgFile.onload = () => {
        // set the canvas dims to the image dims
        canvas.height = imgFile.height
        canvas.width = imgFile.width
        ctx = canvas.getContext("2d")

        // draw the image to the canvas
        ctx.drawImage(imgFile, 0, 0)

        // extract the rgba values for each pixel
        imgData = ctx.getImageData(0, 0, imgFile.width, imgFile.height).data

        let sorted = sortPixels(imgData)
        let colorMap = setPixels(sorted)
        imageArray = reShape(colorMap, imgFile.height, imgFile.width)

        let scale = 50

        let zcanv = document.createElement("canvas")
        let ztx = zcanv.getContext("2d")
        zcanv.height = imageArray.length * scale
        zcanv.width = imageArray[0].length * scale

        document.body.appendChild(zcanv)

        drawArray(
            ztx,
            transpose(imageArray),
            scale,
            (colors = { fg: "rebeccapurple", bg: "green" })
        )
        console.table(imageArray)
    }
})
