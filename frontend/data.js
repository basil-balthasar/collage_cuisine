window.bridge.data((event, data)=>{
    readData(data)
})

function readData(data){
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
}

function assignSurfaceData(data, layer, images, isOn, image, scale, joystick){
    if(data[isOn] == 1){
        layer.isOn = true;
        layer.image = images[round(map(data[image], 0, 1023, 0, images.length-1))];
        layer.scale = map(scale, 0, 1023, 1, 2);
        layerMovement = [data[joystick[3]]-data[joystick[1]], data[joystick[0]]-data[joystick[2]]];
        layer.position.x -= layerMovement[0];
        layer.position.y -= layerMovement[1];
        layer.position.x = constrain(layer.position.x, -layer.image.width*layer.scale, 0);
        layer.position.y = constrain(layer.position.y, -layer.image.height*layer.scale, 0);
    }else{layer.isOn = false;}
}

function assignElementData(data, layer, images, isOn, image, scale, rotation, joystick, blendModeData){
    if(data[isOn] == 1){
        layer.isOn = true;
        layer.image = images[round(map(data[image], 0, 1023, 0, images.length-1))];
        joystickData = [data[joystick[3]], data[joystick[1]], data[joystick[0]], data[joystick[2]]];
        joystickToPosition(joystickData, layer.position);
        layer.scale = map(data[scale], 0, 1023, 0.3, 1);
        layer.rotation = map(data[rotation], 0, 1023, 0, 360);
        if (data[blendModeData[0]] == 1 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 1) {
            layer.blendMode = blendModes[0];
        }else if(data[blendModeData[0]] == 0 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 1){
            layer.blendMode = blendModes[1];
        }else if(data[blendModeData[0]] == 1 && data[blendModeData[1]] == 0 && data[blendModeData[2]] == 1){
            layer.blendMode = blendModes[2];
        }else if(data[blendModeData[0]] == 1 && data[blendModeData[1]] == 1 && data[blendModeData[2]] == 0){
            layer.blendMode = blendModes[3];
        }
    }else layer.isOn = false;
}

function joystickToPosition(joystick, position){
    joystickInput = [joystick[0]-joystick[1], joystick[2]-joystick[3]];
    position.x = constrain(position.x+=joystickInput[0]*joystickSpeed, 0, width);
    position.x = constrain(position.y+=joystickInput[1]*joystickSpeed, 0, height);
}