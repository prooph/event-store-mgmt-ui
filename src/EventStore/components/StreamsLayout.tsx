import * as React from 'react';
import {Grid, Segment, Sticky, Rail, Visibility, Message} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {RouteComponentProps} from "react-router";
import {List} from "immutable";
import {Stream, Event, EventStore, Filter, Watcher} from "../model";
import {StreamNav} from "./StreamNav";
import {NoStreamSelected} from "./NoStreamSelected";
import {StreamViewer} from "./StreamViewer";

export interface StreamsLayoutProps extends RouteComponentProps<{streamName?: Stream.StreamName}>, InjectedTranslateProps {
    baseUrl: string,
    httpApi: EventStore.EventStoreHttpApi,
    streams: List<Stream.Stream>,
    existingWatchers: List<Watcher.Watcher>,
    onShowFilterBox: (streamName: Stream.StreamName, show: boolean) => void,
    onGetOlderEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, event: Event.DomainEvent, filters: List<Filter.StreamFilter>) => void,
    onGetLatestEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName) => void,
    onGetFilteredEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
    onStreamSelected: (streamName: Stream.StreamName) => void,
    onAddWatcher: (watcherId: Watcher.Id, watcherName: Watcher.Name, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
    onAppendToWatcher: (watcherId: Watcher.Id, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
}

const getStream = (streams: List<Stream.Stream>, streamName: Stream.StreamName): Stream.Stream => {
    const stream = streams.find(lStream => lStream.name() === streamName) as Stream.Stream;

    return stream || new Stream.Stream({streamName})
}

export class StreamsLayout extends React.Component<StreamsLayoutProps, {contextRef: any}> {
    state = {contextRef: undefined}

    //Internal cache, not part of state bc component should not rerender if changed internally
    unsavedFilters: boolean

    componentDidMount() {
        this.unsavedFilters = false
        const streamName = this.props.match.params.streamName || null;

        if(streamName) {
            const stream = getStream(this.props.streams, streamName);

            if(stream.filters().count()) {
                this.props.onGetFilteredEvents(this.props.httpApi, stream.name(), stream.filters());
            } else {
                this.props.onGetLatestEvents(this.props.httpApi, stream.name());
            }
        }
    }

    handleContextRef = contextRef => {
        this.setState({ contextRef })
    }

    handleShowFilterBox = (streamName: Stream.StreamName, show: boolean): void => {
        if(!show) {
            this.unsavedFilters = false;
        }

        this.props.onShowFilterBox(streamName, show);
    }

    handleChangeUnsavedFilters = (unsavedFilters: boolean) => {
        this.unsavedFilters = unsavedFilters
    }

    handleBottomVisible = () => {
        if(this.unsavedFilters) {
            return;
        }

        const {streamName} = this.props.match.params;
        const stream = getStream(this.props.streams, streamName);

        if(stream.canHaveOlderEvents()) {
            this.props.onGetOlderEvents(this.props.httpApi, streamName, stream.events().last(), stream.filters())
        }
    }

    handleOnRefresh = (stream: Stream.Stream) => {
        if(stream.filters().count()) {
            this.props.onGetFilteredEvents(this.props.httpApi, stream.name(), stream.filters());
        } else {
            this.props.onGetLatestEvents(this.props.httpApi, stream.name());
        }
    }

    handleFilterSubmit = (streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => {
        this.props.onGetFilteredEvents(this.props.httpApi, streamName, filters);
    }

    render() {
        const {contextRef} = this.state;

        const {streamName} = this.props.match.params;

        const content = (streamName)?
            <StreamViewer
                t={this.props.t}
                stream={getStream(this.props.streams, streamName)}
                style={{minHeight: window.innerHeight}}
                existingWatchers={this.props.existingWatchers}
                onShowFilterBox={this.handleShowFilterBox}
                onRefresh={this.handleOnRefresh}
                onFilterSubmit={this.handleFilterSubmit}
                onChangeUnsavedFilters={this.handleChangeUnsavedFilters}
                onAddWatcher={this.props.onAddWatcher}
                onAppendToWatcher={this.props.onAppendToWatcher}
            />
            :
            <NoStreamSelected t={this.props.t} style={{minHeight: window.innerHeight}}/>;

        return <Grid centered columns={2}>
            <Grid.Column width={10}>
            <div ref={this.handleContextRef}>
                <Segment>
                    <Visibility onBottomVisible={this.handleBottomVisible} once={false}>
                    {content}
                    {streamName && !getStream(this.props.streams, streamName).canHaveOlderEvents() &&
                    <Message color="grey">{ this.props.t('app.eventStore.streams.end') }</Message>
                    }
                    </Visibility>
                    <Rail position="right">
                        <Sticky active context={contextRef}>
                            <StreamNav
                                baseUrl={this.props.baseUrl}
                                streams={this.props.streams}
                                t={this.props.t}
                                activeStream={this.props.match.params.streamName || null }
                                onStreamSelected={this.props.onStreamSelected}
                            />
                        </Sticky>
                    </Rail>
                </Segment>
            </div>
            </Grid.Column>
        </Grid>
    }
}