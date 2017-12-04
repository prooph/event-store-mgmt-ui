import {Record} from 'immutable';
import {EdgeDefinition, ElementsDefinition, NodeDefinition} from "cytoscape";
import * as _ from "lodash";

export interface MessageFlowType {
    elements: ElementsDefinition
}

const assert = (data: MessageFlowType): void => {
    const checkPaths = ["elements", "elements.nodes", "elements.edges"];

    checkPaths.forEach(path => {
        if(!_.has(data, path)) {
            throw new Error("Missing " + path + " in message flow data");
        }
    })
}

export const emptyMessageFlow = (): MessageFlow => {
    return new MessageFlow({elements: {
        nodes: [],
        edges: []
    }});
}

export class MessageFlow extends Record({
    elements: {nodes: [], edges: []}
}) {
    constructor(data: MessageFlowType) {
        assert(data);
        super(data);
        this.elements = this.elements.bind(this);
        this.mergeElements = this.mergeElements.bind(this);
    }

    elements(): ElementsDefinition {
        return this.get("elements");
    }

    mergeElements(elements: ElementsDefinition): MessageFlow {
        return new MessageFlow({"elements": mergeElements(this.elements(), elements)});
    }
}

export const mergeElements = (a: ElementsDefinition, b: ElementsDefinition): ElementsDefinition => {
    let aNodes = {};
    let bNodes = {};
    let mergedNodes = [];

    a.nodes.forEach((node: NodeDefinition) => {aNodes[node.data.id] = node});

    b.nodes.forEach(node => {
        if(_.isUndefined(aNodes[node.data.id])) {
            mergedNodes.push(node);
        } else {
            bNodes[node.data.id] = node;
        }
    })

    a.nodes.forEach((node: NodeDefinition) => {
        if(!_.isUndefined(bNodes[node.data.id])) {
            mergedNodes.push(node);
        }
    })

    let aEdges = {};
    let bEdges = {};
    let mergedEdges = [];

    a.edges.forEach((edge: EdgeDefinition) => {aEdges[edge.data.id] = edge});

    b.edges.forEach(edge => {
        if(_.isUndefined(aEdges[edge.data.id])) {
            mergedEdges.push(edge);
        } else {
            bEdges[edge.data.id] = edge;
        }
    })

    a.edges.forEach((edge: EdgeDefinition) => {
        if(!_.isUndefined(bEdges[edge.data.id])) {
            mergedEdges.push(edge);
        }
    })

    return {nodes: mergedNodes, edges: mergedEdges};
};