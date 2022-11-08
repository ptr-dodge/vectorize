export default class Vectorize {
    constructor(url) {
        this.url = url

        let imgFile = new Image()
        imgFile.src = this.url

        let canvas = document.createElement("canvas")

        imgFile.onload = () => {
            canvas.height = imgFile.height
            canvas.width = imgFile.width
            let ctx = canvas.getContext("2d")

            ctx.drawImage(imgFile, 0, 0)

            let imgData = ctx.getImageData(
                0,
                0,
                imgFile.width,
                imgFile.height
            ).data

            let sorted = this.sortPixels(imgData)
            let colorMap = this.setPixels(sorted)
            let imageArray = this.reShape(
                colorMap,
                imgFile.height,
                imgFile.width
            )

            let scale = 1

            let zcanv = document.createElement("canvas")
            let ztx = zcanv.getContext("2d")
            zcanv.height = imageArray[0].length * scale
            zcanv.width = imageArray.length * scale

            document.body.appendChild(zcanv)

            this.drawArray(ztx, imageArray, scale, {
                fg: "rebeccapurple",
                bg: "green"
            })
        }
    }

    reShape(array, rows, cols) {
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
        return this.transpose(array)
    }

    transpose(matrix) {
        return matrix.reduce(
            (prev, next) =>
                next.map((item, i) => (prev[i] || []).concat(next[i])),
            []
        )
    }

    drawArray(ctx, array, scale = 1, colors = { fg: "white", bg: "black" }) {
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

    sortPixels(array) {
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

    setPixels(array) {
        let oa = []
        // for each pixel, check if its black or white, put into new array
        for (let n = 0; n < array.length; n += 4) {
            array[n] == 255 ? oa.push(1) : oa.push(0)
        }
        return oa
    }
}
