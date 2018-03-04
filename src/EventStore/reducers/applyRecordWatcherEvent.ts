import {fromJS, List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Watcher, Event} from "../model";

const onRecordWatcherEvent = (state: State, action: Cmd.RecordWatcherEvent): State => {
    const watcher = state.get(action.watcherId) as Watcher.Watcher;

    if(!watcher) {
        return state;
    }

    return state.set(action.watcherId, watcher.recordEvent(action.event));
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.RECORD_WATCHER_EVENT:
            return onRecordWatcherEvent(state, <Cmd.RecordWatcherEvent>action)
        default:
            return state;
    }
}