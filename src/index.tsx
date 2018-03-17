import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Layout from './Layout';
import * as Routes from './routes';
import { Segment} from 'semantic-ui-react';
import {Map} from 'immutable';
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
import { Route, Switch, Router, Redirect } from 'react-router';
import { withRouteOnEnter } from './router';
import MessageFlow from "./MessageFlow";
import {MessageFlow as MessageFlowModel} from "./MessageFlow/model/MessageFlow"
import Notifications from "./NotificationSystem/containers/NotificationsContainer";
import EventStore, {withHttpApi} from "./EventStore";
import Watchers from "./Watchers";
import {Actions as EventStoreActions, WATCHERS_PATH, Model as EventStoreModel} from "./EventStore/index";
import {EventStoreHttpApi} from "./EventStore/index";
import * as $ from 'jquery';
import * as cytoscape from 'cytoscape';
import * as gridGuide from 'cytoscape-grid-guide'

import Overview from './Overview';
import './theme/semantic/semantic.css';
import './theme/css/style.css';

//Initialize cytoscape plugins (plugins are enabled globally)
gridGuide(cytoscape, $);

//Load translations with i18next webpack loader to avoid extra web requests
import * as i18next from 'i18next';

//Local storage
import {PATH_MESSAGE_FLOW} from "./MessageFlow/reducers/index";
import {loadMessageFlow, saveMessageFlow, loadWatchers, saveWatchers} from "./core/localStorage";

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

const initialState = INITIAL_STATE.set(PATH_MESSAGE_FLOW, loadMessageFlow())
    .setIn(WATCHERS_PATH, loadWatchers());

console.log("initial state", initialState.toJSON());

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(
        applyMiddleware(sagaMiddleware) as StoreEnhancer<State>,
    ) as StoreEnhancer<State>,
);

//Register localStorage sync
store.subscribe(() => {
    const messageFlow: MessageFlowModel = store.getState().get(PATH_MESSAGE_FLOW) as MessageFlowModel;
    saveMessageFlow(messageFlow);

    const watchers: Map<string, EventStoreModel.Watcher.Watcher> = store.getState().getIn(WATCHERS_PATH) as Map<string, EventStoreModel.Watcher.Watcher>;
    saveWatchers(watchers);
})

const backends = JSON.parse(process.env.BACKENDS);
const httpApi = new EventStoreHttpApi(backends.default.eventStoreBaseUrl);


sagaMiddleware.run(rootSaga as any, httpApi, history);

store.dispatch(EventStoreActions.Query.getInitialStreamList(httpApi));

// The Main component renders one of provided
// Routes (provided that one matches).
const Main = () => (
    <Switch>
        <Redirect exact path={Routes.rootPath} to={Routes.overviewPath}/>
        <Route exact path={Routes.overviewPath} component={Overview}/>
        <Route path={Routes.eventStorePath.route} component={withHttpApi(httpApi)(EventStore)}/>
        <Route path={Routes.watchersEventDetailsPath.route} component={Watchers}/>
        <Route path={Routes.watchersPath.route} component={Watchers}/>
        <Route exact path={Routes.messageFlowPath} component={MessageFlow}/>
    </Switch>
);

const Root = () => (
    <Segment>
        <Layout.TopMenu />
        <Main/>
        <Notifications maxMessages={4} />
    </Segment>
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
