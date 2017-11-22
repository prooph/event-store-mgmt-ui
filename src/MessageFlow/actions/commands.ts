import {Action} from "redux";
import {MessageFlow} from "../model/MessageFlow";

export const CMD_SAVE_MESSAGE_FLOW = 'saveMessageFlow';
export const CMD_IMPORT_MESSAGE_FLOW_FILE = 'importMessageFlowFile';

export interface SaveMessageFlow extends Action {
    messageFlow: MessageFlow
}

export function saveMessageFlow(messageFlow: MessageFlow): SaveMessageFlow {
    return {
        messageFlow: messageFlow,
        type: CMD_SAVE_MESSAGE_FLOW
    }
};

export interface ImportMessageFlowFile extends Action {
    file: File
}

export function importMessageFlowFile(file: File): ImportMessageFlowFile {
    return {
        file: file,
        type: CMD_IMPORT_MESSAGE_FLOW_FILE
    }
};