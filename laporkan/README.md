# Laporkan

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

## Environment Variables
make `environments` folder in `src` folder, then create `environment.ts` file in `environments` folder. Then add this code to `environment.ts` file.

```typescript
export const environment = {
    firebaseConfig : {
        apiKey: "AIzaSyCcPDPfL97MkHlMxgI_pt9C7wvNAlzYvNM",
        authDomain: "laporkan-ed567.firebaseapp.com",
        projectId: "laporkan-ed567",
        storageBucket: "laporkan-ed567.appspot.com",
        messagingSenderId: "777602158556",
        appId: "1:777602158556:web:6b9a782ba2f2b71e354919",
        measurementId: "G-J42J1HF8MV"
    },
    production: false
};
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
