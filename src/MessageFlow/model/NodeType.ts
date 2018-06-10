import {CollectionElements, ElementsDefinition, NodeDefinition, EdgeDefinition} from "cytoscape";

export const SORT_STR = 'sortStr';

enum NodeType {
    aggregate = "aggregate",
    command = "command",
    event = "event",
    query = "query",
    handler = "handler",
};

export interface MessageFlowNodeData {
    type: NodeType;
    parent?: string;
    sortStr?: string;
}

export const isAggregate = (node: MessageFlowNodeData): boolean => {
    return node.type === 'aggregate'
}
