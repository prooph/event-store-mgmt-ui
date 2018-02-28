import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import {RouteComponentProps} from 'react-router';
import {Containers} from "./EventStore/index";
import * as Routes from './routes';
import {Model as EventStoreModel} from './EventStore/index';

interface WatchersProps extends RouteComponentProps<{watcherId?: EventStoreModel.Watcher.Id}>, InjectedTranslateProps {
}

class Watchers extends React.Component<WatchersProps, undefined>{
    render() {
        return <Containers.WatchersLayoutContainer
            baseUrl={Routes.watchersPath.link(null)}
            match={this.props.match}
            location={this.props.location}
            history={this.props.history}
        />
    }
}

export default translate('translation')(Watchers);