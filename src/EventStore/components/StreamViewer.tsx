import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {RouteComponentProps} from "react-router";
import {Stream, Filter} from "../model";
import {Header, Card, Message, Accordion, Icon, Segment, Divider, Button} from "semantic-ui-react";
import Event from "./Event";
import {StreamFilterBox} from "./StreamFilterBox";
import {fromJS, List} from "immutable";

export interface StreamViewerProps extends InjectedTranslateProps {
    stream: Stream.Stream,
    style?: any,
    onShowFilterBox: (streamName: Stream.StreamName, show: boolean) => void,
    onRefresh: (stream: Stream.Stream) => void,
    onFilterSubmit: (streamName: Stream.StreamName, filters: List<Filter.StreamFilter>) => void
}

export class StreamViewer extends React.Component<StreamViewerProps, undefined>{

    handleOnRefresh = () => this.props.onRefresh(this.props.stream)

    handleFilterSubmit = (filters: List<Filter.StreamFilter>) => this.props.onFilterSubmit(this.props.stream.name(), filters)

    handleShowFilterBoxClick = () => this.props.onShowFilterBox(this.props.stream.name(), !this.props.stream.showFilterBox())

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

        return (
            <div style={this.props.style}>
                <Header as="h1" textAlign="center">
                    <Header sub={true} floated={'left'}>
                        <Icon
                            name='filter'
                            className='event_store'
                            size='large'
                            color={this.props.stream.showFilterBox() || this.props.stream.filters().count() > 0? 'orange' : null}
                            onClick={this.handleShowFilterBoxClick} />
                    </Header>
                    { this.props.t('app.eventStore.h1') + " / " + this.props.stream.name() }
                    <Header sub={true} floated='right'>
                        <Icon
                            size='large'
                            name='refresh'
                            style={{cursor: 'pointer'}}
                            color={this.props.stream.isLoading()? 'orange':null}
                            loading={this.props.stream.isLoading()}
                            onClick={this.handleOnRefresh}
                            className='event_store'
                        />
                    </Header>
                </Header>
                <Divider className='event_store' />
                {this.props.stream.showFilterBox() && <Segment basic>
                    <StreamFilterBox
                        filters={this.props.stream.filters()}
                        onFilterSubmit={this.handleFilterSubmit}
                        onClearFilter={() => this.props.onFilterSubmit(this.props.stream.name(), fromJS([]))}
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
                </Card>
            </div>
        );
    }
}