import {fromJS} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Watcher} from "../model";

const onRemoveStreamWatcher = (state: State, action: Cmd.RemoveStreamWatcher): State => {
    return state.remove(action.watcherId);
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.REMOVE_STREAM_WATCHER:
            return onRemoveStreamWatcher(state, <Cmd.RemoveStreamWatcher>action)
        default:
            return state;
    }
}