import {NodeCollection, CollectionElements} from "cytoscape";
import {NodeType} from "../model";
import {fromJS, List} from "immutable";

export const selectParentMethods = (parent) => {
    parent.children().forEach(method => method.select());
}

export const getNeighbourNodes = (node: CollectionElements): CollectionElements[] => {
    let eles = [];

    node.connectedEdges().forEach(edge => {
        if(edge.source().data('id') !== node.data('id')
            && !edge.source().isChild()) {
            eles.push(edge.source())
        }

        if(edge.target().data('id') !== node.data('id')
            && !edge.target().isChild()) {
            eles.push(edge.target())
        }
    })

    return eles;
}

export const selectNeighbourNodes = (node) => {
    getNeighbourNodes(node).forEach(neighbour => neighbour.select());
}

export const selectAggregates = (nodes: NodeCollection): void => {
    nodes.each(node => {
        const parent = node.parent();

        if(parent.isParent() && NodeType.isAggregate(parent.data())) {
            parent.select();
        }
    })
}

export const initEdgePoints = (nodes: NodeCollection): void => {
    nodes.each(node => {
        const edges = node.connectedEdges();
        edges.forEach((edge: any) => {
            const points = edge.segmentPoints() || [];
            edge.data('bendPointPositions', points)
        })
    })
}