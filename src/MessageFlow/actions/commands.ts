import {Action} from "redux";
import {MessageFlow} from "../model/MessageFlow";

export const CMD_SAVE_MESSAGE_FLOW = 'saveMessageFlow';

export interface SaveMessageFlow extends Action {
    messageFlow: MessageFlow
}

export function saveMessageFlow(messageFlow: MessageFlow): SaveMessageFlow {
    return {
        messageFlow: messageFlow,
        type: CMD_SAVE_MESSAGE_FLOW
    }
};