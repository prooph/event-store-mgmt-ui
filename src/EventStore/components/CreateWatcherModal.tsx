import * as React from 'react';
import {List} from 'immutable';
import {Modal, Input, Message, Divider, Dropdown, Button} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import * as uuid from 'uuid';
import {Watcher} from '../model';

export interface CreateWatcherModalProps extends InjectedTranslateProps {
    open: boolean,
    availableWatchers: List<Watcher.Watcher>,
    onClose: () => void,
    onSubmitWatcher: (watcherId: Watcher.Id, watcherName: string) => void,
    onAppendToWatcher: (watcherId: Watcher.Id) => void,
}

interface CreateWatcherModalState {
    newWatcherName: string,
    newWatcherError: boolean,
    existingWatcherId: Watcher.Id,
    existingWatcherError: boolean,
}

export class CreateWatcherModal extends React.Component<CreateWatcherModalProps, CreateWatcherModalState> {
    state = {newWatcherName: '', newWatcherError: false, existingWatcherId: '', existingWatcherError: false}

    handleNameChange = (evt) => this.setState({newWatcherName: evt.target.value, newWatcherError: false})

    handleChangeExistingWatcher = (evt, data) => this.setState({existingWatcherId: data.value, existingWatcherError: false})

    handleSubmitWatcher = () => {
        if(this.state.newWatcherName === '') {
            this.setState({
                newWatcherError: true,
            });
            return;
        }

        this.props.onSubmitWatcher(uuid.v4(), this.state.newWatcherName);
        this.setState({newWatcherName: '', existingWatcherId: '', newWatcherError: false, existingWatcherError: false});
        this.props.onClose();
    }

    handleAppendToWatcher = () => {
        if(this.state.existingWatcherId === '') {
            this.setState({
                existingWatcherError: true,
            });
            return;
        }

        this.props.onAppendToWatcher(this.state.existingWatcherId);
        this.setState({newWatcherName: '', existingWatcherId: '', newWatcherError: false, existingWatcherError: false});
        this.props.onClose();
    }

    render() {

        const watcherOptions = this.props.availableWatchers.map(watcher => {
            return {
                text: watcher.name(),
                value: watcher.id(),
            }
        }).toJS();

        return <Modal open={this.props.open}
                      dimmer='blurring'
                      onClose={this.props.onClose}
                      className='watcher'
                      closeIcon>
            <Modal.Header>{this.props.t('app.eventStore.watcher.modal.title')}</Modal.Header>
            <Modal.Content>
                <Input action={{
                        color: 'red',
                        labelPosition: 'right',
                        icon: 'eye',
                        content: this.props.t('app.eventStore.watcher.modal.new_watcher'),
                        onClick: this.handleSubmitWatcher
                        }}
                       fluid
                       autoFocus
                       error={this.state.newWatcherError}
                       placeholder={this.props.t('app.eventStore.watcher.modal.watcher_name')}
                       value={this.state.newWatcherName}
                       color='red'
                       onChange={this.handleNameChange}/>
                <Divider horizontal>{ this.props.t('common.or') }</Divider>
                <Button.Group color='grey' fluid>
                    <Dropdown options={watcherOptions}
                              placeholder={this.props.t('app.eventStore.watcher.modal.select_watcher')}
                              onChange={this.handleChangeExistingWatcher}
                              error={this.state.existingWatcherError}
                              floating
                              button
                              inverted />
                    <Button icon='eye'
                            labelPosition='right'
                            floated='right'
                            content={this.props.t('app.eventStore.watcher.modal.append_to_watcher')}
                            onClick={this.handleAppendToWatcher} />
                </Button.Group>
                <Message color='grey'>
                    { this.props.t('app.eventStore.watcher.modal.desc') }
                </Message>
            </Modal.Content>
        </Modal>
    }
}


