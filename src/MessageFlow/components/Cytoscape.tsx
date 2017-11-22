import * as React from 'react';
import * as cytoscape from 'cytoscape';
import {conf} from '../conf';
import {gridConf} from "../grid-conf"
import {MessageFlow} from "../model";
import { Grid, Menu, Button } from 'semantic-ui-react';
import {Dropzone} from './Dropzone';

let cyStyle = {
    height: '100%',
    width: '100%',
    display: 'block'
};

export interface CytoscapeProps {
    messageFlow: MessageFlow.MessageFlow,
    onSaveMessageFlow: (messageFlow: MessageFlow.MessageFlow) => void,
    onImportMessageFlowFile: (file: File) => void
}

class Cytoscape extends React.Component<CytoscapeProps, undefined>{
    private cy: cytoscape.Core;
    private cyelement: HTMLDivElement;

    constructor(props: CytoscapeProps) {
        super(props);
        this.handleSaveMsgFlow = this.handleSaveMsgFlow.bind(this);
        this.handleDeleteMsgFlow = this.handleDeleteMsgFlow.bind(this);
        this.handleDroppedFile = this.handleDroppedFile.bind(this);
    }

    handleSaveMsgFlow() {
        const data = this.cy.json();
        this.props.onSaveMessageFlow(new MessageFlow.MessageFlow({
            elements: data["elements"] as cytoscape.ElementsDefinition
        }))
    }

    handleDeleteMsgFlow() {
        this.props.onSaveMessageFlow(new MessageFlow.MessageFlow({
            elements: {nodes: [], edges: []}
        }))
    }

    handleDroppedFile(file: File): void {
        this.props.onImportMessageFlowFile(file);
    }

    componentDidMount(){
        conf.container = this.cyelement;
        let cy = cytoscape(conf);

        cy["gridGuide"](gridConf);

        this.cy = cy;
        cy.add(this.props.messageFlow.elements().nodes);
        cy.add(this.props.messageFlow.elements().edges);
    }

    shouldComponentUpdate(){
        return false;
    }

    componentWillReceiveProps(nextProps: CytoscapeProps){
        this.cy.remove('*');
        this.cy.add(nextProps.messageFlow.elements().nodes);
        this.cy.add(nextProps.messageFlow.elements().edges);
    }

    componentWillUnmount(){
        this.cy.destroy();
    }



    render(){
        return <Grid.Row style={{minHeight: '100%'}}>
            <Grid.Column width={14}>
                <Dropzone onDroppedFile={this.handleDroppedFile}>
                    <div style={cyStyle} ref={(div) => { this.cyelement = div; }} />
                </Dropzone>
            </Grid.Column>
            <Grid.Column width={2}>
                <Menu icon vertical>
                    <Menu.Item onClick={this.handleSaveMsgFlow} fluid>
                        <Button icon="save" size="huge" />
                    </Menu.Item>
                    <Menu.Item onClick={this.handleDeleteMsgFlow} fluid>
                        <Button icon="trash" size="huge" />
                    </Menu.Item>
                </Menu>
            </Grid.Column>
        </Grid.Row>;
    }
}

export default Cytoscape;