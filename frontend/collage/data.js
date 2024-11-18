/*----------------------------------------------------
This file maps the incomming data from the serialport
to variables and the coresponding layer objects
----------------------------------------------------*/

let dataAssigned = false
let saveCooldown = false
let saveState = 1
let saveFrameCount = 0
let firstSave = true

/*Gets called everytime data is recieved and sent over the preload script*/
window.bridge.data((event, data)=>{
    readData(data)
})

function readData(data){
    if(firstSave && data[saveButton] != undefined){
        saveState = data[saveButton]
        firstSave = false
    }

    if(saveState != data[saveButton] && !saveCooldown && data[saveButton] != undefined && saveFrameCount >= 20){
        window.bridge.saveImage()
        saveCooldown = true
        saveFrameCount = 0
        setTimeout(()=>{
            saveState = data[saveButton]
            saveCooldown = false
        },15000)
        saveState = data[saveButton]
    }else if(saveState != data[saveButton] && !saveCooldown && data[saveButton] != undefined && saveFrameCount < 20){
        saveFrameCount++
    }else{
        saveFrameCount = 0
    }

    if(saveCooldown){
        saveState = data[saveButton]
    }
    

    let r = map(data[backgroundRGB[0]], 1023, 0, 0, 255)
    let g = map(data[backgroundRGB[1]], 1023, 0, 0, 255)
    let b = map(data[backgroundRGB[2]], 1023, 0, 0, 255)
    backgroundColor = color(r,g,b)

    zOrder = [0,1,2,null,null,null]
    for(let l = 0; l < layerData.length; l++){
        if(data[layerData[l]] >= 40 && data[layerData[l]] <= 120){
            zOrder[l+3] = 0;
            zOrder[0] = null;
        }else if(data[layerData[l]] >= 121 && data[layerData[l]] <= 200){
            zOrder[l+3] = 1;
            zOrder[1] = null;
        }else if(data[layerData[l]] >= 201 && data[layerData[l]] <= 300){
            zOrder[l+3] = 2;
            zOrder[2] = null;
        }
    }


    assignSurfaceData(
        data,
        myBackground,
        backgroundImages,
        backgroundIsOn,
        backgroundImage,
        backgroundScale,
        backgroundJoystick);
   assignSurfaceData(
        data,
        foreground,
        foregroundImages,
        foregroundIsOn,
        foregroundImage,
        foregroundScale,
        foregroundJoystick);
    assignElementData(
        data,
        layerOne,
        layerOneImages, 
        layerOneIsOn,
        layerOneImage,
        layerOneScale,
        layerOneRotation,
        layerOneJoystick,
        layerOneBlendModes);
    assignElementData(
        data,
        layerTwo,
        layerTwoImages, 
        layerTwoIsOn,
        layerTwoImage,
        layerTwoScale,
        layerTwoRotation,
        layerTwoJoystick,
        layerTwoBlendModes);

        dataAssigned = true
}

function assignSurfaceData(data, layer, images, isOn, image, scale, joystick){
    if(data[isOn] == 1 && images.length > 0){
        layer.isOn = true;
        layer.image = images[round(map(data[image], 0, 1023, 0, images.length-1))];
        layer.scale = map(data[scale], 0, 1023, 1, surfaceMaxScale);
        layerMovement = [data[joystick[1]]-data[joystick[3]], data[joystick[2]]-data[joystick[0]]];
        layer.position.x += layerMovement[0]*joystickSpeed;
        layer.position.y += layerMovement[1]*joystickSpeed;
        layer.position.x = constrain(layer.position.x, 0, layer.image.width-(layer.image.width/layer.scale));
        layer.position.y = constrain(layer.position.y, 0, layer.image.height-(layer.image.height/layer.scale));
    }else{layer.isOn = false;}
}

function assignElementData(data, layer, images, isOn, image, scale, rotation, joystick, blendModeData){
    if(data[isOn] == 1 && images.length > 0){
        layer.isOn = true;
        layer.image = images[round(map(data[image], 0, 1023, 0, images.length-1))];
        let joystickData = [data[joystick[0]], data[joystick[1]], data[joystick[2]], data[joystick[3]]];
        joystickToPosition(joystickData, layer.position);
        layer.scale = map(data[scale], 0, 1023, elementMinScale, elementMaxScale);
        layer.rotation = map(data[rotation], 1023, 0, 0, 360);
        if (data[blendModeData[0]] == 1 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 1) {
            layer.blendMode = blendModes[0];
        }else if(data[blendModeData[0]] == 0 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 1){
            layer.blendMode = blendModes[1];
        }else if(data[blendModeData[0]] == 1 && data[blendModeData[1]] == 0 && data[blendModeData[2]] == 1){
            layer.blendMode = blendModes[2];
        }else if(data[blendModeData[0]] == 1 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 0){
            layer.blendMode = blendModes[3];
        }else{
            layer.blendMode = blendModes[0]
        }
    }else layer.isOn = false;
}

function joystickToPosition(joystick, position){
    joystickInput = [joystick[0]-joystick[2], joystick[1]-joystick[3]];
    position.x = constrain(position.x+=joystickInput[0]*joystickSpeed, 0, windowWidth);
    position.y = constrain(position.y+=joystickInput[1]*joystickSpeed, 0, windowHeight);
}


//-----QR Code-----//

var qrIMG = document.getElementById('qrIMG');
var qrCodeDiv = document.getElementById('QRCode');
var qrLoader = document.getElementById('qr-loader-bar');

window.bridge.qrLink((event, qrLink)=>{
    console.log('got something from the bridge:', qrLink)
    generateQR(qrLink);
})

//generate QRcode via webAPI
function generateQR(link) {
    if (link) {
        qrCodeDiv.classList.add('fade-in');
        qrLoader.classList.add('qr-fill');
        qrIMG.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + link;
        setTimeout(function() {
            qrCodeDiv.classList.remove('fade-in');
            qrLoader.classList.remove('qr-fill');
        }, 15000);
    } else {    
        console.error("Error. No QR link provided");
    }
}