import {Record} from 'immutable';
import {ElementDefinition, ElementsDefinition} from "cytoscape";

export interface MessageFlowType {
    elements: ElementsDefinition
}

export class MessageFlow extends Record({
    elements: {nodes: [], edges: []}
}) {
    constructor(data: MessageFlowType) {
        super(data);
        this.elements = this.elements.bind(this);
    }

    elements(): ElementsDefinition {
        return this.get("elements");
    }
}
