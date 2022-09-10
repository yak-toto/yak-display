# Yak-toto frontend

## Requisites

- Ubuntu 22.04
- Vuejs 3.2.13

## How to build the project

### Frontend

Frontend is using VueJS. Run `npm install` to install all packages needed. For both development and production, a environment variable is needed to target the correct url of the backend. Put it in `.env` file. For development, the value is `NODE_ENV=development` and for production `NODE_ENV=production`.

In local development, you can a test your frontend with `npm run serve`. For production, run `npm run build` to build your project. It minifies your project and put it in `dist` folder. For more informations, please refer to [Configuration Reference](https://cli.vuejs.org/config/).

