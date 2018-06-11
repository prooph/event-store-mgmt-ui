import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {Stream, Filter, Watcher, Event as ModelEvent} from "../model";
import {Header, Card, Message, Accordion, Icon, Segment, Divider, Popup} from "semantic-ui-react";
import Event from "./Event";
import {StreamFilterBox} from "./StreamFilterBox";
import {StreamInsertBox} from "./StreamInsertBox";
import {fromJS, List} from "immutable";
import {copyToClipboard} from "../../utils";

export interface StreamViewerProps extends InjectedTranslateProps {
    stream: Stream.Stream,
    style?: any,
    existingWatchers: List<Watcher.Watcher>,
    onShowFilterBox: (streamName: Stream.StreamName, show: boolean) => void,
    onShowInsertBox: (streamName: Stream.StreamName, show: boolean) => void,
    onRefresh: (stream: Stream.Stream) => void,
    onFilterSubmit: (streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
    onInsertEvents: (streamName: Stream.StreamName, events: List<ModelEvent.DomainEvent>) => void,
    onChangeUnsavedFilters: (unsaved: boolean) => void,
    onAddWatcher: (watcherId: Watcher.Id, watcherName: Watcher.Name, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
    onAppendToWatcher: (watcherId: Watcher.Id, streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void,
}

interface StreamViewerState {
    eventsCopied: boolean
}

export class StreamViewer extends React.Component<StreamViewerProps, StreamViewerState>{

    state = {eventsCopied: false}

    handleOnRefresh = () => this.props.onRefresh(this.props.stream)

    handleFilterSubmit = (filters: List<Filter.StreamFilter>) => this.props.onFilterSubmit(this.props.stream.name(), filters)

    handleShowFilterBoxClick = () => this.props.onShowFilterBox(this.props.stream.name(), !this.props.stream.showFilterBox())

    handleShowInsertBoxClick = () => this.props.onShowInsertBox(this.props.stream.name(), !this.props.stream.showInsertBox())

    handleOnAddWatcher = (watcherId: Watcher.Id, watcherName: Watcher.Name) => this.props.onAddWatcher(
        watcherId,
        watcherName,
        this.props.stream.name(),
        this.props.stream.filters()
    );

    handleOnAppendToWatcher = (watcherId: Watcher.Id) => this.props.onAppendToWatcher(
        watcherId,
        this.props.stream.name(),
        this.props.stream.filters()
    );

    handleCopyToClipboardClick = () => {
        this.setState({eventsCopied: true})

        const events = JSON.stringify(this.props.stream.events().toJS(), null, 2);

        copyToClipboard(events);
    }

    render() {
        let panels = [];

        if (this.props.stream && this.props.stream.events().count() > 0) {
            panels = this.props.stream.events()
                .map(event => Event({
                        event,
                        t: this.props.t,
                    }),
                ).toArray();
        }

        const {eventsCopied} = this.state;

        return (
            <div style={this.props.style}>
                <Header as="h1" textAlign="center">
                    <Header sub={true} floated={'left'}>
                        <Popup
                            trigger={<Icon
                                name='filter'
                                className='event_store'
                                size='large'
                                color={this.props.stream.showFilterBox() || this.props.stream.filters().count() > 0? 'orange' : null}
                                onClick={this.handleShowFilterBoxClick} />}
                            content={this.props.t('app.eventStore.streams.filter')}
                            on='hover'
                            position='bottom center'
                        />
                    </Header>
                    <Header sub={true} floated={'left'}>
                        <Popup
                            trigger={<Icon
                                name='plus'
                                className='event_store'
                                size='large'
                                color={this.props.stream.showInsertBox()? 'orange' : null}
                                onClick={this.handleShowInsertBoxClick} />}
                            content={this.props.t('app.eventStore.streams.insert')}
                            on='hover'
                            position='bottom center'
                        />
                    </Header>
                    { this.props.t('app.eventStore.h1') + " / " + this.props.stream.name() }
                    <Header sub={true} floated='right'>
                        <Popup
                            trigger={<Icon
                                size='large'
                                name='refresh'
                                style={{cursor: 'pointer'}}
                                color={this.props.stream.isLoading()? 'orange':null}
                                loading={this.props.stream.isLoading()}
                                onClick={this.handleOnRefresh}
                                className='event_store'
                            />}
                            content={this.props.t('app.eventStore.streams.refresh')}
                            on='hover'
                            position='bottom center'
                        />
                    </Header>
                </Header>
                <Divider className='event_store' />
                {this.props.stream.showInsertBox() && <Segment basic>
                    <StreamInsertBox
                        stream={this.props.stream}
                        onInsertEvents={this.props.onInsertEvents}
                        t={this.props.t} />
                </Segment>}
                {this.props.stream.showFilterBox() && <Segment basic>
                    <StreamFilterBox
                        filters={this.props.stream.filters()}
                        existingFilterProps={this.props.stream.suggestFilterProperties()}
                        existingWatchers={this.props.existingWatchers}
                        onFilterSubmit={this.handleFilterSubmit}
                        onClearFilter={() => this.props.onFilterSubmit(this.props.stream.name(), fromJS([]))}
                        onChangeUnsavedState={this.props.onChangeUnsavedFilters}
                        onAddWatcher={this.handleOnAddWatcher}
                        onAppendToWatcher={this.handleOnAppendToWatcher}
                        t={this.props.t} />
                </Segment>}
                <Card fluid={true}>
                    {panels.length === 0 &&
                    <Message warning={true}>{this.props.t('app.eventStore.streams.empty')}</Message>
                    }
                    {panels.length > 0 &&
                    <Accordion styled={true} fluid={true} panels={panels} exclusive={false} className={'event_stream'}>
                    </Accordion>
                    }
                    {this.props.stream.isLoading() &&
                    <Message icon>
                        <Icon color='orange' name='spinner' loading />
                        <Message.Content>
                            {this.props.t('app.loading')}
                        </Message.Content>
                    </Message>
                    }
                    <Divider />
                    <Header as='h2'>
                        {panels.length > 0 && <Header sub={true} floated='right'>
                            <Popup
                                trigger={<Icon
                                    name='clipboard'
                                    className='event_store'
                                    size='large'
                                    onClick={this.handleCopyToClipboardClick} />}
                                content={eventsCopied? this.props.t('app.eventStore.clipboard.events_copied') : this.props.t('app.eventStore.clipboard.copy_events')}
                                on='hover'
                                position='bottom center'
                                onClose={() => this.setState({eventsCopied: false})}
                            />
                        </Header>}
                    </Header>
                </Card>
            </div>
        );
    }
}