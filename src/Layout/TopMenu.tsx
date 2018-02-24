import * as React from 'react';
import { pure } from 'recompose';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { Menu, MenuItem, Image } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import {withRouter} from "react-router";
import * as Routes from '../routes';
const logo = require('../theme/img/prooph-logo@0.5x.png');

export interface TopMenuProps extends InjectedTranslateProps {}

const TopMenu = pure((props: any) => {
    return (<Menu fixed="top" inverted={true}>
        <MenuItem active={false}>
            <Image src={logo} height={20}/>
        </MenuItem>
        <MenuItem as={NavLink} to={Routes.eventStorePath.link(null)}
                  activeClassName="active">
            {props.t('app.sidemenu.eventStore')}
        </MenuItem>
        <MenuItem as={NavLink} to={Routes.messageFlowPath}
                  activeClassName="active">
            {props.t('app.sidemenu.messageFlow')}
        </MenuItem>
    </Menu>);
});

export default withRouter(translate('translation')(TopMenu));
