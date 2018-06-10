import * as React from 'react';
import {List, Map} from 'immutable';
import * as cytoscape from 'cytoscape';
import {conf, loadFontAwesomeSvg} from '../conf';
import {gridConf} from "../grid-conf"
import {MessageFlow} from "../model";
import { Grid, Menu, Icon } from 'semantic-ui-react';
import {Dropzone} from './Dropzone';
import MenuSaveBtn from "./MenuSaveBtn";
import MenuWatchBtn from "./MenuWatchBtn";
import ConfirmWrapper from "./ConfirmWrapper";
import {Filter, Layout, Selection} from "../flowutils/index";
import {CollectionElements, ElementsDefinition, NodeDefinition, EdgeDefinition} from "cytoscape";
const cytour = require('cytoscape-undo-redo/cytoscape-undo-redo.js');
const cycmenu = require('cytoscape-context-menus');
const cyEdgeBendEditing = require('cytoscape-edge-bend-editing');

import 'cytoscape-context-menus/cytoscape-context-menus.css'

declare const $: any;

cycmenu(cytoscape, $);
cytour(cytoscape);
cyEdgeBendEditing(cytoscape, $);

let cyStyle = {
    height: '100%',
    width: '100%',
    display: 'block'
};

const cyContextMenuConfig = (cy) => {
    return {
        menuItems: [
            {
                id: 'selectMethods',
                content: 'Select Methods',
                selector: 'node.parent',
                onClickFunction: function (event) {
                    const target = event.target || event.cyTarget;
                    Selection.selectParentMethods(target);
                    target.unselect();
                }
            },
            {
                id: 'selectNeighbours',
                content: 'Select Neighbours',
                selector: 'node',
                onClickFunction: function (event) {
                    const target = event.target || event.cyTarget;
                    target.select();

                    cy.$('node:selected').each(node => Selection.selectNeighbourNodes(node));
                }
            },
            {
                id: 'rearrange',
                content: 'Rearrange',
                selector: 'node',
                coreAsWell: true,
                onClickFunction: function (event) {
                    const eles = cy.$('node:selected');
                    Layout.prepareSortStrings(eles);
                    const layout = eles.layout(Layout.positioningLayout(
                        false,
                        Layout.calculateBoundingBoxOfNodes(eles)
                    )) as any;
                    layout.run();
                }
            }
        ]
    }
}

//Watch Mode
const removeInactiveStatus = (node: Map<string, any>): Map<string, any> => {
    return node.set('classes', node.get('classes').replace(' inactive', ''))
}

const applyWatchSession = (nodes: NodeDefinition[], messageFlow: MessageFlow.MessageFlow): NodeDefinition[] => {
    if(!messageFlow.isWatching()) {
        return nodes;
    }

    let modifiedNodes = Map({});
    let allPrevNeighbours = [];

    nodes.forEach(node => {
        let nodeMap = Map<string, any>(node).set("data", Map<string, any>(node.data));

        if(messageFlow.recordedEvents().filter(
            event => event.messageName() === nodeMap.getIn(['data', 'class']) || event.messageName() === nodeMap.getIn(['data', 'name'])
        ).count() > 0) {
            nodeMap = removeInactiveStatus(nodeMap);
            let prevNeighbours = Filter.followPrevNeighbours(nodeMap.toJS(), messageFlow);
            prevNeighbours.forEach(prevNeighbour => allPrevNeighbours.push(prevNeighbour))
        }

        modifiedNodes = modifiedNodes.set(nodeMap.getIn(['data', 'id']), nodeMap.toJS());
    })

    allPrevNeighbours.forEach(prevNeighbour => {
        prevNeighbour = removeInactiveStatus(Map<string, any>(prevNeighbour).set("data", Map<string, any>(prevNeighbour.data)));
        modifiedNodes = modifiedNodes.set(prevNeighbour.getIn(['data', 'id']), prevNeighbour.toJS());
    })

    return modifiedNodes.toList().toJS();
}

export interface CytoscapeProps {
    messageFlow: MessageFlow.MessageFlow,
    onSaveMessageFlow: (messageFlow: MessageFlow.MessageFlow) => void,
    onImportMessageFlowFile: (file: File) => void,
    onNotSupportedFileTypeDropped: (file: File) => void,
    onStartWatchSession: () => void,
    onStopWatchSession: () => void,
}

