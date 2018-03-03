import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {Watcher} from "../model";
import {Header, Card, Message, Accordion, Icon, Segment, Divider, Button} from "semantic-ui-react";
import Event from "./Event";
import {StreamFilterBox} from "./StreamFilterBox";
import {fromJS, List} from "immutable";


export interface WatcherViewerProps extends InjectedTranslateProps {
    watcher: Watcher.Watcher,
    style?: any,
    onRemoveWatcher: (watcherId: Watcher.Id) => void,
}

export class WatcherViewer extends React.Component<WatcherViewerProps, undefined> {

    handleShowFilterBoxClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        //todo: handle show filter
    }

    render() {
        return <div style={this.props.style}>
            <Header as="h1" textAlign="center">
                <Header sub={true} floated={'left'}>
                    <Icon
                        name='filter'
                        className='watcher'
                        size='large'
                        color={this.props.watcher.showFilterBox()? 'green' : null}
                        onClick={this.handleShowFilterBoxClick} />
                </Header>
                { this.props.t('app.eventStore.watcher.title') + " / " + this.props.watcher.name() }
                <Header sub={true} floated='right'>
                    <Icon
                        size='large'
                        name='remove'
                        onClick={() => {this.props.onRemoveWatcher(this.props.watcher.id())}}
                    />
                </Header>
            </Header>
            <Divider className='watcher' />
        </div>
    }
}