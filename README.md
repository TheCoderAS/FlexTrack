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
cd add
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
cd cordova
```

```
cp res/* platforms/android/app/src/main/res
```
Run on emulator.
```
cordova run android 
```
Run on ADB devices
```
cordova run android --device
```

## Deployment

```
cordova build android --release -- --packageType=apk
```

```
keytool -genkey -v -keystore release-key.keystore -alias com.flextrack.app -keyalg RSA -keysize 2048 -validity 10000
```

```
~/Android/Sdk/build-tools/34.0.0/zipalign -f -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/app-release-aligned.apk
```

```
~/Android/Sdk/build-tools/34.0.0/apksigner sign -ks release-key.keystore --ks-key-alias com.flextrack.app platforms/android/app/build/outputs/apk/release/app-release-aligned.apk
```