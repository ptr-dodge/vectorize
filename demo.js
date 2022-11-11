import Vectorize from "./vectorize.js"

let image = "test_map.png"

const options = { draw: true, scale: 50 }

let vec = Vectorize(image, options)
console.table(vec)
