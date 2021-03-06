import {emptyMessageFlow, mergeElements} from "./MessageFlow";
import {EdgeDataDefinition, EdgeDefinition, NodeDataDefinition, NodeDefinition} from "cytoscape";

interface TestNodeDataDefinition extends NodeDataDefinition {
    text: string,
    service: string
}

interface TestEdgeDataDefinition extends EdgeDataDefinition {
    service: string
}

interface TestNodeDefinition extends NodeDefinition {
    data: TestNodeDataDefinition
}

interface TestEdgeDefinition extends EdgeDefinition {
    data: TestEdgeDataDefinition
}

test("Empty message flow", () => {
    expect(emptyMessageFlow().elements()).toEqual({nodes: [], edges: []});
})

describe("Merge elements", () => {
    const makeNode = (id: string, text?: string, service?: string): TestNodeDefinition => {
        return {
            data: {id: id, text: text || "", service: service || "test"}
        }
    }

    const makeEdge = (id: string, source: string, target: string, service?: string): TestEdgeDefinition => {
        return {
            data: {id: id, source: source, target: target, service: service || "test"}
        };
    };

    test("b is merged into empty a", () => {
        const a = {nodes: [], edges: []};
        const b = {nodes: [makeNode('1'), makeNode('2')], edges: [makeEdge('1_2', '1', '2')]};

        const merged = mergeElements(a, b, "test");

        expect(merged).toEqual(b);
    })

    /* @TODO: Rewrite tests, nodes are replaced now except their position
    test("Existing nodes in a are not replaced", () => {
        const a = {nodes: [makeNode('1', 'org')], edges: []};
        const b = {nodes: [makeNode('1', 'replaced'), makeNode('2')], edges: [makeEdge('1_2', '1', '2')]};

        const merged = mergeElements(a, b, "test");

        expect(merged).toEqual({nodes: [makeNode('2'), makeNode('1', 'org')], edges: [makeEdge('1_2', '1', '2')]});
    })

    test("Existing edges in a are not replaced", () => {
        const a = {nodes: [makeNode('1', 'org')], edges: [makeEdge('1_2', '1', '2')]};
        const b = {nodes: [makeNode('1', 'replaced'), makeNode('2')], edges: [makeEdge('1_2', '1', '3')]};

        const merged = mergeElements(a, b, "test");

        expect(merged).toEqual({nodes: [makeNode('2'), makeNode('1', 'org')], edges: [makeEdge('1_2', '1', '2')]});
    })
    */

    test("Nodes existing in a but not in b are removed", () => {
        const a = {nodes: [makeNode('1', 'org'), makeNode('2')], edges: []};
        const b = {nodes: [makeNode('2'), makeNode('3')], edges: []};

        const merged = mergeElements(a, b, "test");

        expect(merged).toEqual({nodes: [makeNode('3'), makeNode('2')], edges: []});
    })

    test("Edges existing in a but not in b are removed", () => {
        const a = {nodes: [], edges: [makeEdge('1_2', '1', '2'), makeEdge('1_3', '1', '3')]};
        const b = {nodes: [], edges: [makeEdge('1_4', '1', '4'), makeEdge('1_3', '1', '2')]};

        const merged = mergeElements(a, b, "test");

        expect(merged).toEqual({nodes: [], edges: [makeEdge('1_4', '1', '4'), makeEdge('1_3', '1', '3')]});
    })
})

