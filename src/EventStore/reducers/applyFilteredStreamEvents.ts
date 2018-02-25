import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Query} from "../actions";
import {Stream} from '../model';
import {onGetStreamEvents, getStream, replaceStream} from "./applyStreamEvents";

function onGetFilteredStreamEvents(state: State, action: Query.GetFilteredStreamEvents): State {
    state = onGetStreamEvents(state, action, false);

    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    const stream: Stream.Stream = getStream(streams, action.metadata.streamName);

    return state.set('streams', replaceStream(streams, stream.replaceFilters(action.metadata.filters)));
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Query.GET_FILTERED_STREAM_EVENTS:
            return onGetFilteredStreamEvents(state, <Query.GetFilteredStreamEvents>action);
        default:
            return state;
    }
}
