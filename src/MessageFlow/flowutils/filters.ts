import {CollectionElements, ElementsDefinition, NodeDefinition, EdgeDefinition, NodeCollection} from "cytoscape";
import * as _ from "lodash";
import {MessageFlow, NodeType} from "../model";

//Filter nodes
export const filterNodesWithoutPosition = (nodes: NodeDefinition[]): NodeDefinition[] => {
    let filteredNodes = [];
    nodes.forEach(node => {
        if(_.isUndefined(node.position)) {
            filteredNodes.push(node);
        }
    })

    return filteredNodes;
}

export const filterAggregates = (nodes: NodeCollection): NodeCollection => {
    return nodes.filter((node: any) => {
        return NodeType.isAggregate(node.data())
    });

}

export const filterNodesWithPosition = (nodes: NodeDefinition[]): NodeDefinition[] => {
    let filteredNodes = [];
    nodes.forEach(node => {
        if(!_.isUndefined(node.position)) {
            filteredNodes.push(node);
        }
    })

    return filteredNodes;
}

export const findPrevNeighbours = (node: NodeDefinition, messageFlow: MessageFlow.MessageFlow): NodeDefinition[] | null => {
    let matchedEdges = [];
    messageFlow.elements().edges.forEach((edge: EdgeDefinition) => {
        if(edge.data.target === node.data.id) {
            matchedEdges.push(edge)
        }
    });

    if(matchedEdges.length === 0) {
        return null;
    }

    let matchedNodes = [];

    matchedEdges.forEach(edge => {
        messageFlow.elements().nodes.forEach(node => {
            if(edge.data.source === node.data.id) {
                matchedNodes.push(node);
            }
        })
    })

    return matchedNodes;
}

export const followPrevNeighbours = (node: NodeDefinition, messageFlow: MessageFlow.MessageFlow): NodeDefinition[] | null => {
    let prevNeighbours = findPrevNeighbours(node, messageFlow);

    if(null === prevNeighbours) {
        return null;
    }

    prevNeighbours.forEach(prevNode => {
        const nextPrevNeighbours = followPrevNeighbours(prevNode, messageFlow);

        if(null !== nextPrevNeighbours) {
            nextPrevNeighbours.forEach(prevNode => prevNeighbours.push(prevNode))
        }
    })

    return prevNeighbours;
}
