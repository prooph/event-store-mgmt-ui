import * as React from 'react';
import { pure } from 'recompose';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { Menu, MenuItem, Image, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import {withRouter} from "react-router";
import * as Routes from '../routes';
import {Model as ESModel} from '../EventStore/index';
const logo = require('../theme/img/prooph-logo@0.5x.png');

export interface TopMenuProps extends InjectedTranslateProps {
    selectedStream: ESModel.Stream.StreamName;
    selectedWatcher: ESModel.Watcher.Id;
}

const TopMenu = pure((props: any) => {
    return (<Menu fixed="top" inverted={true}>
        <MenuItem active={false}>
            <Image src={logo} height={20}/>
        </MenuItem>
        <MenuItem as={NavLink} to={Routes.eventStorePath.link(props.selectedStream)}
                  activeClassName="active">
            <Icon name='database' color='orange' />
            {props.t('app.sidemenu.eventStore')}
        </MenuItem>
        <MenuItem as={NavLink} to={Routes.watchersPath.link(props.selectedWatcher)}
                  activeClassName="active">
            <Icon name='eye' color='green' />
            {props.t('app.sidemenu.watchers')}
        </MenuItem>
        <MenuItem as={NavLink} to={Routes.messageFlowPath}
                  activeClassName="active">
            <Icon name='exchange' color='blue' />
            {props.t('app.sidemenu.messageFlow')}
        </MenuItem>
    </Menu>);
});

export default withRouter(translate('translation')(TopMenu));
