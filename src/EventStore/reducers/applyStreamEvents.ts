import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Query} from "../actions";
import {Stream, EventStore} from '../model';

const mapStreamResponseData = (response: EventStore.StreamResponseType ): EventStore.StreamResponse => {
    return new EventStore.StreamResponse(response);
}

export const getStream = (streams: List<Stream.Stream>, streamName: Stream.StreamName): Stream.Stream => {
    const stream = streams.find(stream => stream.name() === streamName)

    return stream || new Stream.Stream({streamName})
}

export const replaceStream = (streams: List<Stream.Stream>, stream: Stream.Stream): List<Stream.Stream> => {
    const index = streams.findIndex(lStream => lStream.name() === stream.name());

    return streams.set(index, stream) as List<Stream.Stream>;
}

type GetStreamEvents = Query.GetLatestStreamEvents | Query.GetFilteredStreamEvents | Query.GetOlderStreamEvents;

export function onGetStreamEvents(state: State, action: GetStreamEvents, mergeEvents?: boolean): State {
    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    const stream: Stream.Stream = getStream(streams, action.metadata.streamName);

    if (action.webData.type === "loading") {
        return state.set('streams', replaceStream(streams, stream.set("loading", true) as Stream.Stream));
    }

    if (action.webData.type === "success") {
        const response = mapStreamResponseData(action.webData.data);

        if(typeof mergeEvents === 'undefined') {
            mergeEvents = true;
        }

        let mergedStream;

        if(mergeEvents) {
            mergedStream = stream.mergeEvents(response.events());
        } else {
            mergedStream = stream.replaceEvents(response.events());
        }

        return state.set(
            'streams',
            replaceStream(streams, mergedStream.set("loading", false).set('lastErrorCode', null) as Stream.Stream
            )
        )
    }

    if (action.webData.type === "error") {
        return state.set(
            'streams',
            replaceStream(
                streams,
                stream.set("loading", false).set('lastErrorCode', action.webData.errorCode) as Stream.Stream
            )
        );
    }
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Query.GET_LATEST_STREAM_EVENTS:
        case Query.GET_OLDER_STREAM_EVENTS:
            return onGetStreamEvents(state, <Query.GetLatestStreamEvents>action);
        default:
            return state;
    }
}