let joystickSpeed = 1;
let blendModes;

function setup(){
    createCanvas(windowWidth, windowHeight)
    blendModes = [BLEND, DIFFERENCE, SCREEN, BURN]
}

function draw(){
    
}

function drawSurface(layer){
    let displayWidth = min(layer.image.width*layer.scale)

    image(layer.image,
    layer.position.x, layer.position.y,
    layer.image.width, layer.image.height
    )
}

function drawElement(layer){
    image(layer.image,
        layer.position.x, layer.position.y,
    )
}

// window.bridge.updateStatus((event, message)=>{
//     console.log(message)
// })

// onkeydown = ()=>{
//     window.bridge.saveImage()
// }