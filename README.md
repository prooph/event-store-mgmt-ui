# PROOPH EVENT STORE MGMT UI


## Work In Progress

The ES-Mgmt-UI is under heavy development. If you are interested you can install it and
explore it of your own. More information is provided later when we have a first working version.

## react-semantic-ui
React + Redux + Semantic UI Frontend

Based on [wmonk/create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) but it's ejected for customization.

This application uses [semantic ui themes](https://semantic-ui.com/usage/theming.html). Take a look at the `semantic` folder.
**Note:** We have to copy the themes from the nodes_modules package `semantic-ui` to `semantic` manually after updates to get the latest assets.

## Configuration
After you have copied these sources to your project you may want to change some default values.
This is a list of files which contains default values.

- `app.env.dist`: url
- `config/webpack.config.dev.js`: `publicPath` and `publicUrl` settings
- `config/webpack.config.prod.js`: URL pattern for service worker
- `config/webpackDevServer.config.js`: `public` and `allowedHosts` settings
- `package.json`: change name
- `public/index.html`: change title
- `public/manifest.json`: change name
- `src/api/ConfiguredAxios.ts`: base API url
- `src/notify.tsx`: change logo
- `src/reducer.ts`: add your reducers
- `src/registerServiceWorker.ts`: notification text

## Frontend build
We have a two stage build.

> All assets are put to `src/theme` folder and referenced via TS files. The webpack loader does the rest.

- First we have to build semantic ui theme which is used in `index.ts` file and compiled to `src/theme/semantic`
  - If you change something in the `semantic` folder you have to compile the semantic theme and after that the react app.
- Second we build our react application

## Prerequisites
You have to manually install the dependencies and to compile the semantic ui theme.

```bash
docker run --rm --env-file=app.env.dist -i -v $(pwd):/app sandrokeil/typescript yarn install

docker run --rm --env-file=app.env.dist -i -p 4000 -p 3000 -v $(pwd):/app sandrokeil/typescript yarn run semantic
```

Now you can start the development server and open [http://localhost:3000/](http://localhost:3000/) in your favourite browser.

```
$ docker run --rm --env-file=app.env.dist -i -p "4000:4000" -p "3000:3000" -v $(pwd):/app sandrokeil/typescript yarn start
```

## Testing
```
docker run --rm --env-file=app.env.dist -i -v $(pwd):/app sandrokeil/typescript yarn test
```

## Production build
```
docker run --rm --env-file=app.env.dist -i -v $(pwd):/app sandrokeil/typescript yarn run build
```

## Browser extensions

- Install [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension)
- Install [react-extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
