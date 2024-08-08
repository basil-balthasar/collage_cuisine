function setup(){
    createCanvas(windowWidth, windowHeight)
    background(255)
}

function draw(){
    background(255)
    //circle(200,200,electron.circleValue)
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight)
}

window.bridge.data((event, data)=>{
    //console.log(data)
})

document.addEventListener("DOMContentLoaded", ()=>{
    window.bridge.updateMessage(updateMessage)
})

function updateMessage(event, message){
    console.log("recieved message")
    document.getElementById("version").innerHTML = message
}