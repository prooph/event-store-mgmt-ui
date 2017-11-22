import applySaveMssageFlow from "./applySaveMessageFlow";
import {State} from "../../reducer";
import {Action} from "redux";
import {Command} from "../actions";
import {fromJS} from "immutable";

export const PATH_MESSAGE_FLOW = 'message-flow';
export const iNITIAL_STATE = fromJS({});

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Command.CMD_SAVE_MESSAGE_FLOW:
            return applySaveMssageFlow(state, action);
        default:
            return state;
    }
}
