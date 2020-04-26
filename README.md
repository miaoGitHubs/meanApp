# AngularApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## How to run project in local

Use one terminal for backend: goto \MEANApp\backend directory, and enter "npm start".
Use another terminal for frontend: goto \MEANApp directory, and enter "ng serve".

## How to deploy this project to heroku
1. Goto angular.json: "outputPath": "backend/angular",
2. Open terminal: ng build --prod
3. Login Heroku and commit change to it so that deploy it on Heroku:
1). heroku login
2). git add .
3). git commit -am "make it better"
4). git push heroku master
