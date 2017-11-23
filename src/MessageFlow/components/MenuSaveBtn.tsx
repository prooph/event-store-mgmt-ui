import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

export interface MenuSaveBtnProps {
    onSaveClick: () => void
}

export interface MenuSaveBtnState {
    shouldSave: boolean
}

export default class MenuSaveBtn extends React.Component<MenuSaveBtnProps, MenuSaveBtnState> {
    constructor() {
        super();
        this.state = {
            shouldSave: false
        }
    }

    render() {
        return (this.state.shouldSave?
            <Menu.Item onClick={this.props.onSaveClick}>
                <Icon name="save" color="orange" />
                Save
            </Menu.Item>
            :
            <Menu.Item onClick={this.props.onSaveClick}>
                <Icon name="check" color="green" />
                Save
            </Menu.Item>);
    }
}