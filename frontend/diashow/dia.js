var screenshotNames = [];
var image = document.getElementById('image');
var qrIMG = document.getElementById('qrIMG');

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

//-----QR Code-----//

window.bridge.qrLink((event, qrLink)=>{
    console.log('QR code link:', qrLink)
    generateQR(qrLink);
})

//retrieve image URL
// window.bridge.qrLink().then(qrLink => {
//     console.log('QR code link:', qrLink)
//     generateQR(qrLink);
// })

//generate QRcode via webAPI
function generateQR(link) {
    if (link) {
        qrIMG.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + link;
    } else {
        console.error("Error. No QR link provided");
    }
}