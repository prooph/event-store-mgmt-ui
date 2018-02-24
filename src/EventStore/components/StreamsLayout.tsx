import * as React from 'react';
import {Grid, Segment, Sticky, Rail, Visibility, Message} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {Route, RouteComponentProps, Switch} from "react-router";
import {List} from "immutable";
import {Stream, Event, EventStore} from "../model";
import {StreamNav} from "./StreamNav";
import * as Routes from '../../routes';
import {render} from "react-dom";
import {NoStreamSelected} from "./NoStreamSelected";
import {StreamViewer} from "./StreamViewer";

export interface StreamsLayoutProps extends RouteComponentProps<{streamName?: Stream.StreamName}>, InjectedTranslateProps {
    baseUrl: string,
    httpApi: EventStore.EventStoreHttpApi,
    streams: List<Stream.Stream>,
    onGetOlderEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName, event: Event.DomainEvent) => void,
    onGetLatestEvents: (httpApi: EventStore.EventStoreHttpApi, streamName: Stream.StreamName) => void,
}

const getStream = (streams: List<Stream.Stream>, streamName: Stream.StreamName): Stream.Stream => {
    const stream = streams.find(lStream => lStream.name() === streamName) as Stream.Stream;

    return stream || new Stream.Stream({streamName})
}

export class StreamsLayout extends React.Component<StreamsLayoutProps, {contextRef: any, endOfStream: boolean}> {
    state = {contextRef: undefined, endOfStream: false}

    handleContextRef = contextRef => {
        this.setState({ contextRef })
    }

    handleBottomVisible = () => {
        if(this.state.endOfStream) {
            return;
        }

        const {streamName} = this.props.match.params;
        const stream = getStream(this.props.streams, streamName);

        if(stream.events().count()) {
            const lastEvent = stream.events().last();

            if(lastEvent.streamPosition() > 1) {
                this.props.onGetOlderEvents(this.props.httpApi, streamName, stream.events().last())
            } else {
                this.setState({endOfStream: true})
            }
        }
    }

    handleOnRefresh = (streamName: Stream.StreamName) => {
        console.log("get latest events");
        this.props.onGetLatestEvents(this.props.httpApi, streamName);
    }

    render() {
        const {contextRef} = this.state;

        const {streamName} = this.props.match.params;

        const content = (streamName)?
            <StreamViewer
                t={this.props.t}
                stream={getStream(this.props.streams, streamName)}
                style={{minHeight: window.innerHeight}}
                onRefresh={this.handleOnRefresh}
            />
            :
            <NoStreamSelected t={this.props.t}/>;

        return <Grid centered columns={2}>
            <Grid.Column width={10}>
            <div ref={this.handleContextRef}>
                <Segment>
                    <Visibility onBottomVisible={this.handleBottomVisible} once={false}>
                    {content}
                    {this.state.endOfStream &&
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
                            />
                        </Sticky>
                    </Rail>
                </Segment>
            </div>
            </Grid.Column>
        </Grid>
    }
}