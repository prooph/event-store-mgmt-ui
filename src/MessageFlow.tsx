import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Grid } from 'semantic-ui-react';
import {Cytoscape} from "./MessageFlow/containers";
import {loadMessageFlow} from "./core/localStorage";

interface MessageFlowProps extends RouteComponentProps<{ id: string }>, InjectedTranslateProps {
}

class MessageFlow extends React.Component<MessageFlowProps, undefined>{

    render(){
        return <Grid centered={false} style={{height: '1200px'}}>
            <Cytoscape />
        </Grid>;
    }
}

export default translate('translation')(MessageFlow);