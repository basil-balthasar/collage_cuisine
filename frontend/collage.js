function setup(){
    createCanvas(windowWidth, windowHeight)
}

function draw(){

}












window.bridge.data((event, data)=>{
    //console.log(data)
})

window.bridge.updateStatus((event, message)=>{
    console.log(message)
})

onkeydown = ()=>{
    window.bridge.saveImage()
}