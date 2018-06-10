import {NodeCollection, CollectionElements} from "cytoscape";
import {Filter, Selection} from "./index";
import {NodeType} from "../model";
import * as _ from "lodash";

export const calculateBoundingBoxOfNodes = (nodes: NodeCollection) => {
    Selection.selectAggregates(nodes);

    const aggregates = Filter.filterAggregates(nodes);

    const opts = {includeEdges: false};

    return aggregates.length? aggregates.boundingBox(opts) : nodes.boundingBox(opts);
}

const setSortStrIfNotExists = (ele: CollectionElements, arId: string, methodCount: number, nLevel: number): void => {
    if(_.isEmpty(ele.data(NodeType.SORT_STR))) {
        ele.data(NodeType.SORT_STR, arId + "::" + methodCount + "::" + nLevel);
    }
}

export const prepareSortStrings = (eles: CollectionElements): void => {
    const aggregates = Filter.filterAggregates(eles);

    aggregates.each(aggregate => {

        aggregate.children().each((method, methodCount) => {
            setSortStrIfNotExists(method, aggregate.id(), methodCount, 1);

            const directs = Selection.getNeighbourNodes(method).forEach(direct => {
                setSortStrIfNotExists(direct, aggregate.id(), methodCount, 2);

                Selection.getNeighbourNodes(direct).forEach(secondLevel => {
                    setSortStrIfNotExists(secondLevel, aggregate.id(), methodCount, 3);
                })
            })
        })
    })
}

export const positioningLayout = (fit?: boolean, boundingBox?: any) => {

    if(typeof fit === 'undefined') {
        fit = true;
    }

    let commandRow = 0;
    let commandHandlerRow = 0;
    let aggregateMethodRow = 0;
    let eventRow = 0;
    let eventListener = 0;
    let service = 0;
    let knownNodes = {
        commands: {},
        commandHandlers: {},
        aggregateMethods: {},
        events: {},
        listeners: {},
        services: {}
    };
    let unknownNodes;

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

        service = service + 1;
        return {row: service, col: 5};
    };

    const generateUnknownSortStr = (): string => {
        const str = 'ZZZZZ' + unknownNodes;
        unknownNodes = unknownNodes + 1;
        return str;
    }

    const sortNodes = (nodeA, nodeB) => {
        let aSortStr = nodeA.data('sortStr');

        if(_.isEmpty(aSortStr)) {
            aSortStr = generateUnknownSortStr();
        }

        let bSortStr = nodeB.data('sortStr');

        if(_.isEmpty(bSortStr)) {
            bSortStr = generateUnknownSortStr();
        }

        return aSortStr.localeCompare(bSortStr);
    }

    return {
        name: "grid",
        fit: fit,
        boundingBox: boundingBox,
        avoidOverlap: true,
        avoidOverlapPadding: 140,
        position: nodeRowCol,
        sort: sortNodes,
        nodeDimensionsIncludeLabels: true,
    }
};