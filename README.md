# Parts Pedigree app

# Prerequisistes

## Common
* [Node.js](https://nodejs.org/en/download/)
* [Watchman](https://facebook.github.io/watchman/docs/install.html)

## iOs

* [Xcode](https://developer.apple.com/download/)

## Android

* [Java SE Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

* [Android Studio](https://developer.android.com/studio/index.html). Choose a "Custom" setup when prompted to select an installation type. Make sure the boxes next to all of the following are checked:
    * Android SDK
    * Android SDK Platform
    * Performance (Intel ® HAXM)
    * Android Virtual Device

## More info    

To get more, open link: https://facebook.github.io/react-native/docs/getting-started.html.

![React-Native setup docs](docs/react-native-docs-build-setup.png)

Choose tab `Building Projects with Native Code` and select appropriate `Development OS` and `Target OS`.

# Build and run the app

## Fast and easy

### iOs

`npm run emulate-ios`

![partspedigree-splaschreen](docs/partspedigree-splaschreen.png)
![partspedigree-signin-screen-ios](docs/partspedigree-signin-screen-ios.png)

### Android

`npm run emulate-android`

![partspedigree-signin-screen-android](docs/partspedigree-signin-screen-android.png) 

## Advanced

### iOs

* Open `ios/PartsPedigree.xcodeproj` project dir with Xcode, right from the console: `open ios/PartsPedigree.xcodeproj`

![Xcode project](docs/xcode-project.png)

* Press `run` button in top left corner of Xcode's window.

![xcode-target-device](docs/xcode-target-device.png)


* One may choose target device: real connected iOs device or simulator:

![xcode-target-device-options](docs/xcode-target-device-options.png)

### Android

* Open `android` dir with Android Studio

![Android Studio project](docs/android-studio-project.png)

* Press `run` on `debug` button on Run/Debug palette:

![android-studio-run-debug-btns](docs/android-studio-run-debug-btns.png)

# Release

## iOs
 
* Open `ios/PartsPedigree.xcodeproj` project dir with Xcode.
* Choose `Generic iOs device` as target device:

![xcode-target-device](docs/xcode-target-device.png)
![xcode-target-device-options](docs/xcode-target-device-options.png)

* Run `archive target` with Xcode main menu:

![main-menu-archive](docs/main-menu-archive.png)

* Wait for archive process to finish. Archives organizer open up:

![xcode-organizer-archives](docs/xcode-organizer-archives.png)

* Press `Upload to App Store...` to send the arvice to iTunesConnect portal:

![xcode-upload-archive-step1](docs/xcode-upload-archive-step1.png)
![xcode-upload-archive-step2](docs/xcode-upload-archive-step2.png)
![xcode-upload-archive-step3](docs/xcode-upload-archive-step3.png)
![xcode-upload-archive-step4](docs/xcode-upload-archive-step4.png)
![xcode-upload-archive-step5](docs/xcode-upload-archive-step5.png)

* Then go through [iTunesConnect](https://itunesconnect.apple.com) web portal to setup TestFlight or publish a release.

## Android

* Check and increments app's version in file `android/app/build.gradle`

```
android {
    ...
    defaultConfig {
        ...
        versionCode 1
        versionName "1.0"
    }
```

* Build release with command: `release-android`.
* Get apk `android/app/build/outputs/apk/app-release.apk` and upload it into Google.Play store.

# Quirks

No quirks yet :)