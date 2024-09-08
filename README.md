# Collage Cuisine

## Setup

- Clone or download repository
- Run npm install
- Create a "dist" folder in the root directory

## Commands

- **npm run dev:watch**
  runs the app using nodemon so saving changes will reload the app automatically, also --trace-warnigs is used.
- **npm run start**
  will start the app
- **npm run dist**
  will build the app into the dist folder

## Build

Use **npm run dist** to build the app into the "dist" folder. On windows you need to run power shell with admin rights for it to create proper code signing.
By default electron-builder will always build the app for the current OS. You can change the build settings by adjusting the **package.json** file. For more information visit [electron.build](https://www.electron.build)

## Autoupdate

Electron-updater will automatically look for the latest release on GitHub and compare the version to the version specified in the package.json. If there is a newer version available it will download it and install it automatically when the app closes. This will only work for windows without proper apple developer code signing. On MacOs a pop up will notify the user that there is a newer version available to be downloaded manually. To create a release that is valid for autoupdate follow these steps:

- Adjust the version number in the package.json file to be the version you are intending to upload.
- Push your commits to GitHub
- Using windows power shell as admin, run **npm run dist** in the root directory of the project. You can also build for windows on macOS, for more information visit [electron.build](https://www.electron.build/tutorials/code-signing-windows-apps-on-unix)
- In the dist folder **replace all space characters in the filenames with a "-"** as GitHub will replace them with a dot but electron-updater is looking for "-". **Not changing them will result in a 404** when trying to download the update since it can not find the files its looking for.
- On GitHub draft a new release.
- Use the version number you entered in package.json with the "v" prefix as a tag. So for "version": "1.0.1" use "v1.0.1".
- You are free to choose a title and a description for the release.
- Upload all the files from the dist folder except for the unpacked folder. Make sure to double check no space characters have been replaced with a dot.
- Publish the release and you are good to go.

The app will now find the latest release and if the version number in the tag is higher it will automatically download and install it.
