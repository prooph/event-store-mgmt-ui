import * as React from 'react';
import { Menu, Icon } from 'semantic-ui-react';

export interface MenuWatchBtnProps {
    onWatchClick: (watching: boolean) => void
}

export interface MenuWatchBtnState {
    watching: boolean
}

export default class MenuWatchBtn extends React.Component<MenuWatchBtnProps, MenuWatchBtnState> {
    state = {watching: false}

    render() {
        return <Menu.Item onClick={() => this.props.onWatchClick(!this.state.watching)}>
            <Icon name="eye" color={ this.state.watching? 'red' : 'black' } />
            Watch
        </Menu.Item>
    }
}