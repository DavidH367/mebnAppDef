// File generated by FlutterFire CLI.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyC8_FXyy0z855tWOwfyiLY7hNcbq6lKh1w',
    appId: '1:776894250115:web:ddcfc554d95282ad18efb6',
    messagingSenderId: '776894250115',
    projectId: 'mebnapp3',
    authDomain: 'mebnapp3.firebaseapp.com',
    databaseURL: 'https://mebnapp3-default-rtdb.firebaseio.com',
    storageBucket: 'mebnapp3.appspot.com',
    measurementId: 'G-TPQ9NSCP1G',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBk-f1gCk7zXbsjJuFE2FEdgYHUxG_zaPU',
    appId: '1:776894250115:android:d36f0615f5e52bb718efb6',
    messagingSenderId: '776894250115',
    projectId: 'mebnapp3',
    databaseURL: 'https://mebnapp3-default-rtdb.firebaseio.com',
    storageBucket: 'mebnapp3.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyDBnD4ny4a8BLy9yoTFhH3bStxcVLstJMg',
    appId: '1:776894250115:ios:d6a3ef41468c890c18efb6',
    messagingSenderId: '776894250115',
    projectId: 'mebnapp3',
    databaseURL: 'https://mebnapp3-default-rtdb.firebaseio.com',
    storageBucket: 'mebnapp3.appspot.com',
    iosBundleId: 'com.mebn',
  );
}
