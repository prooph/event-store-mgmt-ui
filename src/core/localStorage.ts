import {MessageFlow} from "../MessageFlow/model";
import {ElementsDefinition} from "cytoscape";

const KEY_MESSAGE_FLOW = 'messageflow';


export const loadMessageFlow = (): MessageFlow.MessageFlow => {
    try {
        const serializedState = localStorage.getItem(KEY_MESSAGE_FLOW);

        if(serializedState ===  null) {
            return MessageFlow.emptyMessageFlow();
        }

        const messageFlowData: ElementsDefinition = JSON.parse(serializedState);

        return new MessageFlow.MessageFlow({elements: messageFlowData});
    } catch (err) {
        console.error(err);
        return MessageFlow.emptyMessageFlow();
    }
}

export const saveMessageFlow = (flow: MessageFlow.MessageFlow): void => {
    try {
        const serializedFlow = JSON.stringify(flow.elements());
        localStorage.setItem(KEY_MESSAGE_FLOW, serializedFlow);
    } catch (err) {
        console.error(err);
        //@TODO: Better handling for write errors
    }
}