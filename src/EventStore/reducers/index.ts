import {fromJS, Map} from "immutable";
import {Action} from "redux";
import {Query, Cmd} from "../actions";
import applyStreamListChanges from "./applyStreamListChanges";
import applyStreamEvents from "./applyStreamEvents";
import applyFilteredStreamEvents from "./applyFilteredStreamEvents";
import applyShowFilterBox from "./applyShowFilterBox";
import applyAddWatcher from "./applyAddWatcher";
import {Stream, Watcher} from "../model";

const initialState = fromJS({
    streamList: {
        isLoading: true,
        streams: fromJS([]),
        isFiltering: false,
        filter: "",
        err: false
    },
    selectedStream: null,
    selectedWatcher: null,
    watcherList: fromJS({})
});

function getSelectedStream(action: Cmd.SetSelectedStream): Stream.StreamName {
    return action.selectedStream
}

function getSelectedWatcher(action: Cmd.SetSelectedWatcher): Watcher.Id {
    return action.selectedWatcher
}

export const PATH = 'event-store';
export const WATCHERS_PATH = ['event-store', 'watcherList'];

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Query.GET_INITIAL_STREAM_LIST:
            return state.set("streamList", applyStreamListChanges(state.get("streamList", initialState.get("streamList")), action));
        case Query.GET_LATEST_STREAM_EVENTS:
        case Query.GET_OLDER_STREAM_EVENTS:
            return state.set("streamList", applyStreamEvents(state.get("streamList", initialState.get("streamList")), action));
        case Query.GET_FILTERED_STREAM_EVENTS:
            return state.set("streamList", applyFilteredStreamEvents(state.get("streamList", initialState.get("streamList")), action));
        case Cmd.SET_SELECTED_STREAM:
            return state.set("selectedStream", getSelectedStream(<Cmd.SetSelectedStream>action));
        case Cmd.SET_SELECTED_WATCHER:
            return state.set("selectedWatcher", getSelectedWatcher(<Cmd.SetSelectedWatcher>action));
        case Cmd.SHOW_FILTER_BOX:
            return state.set("streamList", applyShowFilterBox(state.get("streamList", initialState.get("streamList")), action));
        case Cmd.ADD_STREAM_WATCHER:
            return state.set("watcherList", applyAddWatcher(state.get("watcherList", Map({})), action));
        default:
            return state;
    }
}