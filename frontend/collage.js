function setup(){
    createCanvas(windowWidth, windowHeight)
    background(255,0,0)
}

function draw(){
    background(255,0,0)
    //circle(200,200,electron.circleValue)
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}

window.bridge.data((event, data)=>{
    //console.log(data)
})