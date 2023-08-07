// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

//Muy importante entender que en este archivo se relacionan los parámetros generados por Firebase
export const environment = {
  production: false,
  FIREBASE_CONFIG:{
    apiKey: "AIzaSyDgqtO5foz0PbReFS6wCTrSiIZvi7R9cpA",
    authDomain: "test2-9b33d.firebaseapp.com",
    projectId: "test2-9b33d",
    storageBucket: "test2-9b33d.appspot.com",
    messagingSenderId: "416600815584",
    appId: "1:416600815584:web:4b4e693ec97d7c161d9d85",
    measurementId: "G-T0M6EYVGC8"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
