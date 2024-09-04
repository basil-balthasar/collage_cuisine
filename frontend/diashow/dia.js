var image = document.getElementById('image');

var savePath;

//-----Dia Show-----//

window.bridge.osFilePath().then(osFilePath => {
    savePath = osFilePath;
})

//change images
function changeImageSrc() {
    console.log("theres the url" + savePath);
    image.style.opacity = 0;
    setTimeout(() => {
        image.src = savePath;
        image.style.opacity = 1;
    }, 500); // duration of fade
}
setInterval(changeImageSrc, 10000); 