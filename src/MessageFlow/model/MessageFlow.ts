import {Record, List, Map} from 'immutable';
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

interface EnhancedNodeData {
    parent?: string,
    service: string
}

interface EnhancedEdgeData {
    source: string;
    target: string;
    service: string
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

    mergeElements(elements: ElementsDefinition, fromService: string): MessageFlow {
        return new MessageFlow({"elements": mergeElements(this.elements(), elements, fromService)});
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

export const mergeElements = (a: ElementsDefinition, b: ElementsDefinition, fromService: string): ElementsDefinition => {
    let aNodes = {};
    let bNodes = {};
    let mergedNodes = [];

    a.nodes.forEach((node: NodeDefinition) => {aNodes[node.data.id] = node});

    b.nodes.forEach(node => {
        let data = node.data as EnhancedNodeData;
        data.service = fromService;

        if(_.isUndefined(aNodes[node.data.id])) {
            mergedNodes.push(node);
        } else {
            bNodes[node.data.id] = node;
        }
    })

    a.nodes.forEach((node: NodeDefinition) => {
        const data = node.data as EnhancedNodeData;

        if(!_.isUndefined(bNodes[node.data.id])) {
            mergedNodes.push(updateNonPositionNodeProps(node, bNodes[node.data.id]));
        } else if (data.service !== fromService) {
            mergedNodes.push(node);
        }
    })

    let aEdges = {};
    let bEdges = {};
    let mergedEdges = [];

    a.edges.forEach((edge: EdgeDefinition) => {aEdges[edge.data.id] = edge});

    b.edges.forEach(edge => {
        let data = edge.data as EnhancedEdgeData;
        data.service = fromService;

        if(_.isUndefined(aEdges[edge.data.id])) {
            mergedEdges.push(edge);
        } else {
            bEdges[edge.data.id] = edge;
        }
    })

    a.edges.forEach((edge: EdgeDefinition) => {
        const data = edge.data as EnhancedEdgeData;

        if(!_.isUndefined(bEdges[edge.data.id])) {
            mergedEdges.push(edge);
        } else if (data.service !== fromService) {
            mergedEdges.push(edge)
        }
    })

    return {nodes: mergedNodes, edges: mergedEdges};
};

const updateNonPositionNodeProps = (nodeWithPosition: NodeDefinition, updatedNode: NodeDefinition): NodeDefinition => {
    return Map(updatedNode).set('position', nodeWithPosition.position).toJS() as NodeDefinition;
}