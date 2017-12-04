import * as React from 'react';
import * as cytoscape from 'cytoscape';
import {conf} from '../conf';
import {gridConf} from "../grid-conf"
import {MessageFlow} from "../model";
import { Grid, Menu, Icon } from 'semantic-ui-react';
import {Dropzone} from './Dropzone';
import MenuSaveBtn from "./MenuSaveBtn";
import ConfirmWrapper from "./ConfirmWrapper";
import {CollectionElements, ElementsDefinition, NodeDefinition} from "cytoscape";
import * as _ from "lodash";
const cytour = require('cytoscape.js-undo-redo/cytoscape-undo-redo.js');

cytour(cytoscape);

let cyStyle = {
    height: '100%',
    width: '100%',
    display: 'block'
};

let commandRow = 0;
let commandHandlerRow = 0;
let aggregateMethodRow = 0;
let eventRow = 0;
let eventListener = 0;

const nodeRowCol = (node) => {

    if(node.hasClass('command')) {
        if(node.hasClass('message')) {
            commandRow = commandRow + 1;
            return {row: commandRow, col: 0};
        }

        if(node.hasClass('handler')) {
            commandHandlerRow = commandHandlerRow + 1;
            return {row: commandHandlerRow, col: 1};
        }

        if(node.hasClass('producer')) {
            eventListener = eventListener + 1;
            return {row: eventListener, col: 4};
        }
    }

    if(node.hasClass('event')) {
        if(node.hasClass('message')) {
            eventRow = eventRow + 1;
            return {row: eventRow, col: 3};
        }

        if(node.hasClass('recorder') || node.hasClass('factory')) {
            aggregateMethodRow = aggregateMethodRow + 1;
            return {row: aggregateMethodRow, col: 2};
        }

        if(node.hasClass('listner')) {
            eventListener = eventListener + 1;
            return {row: eventListener, col: 4};
        }
    }

    return {};
};

const positioningLayout = {
    name: "grid",
    avoidOverlap: true,
    avoidOverlapPadding: 20,
    position: nodeRowCol,
};

const filterNodesWithoutPosition = (nodes: NodeDefinition[]): NodeDefinition[] => {
    let filteredNodes = [];
    nodes.forEach(node => {
        if(_.isUndefined(node.position)) {
            filteredNodes.push(node);
        }
    })

    return filteredNodes;
}

const filterNodesWithPosition = (nodes: NodeDefinition[]): NodeDefinition[] => {
    let filteredNodes = [];
    nodes.forEach(node => {
        if(!_.isUndefined(node.position)) {
            filteredNodes.push(node);
        }
    })

    return filteredNodes;
}

export interface CytoscapeProps {
    messageFlow: MessageFlow.MessageFlow,
    onSaveMessageFlow: (messageFlow: MessageFlow.MessageFlow) => void,
    onImportMessageFlowFile: (file: File) => void,
    onNotSupportedFileTypeDropped: (file: File) => void,
}

class Cytoscape extends React.Component<CytoscapeProps, undefined>{
    private cy: cytoscape.Core;
    private cyelement: HTMLDivElement;
    private cytour: any;
    private dropzone: Dropzone;
    private saveBtn: React.PureComponent;
    private confirm: ConfirmWrapper;

    constructor(props: CytoscapeProps) {
        super(props);
        this.handleSaveMsgFlow = this.handleSaveMsgFlow.bind(this);
        this.handleUndoClick = this.handleUndoClick.bind(this);
        this.handleRedoClick = this.handleRedoClick.bind(this);
        this.handleDeleteMsgFlow = this.handleDeleteMsgFlow.bind(this);
        this.handleDroppedFile = this.handleDroppedFile.bind(this);
        this.handleUploadClick = this.handleUploadClick.bind(this);
        this.handleDownloadClick = this.handleDownloadClick.bind(this);
        this.handleCytoscapeChange = this.handleCytoscapeChange.bind(this);
        this.handleConfirmedDelete = this.handleConfirmedDelete.bind(this);
        this.handleCanceledDelete = this.handleCanceledDelete.bind(this);
    }

    handleSaveMsgFlow() {
        const elements = this.cy.json()["elements"];
        this.props.onSaveMessageFlow(new MessageFlow.MessageFlow({
            elements: elements as cytoscape.ElementsDefinition
        }))
        this.saveBtn.setState({shouldSave: false})
    }

    handleUndoClick() {
        this.cytour.undo();
    }

    handleRedoClick() {
        this.cytour.redo();
    }

    handleUploadClick() {
        this.dropzone.setState({dropzoneActive: !this.dropzone.state.dropzoneActive});
    }

    handleDownloadClick() {
        const elements = this.cy.json()["elements"];
        const messageFlow = JSON.stringify(elements);
        const blob = new Blob([messageFlow], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.download = "message_flow.json";
        a.href = url;
        a.click();
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

        let cy = cytoscape(conf) as any;

        this.cytour = cy.undoRedo();

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

        const nodesWithPosition = filterNodesWithPosition(nextProps.messageFlow.elements().nodes);
        const nodesWithoutPosition = filterNodesWithoutPosition(nextProps.messageFlow.elements().nodes);

        this.cy.add(nodesWithPosition);

        const eles: CollectionElements = this.cy.add(nodesWithoutPosition);

        //Reset global vars
        commandRow = 0;
        commandHandlerRow = 0;
        aggregateMethodRow = 0;
        eventRow = 0;
        eventListener = 0;

        const layout = eles.layout(positioningLayout) as any;
        layout.run();

        this.cy.add(nextProps.messageFlow.elements().edges);
    }

    componentWillUnmount(){
        this.cy.destroy();
    }

    render(){
        return <Grid.Row style={{minHeight: '100%'}}>
            <Grid.Column width={14}>
                <Dropzone
                    onDroppedFile={this.handleDroppedFile}
                    onNotSupportedFileTypeDropped={this.props.onNotSupportedFileTypeDropped}
                    ref={(dz) => this.dropzone = dz}>
                    <div style={cyStyle} ref={(div) => { this.cyelement = div; }} />
                </Dropzone>
            </Grid.Column>
            <Grid.Column width={2}>
                <Menu compact icon='labeled' vertical>
                    <MenuSaveBtn onSaveClick={this.handleSaveMsgFlow} ref={(btn) => this.saveBtn = btn} />
                    <Menu.Item onClick={this.handleUndoClick}>
                        <Icon name="undo" />
                        Undo
                    </Menu.Item>
                    <Menu.Item onClick={this.handleRedoClick}>
                        <Icon name="repeat" />
                        Redo
                    </Menu.Item>
                    <Menu.Item onClick={this.handleUploadClick}>
                        <Icon name="upload" />
                        Import
                    </Menu.Item>
                    <Menu.Item onClick={this.handleDownloadClick}>
                        <Icon name="download" />
                        Export
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