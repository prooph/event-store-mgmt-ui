import {Action} from "redux";
import {Stream, Filter, Watcher, Event} from "../model";
import {List} from "immutable";
import {sendHttpRequest, SendHttpRequest, WebDataAction} from "../../api/WebData";
import {EventStoreHttpApi} from "../model/EventStoreHttpApi";

export const SET_SELECTED_STREAM = 'SET_SELECTED_STREAM';
export const SET_SELECTED_WATCHER = 'SET_SELECTED_WATCHER';
export const SHOW_FILTER_BOX = 'SHOW_FILTER_BOX';
export const SHOW_INSERT_BOX = 'SHOW_INSERT_BOX';
export const ADD_STREAM_WATCHER = 'ADD_STREAM_WATCHER';
export const APPEND_FILTERS_TO_WATCHER = 'APPEND_FILTERS_TO_WATCHER';
export const REMOVE_STREAM_WATCHER = 'REMOVE_STREAM_WATCHER';
export const TOGGLE_STREAM_WATCHER = 'TOGGLE_STREAM_WATCHER';
export const RECORD_WATCHER_EVENT = 'RECORD_WATCHER_EVENT';
export const SHOW_WATCHER_FILTER_BOX = 'SHOW_WATCHER_FILTER_BOX';
export const UPDATE_WATCHER_FILTERS = 'UPDATE_WATCHER_FILTERS';
export const INSERT_EVENTS = 'INSERT_EVENTS';

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

export interface ShowInsertBox extends Action {
    show: boolean,
    streamName: Stream.StreamName,
}

export function showInsertBox(streamName: Stream.StreamName, show: boolean): ShowInsertBox {
    return {
        type: SHOW_INSERT_BOX,
        show,
        streamName
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

export interface AppendFiltersToWatcher extends Action {
    watcherId: Watcher.Id,
    streamName: Stream.StreamName,
    filters: List<Filter.StreamFilter>
}

export function appendFiltersToWatcher(
    watcherId: Watcher.Id,
    streamName: Stream.StreamName,
    filters: List<Filter.StreamFilter>): AppendFiltersToWatcher {
    return {
        watcherId,
        streamName,
        filters,
        type: APPEND_FILTERS_TO_WATCHER
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

export interface ShowWatcherFilterBox extends Action {
    watcherId: Watcher.Id,
    show: boolean,
}

export function showWatcherFilterBox(watcherId: Watcher.Id, show: boolean): ShowWatcherFilterBox {
    return {
        watcherId,
        show,
        type: SHOW_WATCHER_FILTER_BOX,
    }
}

export interface UpdateWatcherFilters extends Action {
    watcherId: Watcher.Id,
    filters: List<Filter.StreamFilterGroup>,
}

export function updateWatcherFilters(watcherId: Watcher.Id, filters: List<Filter.StreamFilterGroup>): UpdateWatcherFilters {
    return {
        watcherId,
        filters,
        type: UPDATE_WATCHER_FILTERS
    }
}

export interface InsertEventsMetadata {
    streamName: Stream.StreamName,
    events: List<Event.DomainEvent>,
}

export interface InsertEvents extends WebDataAction<{}, InsertEventsMetadata> {}

export function insertEvents(
    httpApi: EventStoreHttpApi,
    streamName: Stream.StreamName,
    events: List<Event.DomainEvent>): SendHttpRequest<InsertEventsMetadata> {

    const request = httpApi.postStream(streamName, events);

    return sendHttpRequest(request, INSERT_EVENTS, {streamName, events})
}
