let numberOfImages = [2, 0, 2, 0]

let backgroundImages = []
let foregroundImages = []
let layerOneImages = []
let layerTwoImages = []

class ImageObject{
    constructor(isOn, image, position, scale, rotation, blendMode){
        this.isOn = isOn
        this.image = image
        this.position = position
        this.scale = scale
        this.rotation = rotation
        this.blendMode = blendMode
    }
}

function preload(){
    for(let b = 0; b<numberOfImages[0]; b++){
        backgroundImages[b] = loadImage("./content/collageElements/BG/"+(b).toString()+".png")
    }
    for(let f = 0; f<numberOfImages[1]; f++){
        foregroundImages[f] = loadImage("./content/collageElements/FG/"+(f).toString()+".png")
    }
    for(let o = 0; o<numberOfImages[2]; o++){
        layerOneImages[o] = loadImage("./content/collageElements/ONE/"+(o).toString()+".png")
    }
    for(let t = 0; t<numberOfImages[3]; t++){
        layerTwoImages[t] = loadImage("./content/collageElements/TWO/"+(t).toString()+".png")
    }
}