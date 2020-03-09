# WillDo

See ['src/index.html'](src/index.html) for an overview of the project structure  
which centers around the ['app-root' component](src/app/app.component.html)  
the ['task-list' component](src/app/task-list/task-list.component.ts) is an example of a component we may re-use for difference scenarios i.e. multiple groups
Note: Angular routing (i.e. selecting different tasks etc. via URLS) has not yet been implemented

[Node.js](https://nodejs.org/en/download/) is needed to build the client   
use ['run'](run) instead of `ng serve` to start the client without needing `npm i` for the first build

Development Updates:
	- Added Node.js installation to maven's configuration settings
	- In dev mode, a proxy causes the client & server to share the same origin url, while still allowing for angular live reload
	- Data returned by the server is now auto-mapped to include object-oriented functionality to allow the reuse of common behaviors
	- when maven runs in production mode--i.e. by running `mvnw spring-boot:run -Pprod`--the client is built and deployed to the backend server
		(http://localhost:8080/ returns the angular app, while the api is at http://localhost:8080/api/)

## Development server

Run `ng serve` for a dev server. Navigate to ['http://localhost:4200/'](http://localhost:4200/). The app will automatically reload if you change any of the source files.

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
