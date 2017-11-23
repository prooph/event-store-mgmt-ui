import * as React from 'react';
import * as cytoscape from 'cytoscape';
import {conf} from '../conf';
import {gridConf} from "../grid-conf"
import {MessageFlow} from "../model";
import { Grid, Menu, Icon } from 'semantic-ui-react';
import {Dropzone} from './Dropzone';
import MenuSaveBtn from "./MenuSaveBtn";
import ConfirmWrapper from "./ConfirmWrapper";

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
    private dropzone: Dropzone;
    private saveBtn: React.PureComponent;
    private confirm: ConfirmWrapper;

    constructor(props: CytoscapeProps) {
        super(props);
        this.handleSaveMsgFlow = this.handleSaveMsgFlow.bind(this);
        this.handleDeleteMsgFlow = this.handleDeleteMsgFlow.bind(this);
        this.handleDroppedFile = this.handleDroppedFile.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
        this.handleCytoscapeChange = this.handleCytoscapeChange.bind(this);
        this.handleConfirmedDelete = this.handleConfirmedDelete.bind(this);
        this.handleCanceledDelete = this.handleCanceledDelete.bind(this);
    }

    handleSaveMsgFlow() {
        const data = this.cy.json();
        this.props.onSaveMessageFlow(new MessageFlow.MessageFlow({
            elements: data["elements"] as cytoscape.ElementsDefinition
        }))
        this.saveBtn.setState({shouldSave: false})
    }

    handleUploadClick() {
        this.dropzone.setState({dropzoneActive: !this.dropzone.state.dropzoneActive});
    }

    handleDroppedFile(file: File): void {
        this.props.onImportMessageFlowFile(file);
    }

    handleCytoscapeChange(): void {
        this.saveBtn.setState({shouldSave: true})
    }

    handleDeleteMsgFlow() {
        this.confirm.setState({isOpen: true})
    }

    handleConfirmedDelete(): void {
        this.props.onSaveMessageFlow(new MessageFlow.MessageFlow({
            elements: {nodes: [], edges: []}
        }))
        this.confirm.setState({isOpen: false})
    }

    handleCanceledDelete(): void {
        this.confirm.setState({isOpen: false})
    }

    componentDidMount(){
        conf.container = this.cyelement;
        let cy = cytoscape(conf);

        cy["gridGuide"](gridConf);

        cy.on("tapstart", "node", this.handleCytoscapeChange);

        this.cy = cy;
        cy.add(this.props.messageFlow.elements().nodes);
        cy.add(this.props.messageFlow.elements().edges);

        cy.fit();
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
                <Dropzone onDroppedFile={this.handleDroppedFile} ref={(dz) => this.dropzone = dz}>
                    <div style={cyStyle} ref={(div) => { this.cyelement = div; }} />
                </Dropzone>
            </Grid.Column>
            <Grid.Column width={2}>
                <Menu compact icon='labeled' vertical>
                    <MenuSaveBtn onSaveClick={this.handleSaveMsgFlow} ref={(btn) => this.saveBtn = btn} />
                    <Menu.Item onClick={this.handleUploadClick}>
                        <Icon name="upload" />
                        Import
                    </Menu.Item>
                    <Menu.Item onClick={this.handleDeleteMsgFlow}>
                        <Icon name="trash" color="red" />
                        Delete
                    </Menu.Item>
                </Menu>
                <ConfirmWrapper
                    ref={(confirm) => this.confirm = confirm}
                    onConfirm={this.handleConfirmedDelete}
                    onCancel={this.handleCanceledDelete}
                    content="Do you really want to delete the message flow?"/>
            </Grid.Column>
        </Grid.Row>;
    }
}

export default Cytoscape;