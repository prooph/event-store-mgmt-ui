import {fromJS, Map} from "immutable";
import {Action} from "redux";
import {Query, Cmd} from "../actions";
import {mapStreamResponseData} from "./applyStreamEvents";
import applyStreamListChanges from "./applyStreamListChanges";
import applyStreamEvents from "./applyStreamEvents";
import applyFilteredStreamEvents from "./applyFilteredStreamEvents";
import applyShowFilterBox from "./applyShowFilterBox";
import applyShowInsertBox from "./applyShowInsertBox";
import applyInsertEvents from "./applyInsertEvents";
import applyAddWatcher from "./applyAddWatcher";
import applyAppendFiltersToWatcher from "./applyAppendFiltersToWatcher";
import applyRemoveWatcher from "./applyRemoveWatcher"
import applyToggleWatcher from "./applyToggleStreamWatcher";
import applyRecordWatcherEvent from "./applyRecordWatcherEvent";
import applyShowWatcherFilterBox from "./applyShowWatcherFilterBox";
import applyUpdateWatcherFilters from "./applyUpdateWatcherFilters";
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
export const mapStreamResponse = mapStreamResponseData;

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
        case Cmd.SHOW_INSERT_BOX:
            return state.set("streamList", applyShowInsertBox(state.get("streamList", initialState.get("streamList")), action));
        case Cmd.INSERT_EVENTS:
            return state.set("streamList", applyInsertEvents(state.get("streamList", initialState.get("streamList")), action));
        case Cmd.ADD_STREAM_WATCHER:
            return state.set("watcherList", applyAddWatcher(state.get("watcherList", Map({})), action));
        case Cmd.APPEND_FILTERS_TO_WATCHER:
            return state.set("watcherList", applyAppendFiltersToWatcher(state.get("watcherList", Map({})), action));
        case Cmd.TOGGLE_STREAM_WATCHER:
            return state.set("watcherList", applyToggleWatcher(state.get("watcherList", Map({})), action));
        case Cmd.REMOVE_STREAM_WATCHER:
            return state.set("watcherList", applyRemoveWatcher(state.get("watcherList", Map({})), action));
        case Cmd.RECORD_WATCHER_EVENT:
            return state.set("watcherList", applyRecordWatcherEvent(state.get("watcherList", Map({})), action));
        case Cmd.SHOW_WATCHER_FILTER_BOX:
            return state.set("watcherList", applyShowWatcherFilterBox(state.get("watcherList", Map({})), action));
        case Cmd.UPDATE_WATCHER_FILTERS:
            return state.set("watcherList", applyUpdateWatcherFilters(state.get("watcherList", Map({})), action));
        default:
            return state;
    }
}