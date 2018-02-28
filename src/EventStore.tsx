import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import {RouteComponentProps} from 'react-router';
import {Containers} from "./EventStore/index";
import * as Routes from './routes';
import {EventStore as EventStoreModel} from './EventStore/model';

export const withHttpApi = (httpApi: EventStoreModel.EventStoreHttpApi) => BaseComponent => {
    class withHttpApiComponent extends React.Component {
        // componentWillReceiveProps(nextProps) {
        //     // not 100% sure about using `location.key` to distinguish between routes
        //     if (nextProps.location.key !== this.props.location.key) {
        //         routeOnEnterCallback(nextProps)
        //     }
        // }

        render() {
            return <BaseComponent httpApi={httpApi} {...this.props} />
        }
    }

    return withHttpApiComponent
}


interface EventStoreProps extends RouteComponentProps<{streamName?: string}>, InjectedTranslateProps {
    httpApi: EventStoreModel.EventStoreHttpApi,
}

class EventStore extends React.Component<EventStoreProps, undefined>{
    render() {
            return <Containers.StreamsLayoutContainer
                baseUrl={Routes.eventStorePath.link(null)}
                httpApi={this.props.httpApi}
                match={this.props.match}
                location={this.props.location}
                history={this.props.history}
            />
    }
}

export default translate('translation')(EventStore);