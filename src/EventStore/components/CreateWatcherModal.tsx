import * as React from 'react';
import {Modal, Input, Message} from 'semantic-ui-react';
import {InjectedTranslateProps} from "react-i18next";
import * as uuid from 'uuid';

export interface CreateWatcherModalProps extends InjectedTranslateProps {
    open: boolean,
    onClose: () => void,
    onSubmitWatcher: (watcherId: string, watcherName: string) => void,
}

interface CreateWatcherModalState {
    watcherName: string
}

export class CreateWatcherModal extends React.Component<CreateWatcherModalProps, CreateWatcherModalState> {
    state = {watcherName: ''}

    handleNameChange = (evt) => this.setState({watcherName: evt.target.value})

    handleSubmitWatcher = () => {
        this.props.onSubmitWatcher(uuid.v4(), this.state.watcherName);
        this.setState({watcherName: ''});
        this.props.onClose();
    }

    render() {
        return <Modal open={this.props.open}
                      dimmer='blurring'
                      onClose={this.props.onClose}
                      closeIcon>
            <Modal.Header>{this.props.t('app.eventStore.watcher.modal.title')}</Modal.Header>
            <Modal.Content>
                <Input action={{
                        color: 'green',
                        labelPosition: 'right',
                        icon: 'eye',
                        content: this.props.t('app.eventStore.watcher.modal.submit'),
                        onClick: this.handleSubmitWatcher
                        }}
                       fluid
                       autoFocus
                       placeholder={this.props.t('app.eventStore.watcher.modal.watcher_name')}
                       value={this.state.watcherName}
                       onChange={this.handleNameChange}/>
                <Message color='grey'>
                    { this.props.t('app.eventStore.watcher.modal.desc') }
                </Message>
            </Modal.Content>
        </Modal>
    }
}


