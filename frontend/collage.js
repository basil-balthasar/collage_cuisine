function setup(){
    createCanvas(windowWidth, windowHeight)
    background(random(0, 255))
}

function draw(){
    background(0)
    circle(200,200,electron.circleValue)
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
    background(random(0, 255))
}