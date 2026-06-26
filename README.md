# FREAS Modeller

This project integrates the `freas-bpmn4frss-library` and offers a typed `Bpmn4FrssEditor` to use within any TypeScript-based React project (vanilla JS will be supported once both the library and this integration are finalised and released as NPM packages).

## Prerequisites

- Node 18 LTS with `npm` (tested with Node version 18.16.0 and `npm` version 9.6.6)
- Free port 8000 (can be changed by modifying the code in the file `vite.config.ts`)

## Running Modeller Locally

To run in conjuction with the React application, install the dependencies for this project (`freas-modeller`):

```sh
cd path_to_the_library/freas-modeller
npm i
```

Then, head over to the `freas-bpmn4frss-library` and follow the instructions. These two libraries have to be located somewhere in the file system and linked together (as they are not yet released as npm packages). Both libraries have to have their dependencies installed for the code to compile. The `freas-bpmn4frss-library` provides the modelling core of the library, while the modeller allows mounting the library onto React web pages and adds the ability to make requests to external validators.

After linking the libraries, the last step is to start this application by running the start command in this project's folder:

```sh
npm start -- --host 'localhost' --port 8000
```

This starts a web server listening on port 8000.


> Note: currently not transpiled to regular JavaScript, so it only works with React projects that use TypeScript and are able to transpile it themselves.