class Cytoscape extends React.Component<CytoscapeProps, undefined>{
    private cy: cytoscape.Core;
    private cyelement: HTMLDivElement;
    private cytour: any;
    private cyContextMenu: any;
    private cyEdgeBendEditing: any;
    private dropzone: Dropzone;
    private saveBtn: React.Component;
    private watchBtn: React.Component;
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

    handleWatchClick = (watching: boolean) => {
        if(watching) {
            this.startWatchSession();
        } else {
            this.stopWatchSession();
        }
    }

    startWatchSession = () => {
        let modifiedNodes = [];
        let nodes = this.props.messageFlow.elements().nodes;
        nodes.forEach(nodeDefinition => {
            let nodeDefinitionMap = Map<string, string>(nodeDefinition);

            if(!nodeDefinitionMap.get('classes').match(/^.*parent.*$/)) {
                nodeDefinitionMap = nodeDefinitionMap.set('classes', nodeDefinitionMap.get('classes') + ' inactive')
            }

            modifiedNodes.push(nodeDefinitionMap.toJS())
        });

        this.cy.remove('*');
        this.cy.add(modifiedNodes);
        this.cy.add(this.props.messageFlow.elements().edges);
        this.handleSaveMsgFlow();
        this.props.onStartWatchSession();
        this.watchBtn.setState({watching: true})
    }

    stopWatchSession = () => {
        let modifiedNodes = [];
        let nodes = this.props.messageFlow.elements().nodes;
        nodes.forEach(nodeDefinition => {
            let nodeDefinitionMap = Map<string, string>(nodeDefinition);

            nodeDefinitionMap = nodeDefinitionMap.set('classes', nodeDefinitionMap.get('classes').replace(' inactive', ''))

            modifiedNodes.push(nodeDefinitionMap.toJS())
        });

        this.cy.remove('*');
        this.cy.add(modifiedNodes);
        this.cy.add(this.props.messageFlow.elements().edges);
        this.handleSaveMsgFlow();
        this.props.onStopWatchSession();
        this.watchBtn.setState({watching: false})
    }

    componentDidMount(){
        conf.container = this.cyelement;

        const svgReady = loadFontAwesomeSvg();

        const {messageFlow} = this.props;

        let cy = cytoscape(conf) as any;

        this.cytour = cy.undoRedo();
        this.cyContextMenu = cy.contextMenus(cyContextMenuConfig(cy));
        this.cyEdgeBendEditing = cy.edgeBendEditing({undoable: true, bendShapeSizeFactor: 10});

        cy["gridGuide"](gridConf);

        cy.on("tapstart", "node", this.handleCytoscapeChange);
        cy.on("tapstart", "edge", this.handleCytoscapeChange);

        this.cy = cy;

        svgReady.then(function () {
            cy.remove('*');

            const nodes = applyWatchSession(
                messageFlow.elements().nodes,
                messageFlow
            );
            cy.add(nodes);
            cy.add(messageFlow.elements().edges);
            cy.fit();
        })

        this.watchBtn.setState({"watching": this.props.messageFlow.isWatching()})
    }

    shouldComponentUpdate(){
        return false;
    }

    componentWillReceiveProps(nextProps: CytoscapeProps){
        this.cy.remove('*');

        const nodesWithPosition = applyWatchSession(
            Filter.filterNodesWithPosition(nextProps.messageFlow.elements().nodes),
            nextProps.messageFlow
        );

        const nodesWithoutPosition = Filter.filterNodesWithoutPosition(nextProps.messageFlow.elements().nodes);

        this.cy.add(nodesWithPosition);

        const eles: CollectionElements = this.cy.add(nodesWithoutPosition);

        this.cy.add(nextProps.messageFlow.elements().edges);

        Layout.prepareSortStrings(eles);

        const layout = eles.layout(Layout.positioningLayout()) as any;
        layout.run();


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
                    <MenuWatchBtn onWatchClick={this.handleWatchClick} ref={(btn) => this.watchBtn = btn} />
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