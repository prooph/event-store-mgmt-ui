import {List} from 'immutable';
import {sendHttpRequest, SendHttpRequest, WebDataAction, ErrorCodeWhitelist} from "../../api/WebData";
import {Stream, Event, Filter} from "../model";
import {EventStoreHttpApi, StreamResponseType} from "../model/EventStoreHttpApi";

export const GET_INITIAL_STREAM_LIST = 'GET_INITIAL_STREAM_LIST';
export const GET_LATEST_STREAM_EVENTS = 'GET_LATEST_STREAM_EVENTS';
export const GET_OLDER_STREAM_EVENTS = 'GET_OLDER_STREAM_EVENTS';
export const GET_FILTERED_STREAM_EVENTS = 'GET_FILTERED_STREAM_EVENTS';
export const EmptyStreamErrorCodes = [400, 404];

export interface GetInitialStreamList extends WebDataAction<Stream.StreamName[], {}> {}

export function getInitialStreamList(httpApi: EventStoreHttpApi): SendHttpRequest<{}> {
    const request = {'url': httpApi.getStreams()};
    return sendHttpRequest<{}>(request, GET_INITIAL_STREAM_LIST);
}

export interface GetLatestStreamEvents extends WebDataAction<StreamResponseType, {streamName: Stream.StreamName}> {}

export function getLatestStreamEvents(httpApi: EventStoreHttpApi, streamName: string, limit?: number): SendHttpRequest<{streamName: Stream.StreamName}> {
    limit = limit || 10;
    const request = {'url': httpApi.getLatestStreamEvents(streamName, limit)};
    return sendHttpRequest<{streamName: Stream.StreamName}>(request, GET_LATEST_STREAM_EVENTS, {streamName});
}

export interface GetOlderStreamEvents extends WebDataAction<StreamResponseType, {streamName: Stream.StreamName} & ErrorCodeWhitelist> {}

export function getOlderStreamEvents(
    httpApi: EventStoreHttpApi,
    streamName: string,
    event: Event.DomainEvent,
    filters: List<Filter.StreamFilter>,
    limit?: number): SendHttpRequest<{streamName: Stream.StreamName} & ErrorCodeWhitelist> {
    limit = limit || 10;
    const request = {'url': httpApi.getOlderEvents(streamName, event, filters, limit)};
    return sendHttpRequest<{streamName: Stream.StreamName} & ErrorCodeWhitelist>(
        request,
        GET_OLDER_STREAM_EVENTS,
        {streamName, errorCodeWhitelist: EmptyStreamErrorCodes}
        );
}

interface FilteredMetadata {streamName: Stream.StreamName, filters: List<Filter.StreamFilter>};

export interface GetFilteredStreamEvents extends WebDataAction<StreamResponseType, FilteredMetadata> {}

export function getFilteredStreamEvents(
    httpApi: EventStoreHttpApi,
    streamName: Stream.StreamName,
    filters: List<Filter.StreamFilter>, limit?: number): SendHttpRequest<FilteredMetadata> {
    limit = limit || 10;
    const request = {'url': httpApi.getFilteredEvents(streamName, filters, limit)};
    return sendHttpRequest<FilteredMetadata>(request, GET_FILTERED_STREAM_EVENTS, {streamName, filters});
}
