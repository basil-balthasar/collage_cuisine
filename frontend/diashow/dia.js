var screenshotNames = [];
var image = document.getElementById('image');

//-----Dia Show-----//

//retrieve all filenames in screenshot folder
window.bridge.fileNames().then(fileNames => {
    screenshotNames = fileNames;
    console.log('files in dir:', screenshotNames)
})

//change images
function changeImageSrc() {
    const randomNr = Math.floor(Math.random() * screenshotNames.length);
    image.style.opacity = 0;
    setTimeout(() => {
        image.src = "../../backend/screenshots/" + screenshotNames[randomNr];
        image.style.opacity = 1;
    }, 500); // duration of fade
}
setInterval(changeImageSrc, 10000); 