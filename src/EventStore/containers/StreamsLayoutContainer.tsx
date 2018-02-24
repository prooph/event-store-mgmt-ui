import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {InjectedTranslateProps, translate} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router";
import {Stream, Event, EventStore} from "../model";
import {List} from "immutable";
import {StreamsLayout} from "../components/StreamsLayout";
import {StreamsSelector} from "../selectors";
import { Dispatch } from '../../types/types';
import {Query, Cmd} from '../actions';

interface StateProps extends InjectedTranslateProps {
    streams: List<Stream.Stream>,
}

interface PropsToDispatch {
    onGetOlderEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, event: Event.DomainEvent) => void,
    onGetLatestEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName) => void,
    onStreamSelected: (streamName: Stream.StreamName) => void
}

interface OwnProps extends RouteComponentProps<{streamName?: Stream.StreamName}> {
    baseUrl: string,
    httpApi: EventStore.EventStoreHttpApi,
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onGetOlderEvents: Query.getOlderStreamEvents,
        onGetLatestEvents: Query.getLatestStreamEvents,
        onStreamSelected: Cmd.setSelectedStream
    } as any, dispatch);
};

const StreamsLayoutContainer = connect<StateProps, PropsToDispatch, OwnProps>(StreamsSelector.makeMapStateToPropsStreamsLayout(), mapDispatchToProps, undefined, {pure: false})(StreamsLayout);

export default withRouter(translate('translation')(StreamsLayoutContainer));