import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {Watcher} from "../model";
import {Header, Accordion, Divider, Radio, Popup, Message, Card} from "semantic-ui-react";
import Event from "./Event";
import {StreamFilterBox} from "./StreamFilterBox";
import {fromJS, List} from "immutable";


export interface WatcherViewerProps extends InjectedTranslateProps {
    watcher: Watcher.Watcher,
    style?: any,
    activeEventId?: string,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
    onToggleWatcher: (watcherId: Watcher.Id, isWatching: boolean) => void,
}

export class WatcherViewer extends React.Component<WatcherViewerProps, undefined> {

    handleShowFilterBoxClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        //todo: handle show filter
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
            <Card fluid={true}>
                {panels.length === 0 &&
                <Message warning={true}>{this.props.t('app.eventStore.watcher.no_recorded_events')}</Message>
                }
                {panels.length > 0 &&
                <Accordion styled={true} fluid={true} defaultActiveIndex={[activePanel]} panels={panels} exclusive={false} className={'event_stream'} />
                }
            </Card>
        </div>
    }
}