let numberOfImages = [8, 13, 15, 15]

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

let myBackground;
let foreground;
let layerOne;
let layerTwo;

let backgroundImages = [];
let foregroundImages = [];
let layerOneImages = [];
let layerTwoImages = [];

function preload(){
    blendModes = [BLEND, DIFFERENCE, SCREEN, BURN]
    for(let b = 0; b<numberOfImages[0]; b++){
        backgroundImages[b] = loadImage("./content/collageElements/BG/"+b+".webp")
    }
    for(let f = 0; f<numberOfImages[1]; f++){
        foregroundImages[f] = loadImage("./content/collageElements/FG/"+f+".webp")
    }
    for(let o = 0; o<numberOfImages[2]; o++){
        layerOneImages[o] = loadImage("./content/collageElements/ONE/"+o+".webp")
    }
    for(let t = 0; t<numberOfImages[3]; t++){
        layerTwoImages[t] = loadImage("./content/collageElements/TWO/"+t+".webp")
    }
    myBackground = new ImageObject(true, backgroundImages[0], createVector(0,0) , 1.0, 0.0, 0);
    foreground = new ImageObject(true, foregroundImages[0], createVector(0,0), 1.0, 0.0, 0);
    layerOne = new ImageObject(true, layerOneImages[0], createVector(0,0), 0.1, 45.0, 0);
    layerTwo = new ImageObject(true, layerTwoImages[0], createVector(0,0), 1.0, 0.0, 0);
}