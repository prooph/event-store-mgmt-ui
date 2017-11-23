import {applyNotify} from "./applyNotify";
import {fromJS} from "immutable";
import {State} from "../../reducer";
import {Action} from "redux";
import {Command} from "../actions";

export const PATH_NOTIFICATIONS = 'notifications';
export const iNITIAL_STATE = fromJS({});

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Command.CMD_NOTIFY:
            return applyNotify(state, <Command.Notify>action);
        default:
            return state;
    }
}