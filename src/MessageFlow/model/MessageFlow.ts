import {Record, List} from 'immutable';
import {EdgeDefinition, ElementsDefinition, NodeDefinition} from "cytoscape";
import * as _ from "lodash";
import {Model as ESModel} from "../../EventStore/index";

export interface MessageFlowType {
    elements: ElementsDefinition,
    watching?: boolean,
    recordedEvents?: List<ESModel.Event.DomainEvent>,
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
    elements: {nodes: [], edges: []},
    watching: false,
    recordedEvents: List()
}) {
    constructor(data: MessageFlowType) {
        assert(data);
        super(data);
        this.elements = this.elements.bind(this);
        this.mergeElements = this.mergeElements.bind(this);
        this.isWatching = this.isWatching.bind(this);
        this.recordedEvents = this.recordedEvents.bind(this);
        this.recordEvent = this.recordEvent.bind(this);
        this.stopWatching = this.stopWatching.bind(this);
    }

    elements(): ElementsDefinition {
        return this.get("elements");
    }

    mergeElements(elements: ElementsDefinition): MessageFlow {
        return new MessageFlow({"elements": mergeElements(this.elements(), elements)});
    }

    isWatching(): boolean {
        return this.get("watching");
    }

    recordedEvents(): List<ESModel.Event.DomainEvent> {
        return this.get("recordedEvents") as List<ESModel.Event.DomainEvent>;
    }

    recordEvent(event: ESModel.Event.DomainEvent): MessageFlow {
        const events = this.recordedEvents();

        return this.set("recordedEvents", events.push(event)) as MessageFlow;
    }

    stopWatching(): MessageFlow {
        return this.set("watching", false).set("recordedEvents", List()) as MessageFlow;
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