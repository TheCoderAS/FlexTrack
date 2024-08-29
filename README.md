# Project Requirements

## Development
1. Node.js (18.20.4)
```
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install build-essential
```
2. Angular CLI (17.3.3)
```
sudo npm install -g @angular/cli
```

3. Cordova CLI (12.0.0)
```
 sudo npm install -g cordova
 ```

## Running Locally
```
cd Fitness-Tracker
```
```
npm install
```
```
npm start
```

## Building
Setup Android Studio and SDK. [Android Studio Installation](https://developer.android.com/studio/install?_gl=1*1lml3q0*_up*MQ..&gclid=CjwKCAjwuMC2BhA7EiwAmJKRrDvZh1S3SIkc5w4m6UX79xem3hR6mXWHYhwD9QaCv7gWri1EcFLtBRoCyQ8QAvD_BwE&gclsrc=aw.ds#linux)

```
cd Fitness-Tracker
```
```
cordova add platform android
```

```
cp res/* platforms/android/app/src/main/res
```
```
npm run build
```
Run on emulator.
```
cordova run android 
```
Run on ADB devices
```
cordova run android --device
```