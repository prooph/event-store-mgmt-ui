import {Action} from "redux";
import {Stream, Filter, Watcher, Event} from "../model";
import {List} from "immutable";

export const SET_SELECTED_STREAM = 'SET_SELECTED_STREAM';
export const SET_SELECTED_WATCHER = 'SET_SELECTED_WATCHER';
export const SHOW_FILTER_BOX = 'SHOW_FILTER_BOX';
export const ADD_STREAM_WATCHER = 'ADD_STREAM_WATCHER';
export const REMOVE_STREAM_WATCHER = 'REMOVE_STREAM_WATCHER';
export const TOGGLE_STREAM_WATCHER = 'TOGGLE_STREAM_WATCHER';
export const RECORD_WATCHER_EVENT = 'RECORD_WATCHER_EVENT';

export interface SetSelectedStream extends Action {
    selectedStream: Stream.StreamName
}

export function setSelectedStream(streamName: Stream.StreamName): SetSelectedStream {
    return {
        selectedStream: streamName,
        type: SET_SELECTED_STREAM
    }
}

export interface SetSelectedWatcher extends Action {
    selectedWatcher: Watcher.Id,
}

export function setSelectedWatcher(watcherId: Watcher.Id): SetSelectedWatcher {
    return {
        selectedWatcher: watcherId,
        type: SET_SELECTED_WATCHER
    }
}

export interface ShowFilterBox extends Action {
    show: boolean,
    streamName: Stream.StreamName,
}

export function showFilterBox(streamName: Stream.StreamName, show: boolean): ShowFilterBox {
    return {
        type: SHOW_FILTER_BOX,
        show,
        streamName,
    }
}

export interface AddStreamWatcher extends Action {
    watcherId: Watcher.Id,
    watcherName: Watcher.Name,
    streamName: Stream.StreamName,
    filters: List<Filter.StreamFilter>
}

export function addStreamWatcher(
    watcherId: Watcher.Id,
    watcherName: Watcher.Name,
    streamName: Stream.StreamName,
    filters: List<Filter.StreamFilter>): AddStreamWatcher {
    return {
        watcherId,
        watcherName,
        streamName,
        filters,
        type: ADD_STREAM_WATCHER
    }
}

export interface RemoveStreamWatcher extends Action {
    watcherId: Watcher.Id,
}

export function removeStreamWatcher(watcherId: Watcher.Id): RemoveStreamWatcher {
    return {
        watcherId,
        type: REMOVE_STREAM_WATCHER,
    }
}

export interface ToggleStreamWatcher extends Action {
    watcherId: Watcher.Id,
    isWatching: boolean,
}

export function toggleStreamWatcher(watcherId: Watcher.Id, isWatching: boolean): ToggleStreamWatcher {
    return {
        watcherId,
        isWatching,
        type: TOGGLE_STREAM_WATCHER
    }
}

export interface RecordWatcherEvent extends Action {
    watcherId: Watcher.Id,
    event: Event.DomainEvent
}

export function recordWatcherEvent(watcherId: Watcher.Id, event: Event.DomainEvent): RecordWatcherEvent {
    return {
        watcherId,
        event,
        type: RECORD_WATCHER_EVENT
    }
}
