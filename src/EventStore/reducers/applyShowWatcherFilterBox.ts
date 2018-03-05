import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";

const onShowWatcherFilterBox = (state: State, action: Cmd.ShowWatcherFilterBox): State => {
    return state.setIn([action.watcherId, 'showFilterBox'], action.show)
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.SHOW_WATCHER_FILTER_BOX:
            return onShowWatcherFilterBox(state, <Cmd.ShowWatcherFilterBox>action)
        default:
            return state;
    }
}