import {Action} from "redux";
import {MessageFlow} from "../model/MessageFlow";
import {Command as NotifyCommand} from "../../NotificationSystem/actions";
import {Model as ESModel} from "../../EventStore/index";

export const CMD_SAVE_MESSAGE_FLOW = 'CMD_SAVE_MESSAGE_FLOW';
export const CMD_IMPORT_MESSAGE_FLOW_FILE = 'CMD_IMPORT_MESSAGE_FLOW_FILE';
export const CMD_START_WATCH_SESSION = 'CMD_START_WATCH_SESSION';
export const CMD_STOP_WATCH_SESSION = 'CMD_STOP_WATCH_SESSION';
export const CMD_RECORD_MESSAGE_FLOW_EVENT = 'CMD_RECORD_MESSAGE_FLOW_EVENT';

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

export interface StartWatchSession extends Action {}
export interface StopWatchSession extends Action {}

export function startWatchSession(): StartWatchSession { return {type: CMD_START_WATCH_SESSION} };
export function stopWatchSession(): StopWatchSession { return {type: CMD_STOP_WATCH_SESSION} };

export interface RecordEvent extends Action {
    event: ESModel.Event.DomainEvent,
}

export function recordEvent(event: ESModel.Event.DomainEvent): RecordEvent {
    return {
        event,
        type: CMD_RECORD_MESSAGE_FLOW_EVENT,
    }
}