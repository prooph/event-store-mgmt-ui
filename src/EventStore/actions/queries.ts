import {sendHttpRequest, SendHttpRequest, WebDataAction} from "../../api/WebData";
import {Stream, Event} from "../model";
import {EventStoreHttpApi, StreamResponseType} from "../model/EventStoreHttpApi";

export const GET_INITIAL_STREAM_LIST = 'GET_INITIAL_STREAM_LIST';
export const GET_LATEST_STREAM_EVENTS = 'GET_LATEST_STREAM_EVENTS';
export const GET_OLDER_STREAM_EVENTS = 'GET_OLDER_STREAM_EVENTS';

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

export interface GetOlderStreamEvents extends WebDataAction<StreamResponseType, {streamName: Stream.StreamName}> {}

export function getOlderStreamEvents(httpApi: EventStoreHttpApi, streamName: string, event: Event.DomainEvent, limit?: number): SendHttpRequest<{streamName: Stream.StreamName}> {
    limit = limit || 10;
    const request = {'url': httpApi.getOlderEvents(streamName, event, limit)};
    return sendHttpRequest<{streamName: Stream.StreamName}>(request, GET_OLDER_STREAM_EVENTS, {streamName});
}
