import * as React from "react";
import {Map, List} from "immutable";
import {Grid, Segment, Sticky, Rail, Visibility, Message} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {RouteComponentProps} from "react-router";
import {Stream, Event, EventStore, Filter, Watcher} from "../model";
import {WatcherNav} from "./WatcherNav";
import {WatcherViewer} from "./WatcherViewer";
import {NoWatcherSelected} from "./NoWatcherSelected";
import {Redirect} from "react-router-dom";

export interface WatchersLayoutProps  extends RouteComponentProps<{watcherId?: Watcher.Id, eventId?: string}>, InjectedTranslateProps {
    baseUrl: string,
    watchers: Map<string, Watcher.Watcher>,
    availableStreams: List<Stream.StreamName>,
    onWatcherSelected: (watcherId: Watcher.Id) => void,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
    onToggleWatcher: (watcherId: Watcher.Id, isWatching: boolean) => void,
    onShowFilterBox: (watcherId: Watcher.Id, show: boolean) => void,
    onFilterSubmit: (watcherId: Watcher.Id, filters: List<Filter.StreamFilterGroup>) => void,
}

export class WatchersLayout extends React.Component<WatchersLayoutProps, {contextRef: any}> {
    state = {contextRef: undefined}

    handleContextRef = contextRef => {
        this.setState({ contextRef })
    }

    getWatcher = (watcherId: Watcher.Id): Watcher.Watcher => this.props.watchers.get(watcherId) as Watcher.Watcher

    render() {
        const {contextRef} = this.state;
        const { watcherId, eventId } = this.props.match.params;
        const watcher = this.getWatcher(watcherId);

        if(watcherId && !watcher) {
            return <Redirect to={this.props.baseUrl}/>
        }

        const content = (watcherId)?
            <WatcherViewer
                t={this.props.t}
                watcher={this.getWatcher(watcherId)}
                availableStreams={this.props.availableStreams}
                activeEventId={eventId}
                style={{minHeight: window.innerHeight}}
                onRemoveWatcher={this.props.onRemoveWatcher}
                onToggleWatcher={this.props.onToggleWatcher}
                onShowFilterBox={this.props.onShowFilterBox}
                onFilterSubmit={this.props.onFilterSubmit}
            />
            :
            <NoWatcherSelected t={this.props.t} style={{minHeight: window.innerHeight}}/>;

        return <Grid centered columns={2}>
            <Grid.Column width={10}>
                <div ref={this.handleContextRef}>
                    <Segment>
                        {content}
                        <Rail position="right">
                            <Sticky active context={contextRef}>
                                <WatcherNav
                                    baseUrl={this.props.baseUrl}
                                    watchers={this.props.watchers}
                                    t={this.props.t}
                                    activeWatcher={this.props.match.params.watcherId || null }
                                    onWatcherSelected={this.props.onWatcherSelected}
                                />
                            </Sticky>
                        </Rail>
                    </Segment>
                </div>
            </Grid.Column>
        </Grid>
    }
}