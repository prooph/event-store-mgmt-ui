import {MessageFlow} from "../MessageFlow/model/MessageFlow";
import {ElementsDefinition} from "cytoscape";

const KEY_MESSAGE_FLOW = 'messageflow';

const emptyMessageFlow = (): MessageFlow => {
    return new MessageFlow({elements: {
        nodes: [],
        edges: []
    }});
}

export const loadMessageFlow = (): MessageFlow => {
    try {
        const serializedState = localStorage.getItem(KEY_MESSAGE_FLOW);

        if(serializedState ===  null) {
            return emptyMessageFlow();
        }

        const messageFlowData: ElementsDefinition = JSON.parse(serializedState);

        return new MessageFlow({elements: messageFlowData});
    } catch (err) {
        console.error(err);
        return emptyMessageFlow();
    }
}

export const saveMessageFlow = (flow: MessageFlow): void => {
    try {
        const serializedFlow = JSON.stringify(flow.elements());

        console.log("write to local storage", serializedFlow);

        localStorage.setItem(KEY_MESSAGE_FLOW, serializedFlow);
    } catch (err) {
        console.error(err);
        //@TODO: Better handling for write errors
    }
}