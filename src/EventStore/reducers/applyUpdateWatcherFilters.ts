import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";

const onUpdateWatcherFilters = (state: State, action: Cmd.UpdateWatcherFilters): State => {
    return state.setIn([action.watcherId, 'filters'], action.filters)
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.UPDATE_WATCHER_FILTERS:
            return onUpdateWatcherFilters(state, <Cmd.UpdateWatcherFilters>action)
        default:
            return state;
    }
}