import {fromJS} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Watcher} from "../model";

const onAddStreamWatcher = (state: State, action: Cmd.AddStreamWatcher): State => {
    return state.set(action.watcherId, fromJS(new Watcher.Watcher({
        watcherId: action.watcherId,
        watcherName: action.watcherName,
        streamName: action.streamName,
        filters: action.filters
    })))
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.ADD_STREAM_WATCHER:
            return onAddStreamWatcher(state, <Cmd.AddStreamWatcher>action)
        default:
            return state;
    }
}