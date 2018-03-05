import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {Watcher, Stream, Filter} from "../model";
import {Header, Accordion, Divider, Radio, Popup, Message, Card, Icon, Segment} from "semantic-ui-react";
import Event from "./Event";
import {fromJS, List} from "immutable";
import {WatcherFilterBox} from "./WatcherFilterBox";


export interface WatcherViewerProps extends InjectedTranslateProps {
    watcher: Watcher.Watcher,
    availableStreams: List<Stream.StreamName>,
    style?: any,
    activeEventId?: string,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
    onToggleWatcher: (watcherId: Watcher.Id, isWatching: boolean) => void,
    onShowFilterBox: (watcherId: Watcher.Id, show: boolean) => void,
    onFilterSubmit: (watcherId: Watcher.Id, filters: List<Filter.StreamFilterGroup>) => void,
}

export class WatcherViewer extends React.Component<WatcherViewerProps, undefined> {

    handleShowFilterBoxClick = () => this.props.onShowFilterBox(this.props.watcher.id(), !this.props.watcher.showFilterBox())

    handleOnFilterSubmit = (filters: List<Filter.StreamFilterGroup>) => {
        this.props.onFilterSubmit(this.props.watcher.id(), filters);
    }

    render() {
        let panels = [];
        let activePanel = -1;

        if (this.props.watcher.recordedEvents().count() > 0) {
            panels = this.props.watcher.recordedEvents()
                .map((event, i) => {
                    if(this.props.activeEventId === event.uuid()) {
                        activePanel = i;
                    }

                    return Event({
                        event,
                        t: this.props.t,
                    })
                }).toArray();
        }

        return <div style={this.props.style}>
            <Header as="h1" textAlign="center">
                <Header sub={true} floated={'left'}>
                    <Icon
                        name='filter'
                        className='watcher'
                        size='large'
                        color={this.props.watcher.showFilterBox()? 'red' : null}
                        onClick={this.handleShowFilterBoxClick} />
                </Header>
                { this.props.t('app.eventStore.watcher.title') + " / " + this.props.watcher.name() }
                <Header sub={true} floated='right'>
                    <Popup
                        trigger={<Radio toggle
                                        className='watcher'
                                        onChange={() => {
                                            this.props.onToggleWatcher(
                                                this.props.watcher.id(),
                                                !this.props.watcher.isWatching()
                                            )
                                        }}
                                        checked={this.props.watcher.isWatching()}
                        />}
                        content={this.props.t('app.eventStore.watcher.' + (this.props.watcher.isWatching()? 'deactivate_watch_mode' : 'activate_watch_mode'))}
                        position='bottom center' />
                </Header>
            </Header>
            <Divider className='watcher' />
            {this.props.watcher.showFilterBox() && <Segment basic>
                <WatcherFilterBox
                    filters={this.props.watcher.filters()}
                    availableStreams={this.props.availableStreams}
                    existingFilterProps={this.props.watcher.suggestFilterProperties()}
                    onCancel={this.handleShowFilterBoxClick}
                    onFilterSubmit={this.handleOnFilterSubmit}
                    t={this.props.t} />
            </Segment>}
            <Card fluid={true}>
                {panels.length === 0 &&
                <Message warning={true}>{this.props.t('app.eventStore.watcher.no_recorded_events')}</Message>
                }
                {panels.length > 0 &&
                <Accordion key={this.props.watcher.id() + '-accordion'} styled={true} fluid={true} defaultActiveIndex={[activePanel]} panels={panels} exclusive={false} className={'event_stream'} />
                }
            </Card>
        </div>
    }
}