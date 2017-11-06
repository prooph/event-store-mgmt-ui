import * as React from 'react';
import { pure } from 'recompose';
import { Menu } from 'semantic-ui-react';

const TopMenu = pure((props: any) => {
    return (<Menu fixed="top" inverted={true}>
        {props.children}
    </Menu>);
});

export default TopMenu;
