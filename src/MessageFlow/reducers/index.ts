import applySaveMssageFlow from "./applySaveMessageFlow";
import {State} from "../../reducer";
import {Action} from "redux";
import {Command} from "../actions";
import {fromJS} from "immutable";
import {MessageFlow} from "../model";

export const PATH_MESSAGE_FLOW = 'message-flow';
export const iNITIAL_STATE = fromJS({});

const onRecordEvent = (messageFlow: MessageFlow.MessageFlow, action: Command.RecordEvent): State => {
    return messageFlow.recordEvent(action.event);
}

export default (state: MessageFlow.MessageFlow, action: Action): State => {
    switch (action.type) {
        case Command.CMD_SAVE_MESSAGE_FLOW:
            return applySaveMssageFlow(state, action);
        case Command.CMD_START_WATCH_SESSION:
            return state.set("watching", true);
        case Command.CMD_STOP_WATCH_SESSION:
            return state.stopWatching();
        case Command.CMD_RECORD_MESSAGE_FLOW_EVENT:
            return onRecordEvent(state, <Command.RecordEvent>action);
        default:
            return state;
    }
}
