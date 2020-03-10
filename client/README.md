# WillDo

This application mainly consists of script files located in the `src/app` folder  
which stores the main ['app-root' component](src/app/app.component.ts) 

Each functionality (i.e. tasks, groups) consists of multiple UI components `*.component` that share a class `*-class`
and communicate with the server through its service `*.service`

the ['group-list' component](src/app/groups/group-list.component.ts) is an example of a component with data-binding and router navigation


Development Updates:   
	- In dev mode, a proxy causes the client & server to share the same origin url, while still allowing for angular live reload   
	- Data returned by the server is auto-mapped to include object-oriented functionality, allowing the reuse of common behaviors   
	- when maven runs in production mode--i.e. `mvnw spring-boot:run -Pprod`--the client is built & deployed to the backend   
		(http://localhost:8080/ returns the angular app, while the api is at http://localhost:8080/api/)   
	- Simpler project structure where classes are grouped by functionality and each UI component's html & css is inside it's `.ts` file  

Note: [Node.js](https://nodejs.org/en/download/) and package dependencies are installed with maven  
      Most proxy errors can be completely ignored if ever encountered


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
