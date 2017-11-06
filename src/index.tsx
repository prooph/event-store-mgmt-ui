import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Layout from './Layout';
import * as Routes from './routes';
import createSagaMiddleware from 'redux-saga';
import notify from './notify';
import reducer, { State, INITIAL_STATE } from './reducer';
import registerServiceWorker from './registerServiceWorker';
import rootSaga from './saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createHashHistory } from 'history';
import { createStore, applyMiddleware, StoreEnhancer } from 'redux';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { Route, Switch, Router } from 'react-router';

import Overview from './Overview';
import './theme/semantic/semantic.css';
import './theme/css/style.css';

//Load translations with i18next webpack loader to avoid extra web requests
import * as i18next from 'i18next';

const resources = require('i18next-resource-store-loader!./i18n/index.js');

const i18n = i18next
    .init({
        lng: navigator.language || navigator['userLanguage'], // set dynamically on build
        fallbackLng: 'en',

        resources: resources,
        debug: true,

        interpolation: {
            escapeValue: false // not needed for react!!
        },
    });

// if (module.hot) {
//     module.hot.accept('i18next-resource-store-loader!./i18n/index.js', () => {
//         const res = require('i18next-resource-store-loader!./i18n/index.js');
//         Object
//             .keys(res)
//             .forEach((lang) => {
//                 Object
//                     .keys(res[lang])
//                     .forEach((namespace) => {
//                         i18next.addResourceBundle(lang, namespace, res[lang][namespace], true, true );
//                     })
//                 ;
//             })
//         ;
//
//         module.hot.emit('loaded');
//     });
// }

const sagaMiddleware = createSagaMiddleware();

const history = createHashHistory();

const store = createStore(
    reducer,
    INITIAL_STATE,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware) as StoreEnhancer<State>,
    ) as StoreEnhancer<State>,
);

sagaMiddleware.run(rootSaga as any);

// The Main component renders one of provided
// Routes (provided that one matches).
const Main = () => (
    <Switch>
        <Route exact path={Routes.rootPath} component={Overview}/>
    </Switch>
);

const Root = () => (
    <Layout.Sidebar>
        <Main/>
    </Layout.Sidebar>
);

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
            <Router history={history}>
                <Root/>
            </Router>
        </Provider>
    </I18nextProvider>,
    document.getElementById('root'),
);
notify();
registerServiceWorker();
