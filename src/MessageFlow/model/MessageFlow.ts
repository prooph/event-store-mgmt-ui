import {Record} from 'immutable';
import {ElementsDefinition} from "cytoscape";
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

export class MessageFlow extends Record({
    elements: {nodes: [], edges: []}
}) {
    constructor(data: MessageFlowType) {
        assert(data);
        super(data);
        this.elements = this.elements.bind(this);
    }

    elements(): ElementsDefinition {
        return this.get("elements");
    }
}
