# Recipe app 👨‍🍳

Keep a record for your secret recipes in the cloud

## Overview

This application allows for creating, editing, deleting and listing recipes with their respective ingredients.

## Setup

```sh
# Install dependencies
yarn

# Run a development server
yarn start
```

## Run tests

```sh
yarn test
```

## Requirements

This application is currently intended to work in a local environment pointing to a backend service hosted in `http://localhost:8000` with the code from [backend repo](https://github.com/victor-travelperk/tk-backend-exercise)

This is configuered in `src/shared/constants.ts`

## Project structure

The project is structure by packages. They are:

- app: Shell of the application that ties together routes and basic markup.
- recipes: Everything related to the recipe entity.
- shared: a package with shared functionality for other packages.

### How each package is structure

- General: Every folder should ideally offer a single point of entry via an `index.[ts][tsx]` file that exposes an API to other packages.
- Screens: At the root level you'll find the different screens like "CreateRecipe" or "EditRecipe". These are supposed to be used as routes by the app package.
- components: All components used for the screen components are located here.
- tests: All tests are located here. There is one file per screen component.

## Commit messages

Follow [semmantic commit](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for your commit messages

## Testing

_NOTE_: To mock network calls, `fetch-mock` is used. There is no need to reset the mock manually since this is done in the `src/__mocks__` folder. Using this library requires `node-fetch` as a pair dependency.
