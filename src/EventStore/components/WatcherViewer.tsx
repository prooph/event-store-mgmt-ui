import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {Watcher} from "../model";
import {Header, Icon, Segment, Divider, Button, Radio, Popup} from "semantic-ui-react";
import Event from "./Event";
import {StreamFilterBox} from "./StreamFilterBox";
import {fromJS, List} from "immutable";


export interface WatcherViewerProps extends InjectedTranslateProps {
    watcher: Watcher.Watcher,
    style?: any,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
    onToggleWatcher: (watcherId: Watcher.Id, isWatching: boolean) => void,
}

export class WatcherViewer extends React.Component<WatcherViewerProps, undefined> {

    handleShowFilterBoxClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        //todo: handle show filter
    }

    render() {
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
        </div>
    }
}