let dataAssigned = false
let saveCooldown = true
let saveState = false

window.bridge.data((event, data)=>{
    readData(data)
})

function readData(data){
    if(saveCooldown){
        setTimeout(()=>{
            saveState = data[saveButton]
            saveCooldown = false
        },3000)
    }
    
    if(saveState != data[saveButton] && !saveCooldown){
        window.bridge.saveImage()
    }

    let r = map(data[backgroundRGB[0]], 0, 1023, 0, 255)
    let g = map(data[backgroundRGB[1]], 0, 1023, 0, 255)
    let b = map(data[backgroundRGB[2]], 0, 1023, 0, 255)
    backgroundColor = color(r,g,b)

    zOrder = [0,1,2,null,null,null]
    for(let l = 0; l < layerData.length; l++){
        if(data[layerData[l]] >= 0 && data[layerData[l]] <= 100){
            zOrder[3] = l;
            zOrder[l] = null;
        }else if(data[layerData[l]] >= 500 && data[layerData[l]] <= 600){
            zOrder[4] = l;
            zOrder[l] = null;
        }else if(data[layerData[l]] >= 900 && data[layerData[l]] <= 1000){
            zOrder[5] = l;
            zOrder[l] = null;
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
        layer.rotation = map(data[rotation], 0, 1023, 0, 360);
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