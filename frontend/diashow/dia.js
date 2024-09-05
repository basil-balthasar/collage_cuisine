var image = document.getElementById('image');

//-----Dia Show-----//

//change images
async function changeImageSrc() {
    let savePath = await window.bridge.getDiaPath()

    //console.log("theres the url" + savePath);
    image.style.opacity = 0;
    setTimeout(() => {
        image.src = savePath;
        image.style.opacity = 1;
    }, 500); // duration of fade
}

setInterval(changeImageSrc, 10000); 