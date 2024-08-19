let joystickSpeed = 3;
let surfaceMaxScale = 2;
let elementMinScale = 0.1;
let elementMaxScale = 0.5;
let blendModes;
let backgroundColor

function setup(){
    createCanvas(windowWidth, windowHeight)
    background(0);
    blendModes = [BLEND, DIFFERENCE, SCREEN, BURN]
    angleMode(DEGREES)
}

function draw(){
    background(0)
    if(myBackground.isOn){
        drawSurface(myBackground)
    }else{
        background(backgroundColor)
    }
    if(layerOne.isOn){
        drawElement(layerOne)
    }
}

function drawSurface(layer){
    imageMode(CORNER)
    if(layer.image.width >= layer.image.height){
        image(layer.image, 0, 0, windowWidth, windowHeight,
        layer.position.x, layer.position.y,
        layer.image.width/layer.scale, layer.image.height/layer.scale, COVER);
    }else{
        image(layer.image,
        layer.position.x,
        layer.position.y,
        width*layer.scale,
        width*layer.image.height/layer.image.width*layer.scale); //this calculation only works for images that are wider than the display screen
    }
}

function drawElement(layer){
    imageMode(CENTER)
    push();
        translate(layer.position.x, layer.position.y);
        rotate(layer.rotation);
        image(layer.image, 0, 0,
        layer.image.width*layer.scale,
        layer.image.height*layer.scale);
    pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// window.bridge.updateStatus((event, message)=>{
//     console.log(message)
// })

// onkeydown = ()=>{
//     window.bridge.saveImage()
// }