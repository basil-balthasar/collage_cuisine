const screenshotNames = ["test2.png", "test3.png", "test4.png"];
var image = document.getElementById('image');
var imgIMG = document.getElementById('qrIMG');

var link = screenshotNames[screenshotNames.length - 1];

//interval between images
setInterval(changeImageSrc, 10000); 

generateQR();

function changeImageSrc() {
    const randomNr = Math.floor(Math.random() * screenshotNames.length);

    // Start the fade-out effect
    image.style.opacity = 0;
    setTimeout(() => {
        image.src = "../../backend/screenshots/" + screenshotNames[randomNr];
        image.style.opacity = 1;
    }, 500); // duration of fade
}

//generate QRcode via webAPI
function generateQR() {
    if (link) {
        qrIMG.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://guuydhldgjexrbvozxeb.supabase.co/storage/v1/object/public/Collages/collages/" + link;
    } else {
        console.error("Link not defined");
    }
}