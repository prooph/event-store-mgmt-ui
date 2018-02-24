import * as React from 'react';
import {InjectedTranslateProps} from "react-i18next";
import {RouteComponentProps} from "react-router";
import {Stream} from "../model";
import {Header, Card, Message, List, Dimmer, Accordion, Loader, Icon} from "semantic-ui-react";
import Event from "./Event";

export interface StreamViewerProps extends InjectedTranslateProps {
    stream: Stream.Stream,
    onRefresh: (streamName: Stream.StreamName) => void,
    style?: any
}

export class StreamViewer extends React.Component<StreamViewerProps, undefined>{

    handleOnRefresh = () => this.props.onRefresh(this.props.stream.name())

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
                <Header as="h1" textAlign="center">{ this.props.t('app.eventStore.h1') + " / " + this.props.stream.name() }<Header sub={true} floated='right'>
                    <Icon
                        size='tiny'
                        name='refresh'
                        style={{cursor: 'pointer'}}
                        color={this.props.stream.isLoading()? 'orange':'black'}
                        loading={this.props.stream.isLoading()}
                        onClick={this.handleOnRefresh}
                    />
                </Header></Header>
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