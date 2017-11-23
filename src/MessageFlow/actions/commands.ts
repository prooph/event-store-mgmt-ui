import {Action} from "redux";
import {MessageFlow} from "../model/MessageFlow";
import {Command as NotifyCommand} from "../../NotificationSystem/actions";

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

export function notifyAboutNotSupportedFileType(file: File): NotifyCommand.Notify {
    return NotifyCommand.error(
        "Not supported file type",
        "A message flow file has to be of type application/json. Got " + file.type + " for file "  + file.name
    );
}