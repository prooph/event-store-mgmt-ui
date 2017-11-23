import * as React from 'react';
import { Confirm } from 'semantic-ui-react';

export interface ConfirmWrapperProps {
    onConfirm: () => void,
    onCancel: () => void,
    content: string
}

export interface ConfirmWrapperState {
    isOpen: boolean
}

export default class ConfirmWrapper extends React.Component<ConfirmWrapperProps, ConfirmWrapperState> {
    constructor() {
        super();
        this.state = {
            isOpen: false
        }
    }

    render() {
        return <Confirm open={this.state.isOpen} onConfirm={this.props.onConfirm} onCancel={this.props.onCancel} content={this.props.content} />
    }
}
