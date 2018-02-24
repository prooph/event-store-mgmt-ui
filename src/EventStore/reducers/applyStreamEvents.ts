import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Query} from "../actions";
import {Stream, EventStore} from '../model';

const mapStreamResponseData = (response: EventStore.StreamResponseType ): EventStore.StreamResponse => {
    return new EventStore.StreamResponse(response);
}

const getStream = (streams: List<Stream.Stream>, streamName: Stream.StreamName): Stream.Stream => {
    const stream = streams.find(stream => stream.name() === streamName)

    return stream || new Stream.Stream({streamName})
}

const replaceStream = (streams: List<Stream.Stream>, stream: Stream.Stream): List<Stream.Stream> => {
    const index = streams.findIndex(lStream => lStream.name() === stream.name());

    return streams.set(index, stream) as List<Stream.Stream>;
}

function onGetStreamEvents(state: State, action: Query.GetLatestStreamEvents | Query.GetOlderStreamEvents): State {
    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    const stream: Stream.Stream = getStream(streams, action.metadata.streamName);

    if (action.webData.type === "loading") {
        return state.set('streams', replaceStream(streams, stream.set("loading", true) as Stream.Stream));
    }

    if (action.webData.type === "success") {
        const response = mapStreamResponseData(action.webData.data);
        const mergedStream = stream.mergeEvents(response.events());

        return state.set('streams', replaceStream(streams, mergedStream.set("loading", false) as Stream.Stream))
    }

    if (action.webData.type === "error") {
        return state.set('streams', replaceStream(streams, stream.set("loading", false) as Stream.Stream));
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