import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Filter} from "../model";
import * as uuid from "uuid";

const onAppendFiltersToWatcher = (state: State, action: Cmd.AppendFiltersToWatcher): State => {
    const filters = state.getIn([action.watcherId, 'filters']);
    const newFilterGroup = new Filter.StreamFilterGroup({
        groupId: uuid.v4(),
        streamName: action.streamName,
        filters: action.filters
    });

    return state.setIn([action.watcherId, 'filters'], filters.push(newFilterGroup))
}

export default (state: State, action: Action): State => {
    switch (action.type) {
        case Cmd.APPEND_FILTERS_TO_WATCHER:
            return onAppendFiltersToWatcher(state, <Cmd.AppendFiltersToWatcher>action)
        default:
            return state;
    }
}