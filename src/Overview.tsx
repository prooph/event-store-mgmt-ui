import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Grid, Image } from 'semantic-ui-react';
const logo = require('./theme/img/prooph_sticker.png');

interface Overview extends RouteComponentProps<{ id: string }>, InjectedTranslateProps {
}

const Overview = (props: Overview) => {
    // Add your containers here
    return <Grid centered={true}>
        <Grid.Row>
            <p>Welcome to React + Redux + Semantic UI Skeleton</p>
        </Grid.Row>
        <Grid.Row>
            <Image src={logo} style={{width:300, height:300}}/>
        </Grid.Row>
    </Grid>;
};

export default translate('translation')(Overview);
