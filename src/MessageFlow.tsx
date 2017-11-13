import * as React from 'react';
import { translate, InjectedTranslateProps } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Grid, Menu } from 'semantic-ui-react';
import Cytoscape from "./MessageFlow/components/Cytoscape";
import {elements} from "./MessageFlow/elements";

interface MessageFlowProps extends RouteComponentProps<{ id: string }>, InjectedTranslateProps {
}

class MessageFlow extends React.Component<MessageFlowProps, undefined>{
    cy: Cytoscape;

    constructor(props: MessageFlowProps) {
        super(props);
        this.handleSaveCy = this.handleSaveCy.bind(this);
    }

    handleSaveCy() {
        console.log(this.cy.getCy().json());
    }

    render(){
        return <Grid centered={false} style={{height: '1200px'}}>
            <Grid.Row style={{minHeight: '100%'}}>
                <Grid.Column width={14}>
                    <Cytoscape elements={elements} ref={ cy => { this.cy = cy } }/>
                </Grid.Column>
                <Grid.Column width={2}>
                    <Menu vertical fluid>
                        <Menu.Item onClick={this.handleSaveCy}>test</Menu.Item>
                    </Menu>
                </Grid.Column>
            </Grid.Row>
        </Grid>;
    }
}

export default translate('translation')(MessageFlow);