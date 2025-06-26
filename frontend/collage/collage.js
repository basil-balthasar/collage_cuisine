/*----------------------------------------------------
This file handles most of the actual drawing of
content on the collage screen
----------------------------------------------------*/

//-----Adjustable variables-----//
let joystickSpeed = 10;
let surfaceMaxScale = 2;
let elementMinScale = 0.05;
let elementMaxScale = 0.3;


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
        console.log("Data not assigned!")
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
                    blendMode(BLEND)
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

/*The background and foreground layer are referred to as surface layers*/
function drawSurface(layer){
    imageMode(CORNER)
    image(layer.image, 0, 0, windowWidth, windowHeight,
    layer.position.x, layer.position.y,
    layer.image.width/layer.scale, layer.image.height/layer.scale, COVER);
}

/*The other layers are referred to as element layers*/
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