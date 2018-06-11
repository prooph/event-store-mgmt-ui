import * as React from 'react';
import {Form, Segment, Icon, Button, Popup} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import {fromJS, List} from "immutable";
import {Event, Stream} from "../model/index";
import * as _ from "lodash";

export interface StreamInsertBoxProps extends InjectedTranslateProps {
    stream: Stream.Stream,
    onInsertEvents: (streamName: Stream.StreamName, events: List<Event.DomainEvent>) => void,
}

interface StateProps {
    unsavedEventsJson: string,
    failedSubmit: boolean,
}

export class StreamInsertBox extends React.Component<StreamInsertBoxProps, StateProps> {
    state = {unsavedEventsJson: "[]", failedSubmit: false}

    componentWillReceiveProps(props: StreamInsertBoxProps) {

        if(!this.props.stream.isInserting() && this.props.stream.failedInsertEvents().size > 0) {
            this.setState({
                unsavedEventsJson: JSON.stringify(this.props.stream.failedInsertEvents().map(event => event.toJS()).toJS(), null, 2)
            })
        }
    }

    handleValueChanged = (value: string) => {
        this.setState({
            unsavedEventsJson: value,
        })
    }

    submitEventsIfValid(): boolean {
        try {
            let events = JSON.parse(this.state.unsavedEventsJson)

            if(_.isPlainObject(events)) {
               events = [events];
            }

            if(!_.isArray(events)) {
                throw Error("Input should be a list of events");
            }

            events = fromJS(events).map((event) => new Event.DomainEvent(event));

            this.props.onInsertEvents(this.props.stream.name(), events);

            return true;
        } catch (e) {
            console.error(e);
            this.setState({
                failedSubmit: true
            });
            return false;
        }
    }

    handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        if(!this.submitEventsIfValid()) {
            event.preventDefault();
        }
    }

    render() {
        return <Form onSubmit={this.handleSubmit}>
            <Segment basic clearing className='filterbox'>
                <Form.TextArea placeholder={this.props.t('app.eventStore.streams.add_events_here')} onChange={(event, data) => this.handleValueChanged(data.value.toString())} />
                <Button icon labelPosition='left' color='orange' floated='right' disabled={this.state.unsavedEventsJson === "[]"} loading={this.props.stream.isInserting()}>
                    <Icon name='envelope'/>{ this.props.t('app.eventStore.streams.insert') }
                </Button>
            </Segment>
        </Form>
    }
}
