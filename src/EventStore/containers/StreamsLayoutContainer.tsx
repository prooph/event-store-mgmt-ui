import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {InjectedTranslateProps, translate} from "react-i18next";
import {RouteComponentProps, withRouter} from "react-router";
import {Stream, Event, EventStore, Filter} from "../model";
import {List} from "immutable";
import {StreamsLayout} from "../components/StreamsLayout";
import {StreamsSelector} from "../selectors";
import { Dispatch } from '../../types/types';
import {Query, Cmd} from '../actions';

interface StateProps extends InjectedTranslateProps {
    streams: List<Stream.Stream>,
}

interface PropsToDispatch {
    onGetOlderEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, event: Event.DomainEvent, filters: List<Filter.StreamFilter>) => void,
    onGetLatestEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName) => void,
    onGetFilteredEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
    onStreamSelected: (streamName: Stream.StreamName) => void,
    onShowFilterBox: (streamName: Stream.StreamName, show: boolean) => void,
}

interface OwnProps extends RouteComponentProps<{streamName?: Stream.StreamName}> {
    baseUrl: string,
    httpApi: EventStore.EventStoreHttpApi,
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onGetOlderEvents: Query.getOlderStreamEvents,
        onGetLatestEvents: Query.getLatestStreamEvents,
        onGetFilteredEvents: Query.getFilteredStreamEvents,
        onStreamSelected: Cmd.setSelectedStream,
        onShowFilterBox: Cmd.showFilterBox,
    } as any, dispatch);
};

const StreamsLayoutContainer = connect<StateProps, PropsToDispatch, OwnProps>(StreamsSelector.makeMapStateToPropsStreamsLayout(), mapDispatchToProps, undefined, {pure: false})(StreamsLayout);

export default withRouter(translate('translation')(StreamsLayoutContainer));