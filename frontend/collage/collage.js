let joystickSpeed = 3;
let surfaceMaxScale = 2;
let elementMinScale = 0.1;
let elementMaxScale = 0.5;
let blendModes;
let backgroundColor

let zOrder = [0,1,2,null,null,null]

function setup(){
    createCanvas(windowWidth, windowHeight)
    loop()
    background(0);
    angleMode(DEGREES)
}

function draw(){
    background(0)
    if(!dataAssigned){
        return
    }
    blendMode(BLEND)
    if(myBackground.isOn){
        drawSurface(myBackground)
    }else{
        background(backgroundColor)
    }
    
    for(let l = 0; l < zOrder.length; l++){
        switch(zOrder[l]){
            case 0:
                if(foreground.isOn == true){
                    drawSurface(foreground);
                }
                break;
            case 1:
                if(layerOne.isOn == true){
                    blendMode(layerOne.blendMode)
                    drawElement(layerOne);
                }
                break;
            case 2:
                if(layerTwo.isOn == true){
                    blendMode(layerTwo.blendMode)
                    drawElement(layerTwo);
                }
                break;
            case null:
                break;              
        }
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