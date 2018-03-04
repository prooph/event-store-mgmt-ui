import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";

const onToggleStreamWatcher = (state: State, action: Cmd.ToggleStreamWatcher): State => {
    return state.setIn([action.watcherId, 'watching'], action.isWatching)
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.TOGGLE_STREAM_WATCHER:
            return onToggleStreamWatcher(state, <Cmd.ToggleStreamWatcher>action)
        default:
            return state;
    }
}