import {State} from "../../reducer";
import {Action} from "redux";
import {Command} from "../actions";
import {PATH_MESSAGE_FLOW} from "./index";

function onSaveMessageFlow(state: State, action: Command.SaveMessageFlow): State {
    return action.messageFlow;
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Command.CMD_SAVE_MESSAGE_FLOW:
            return onSaveMessageFlow(state, <Command.SaveMessageFlow>action);
        default:
            return state;
    }
}