import {fromJS, List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd, Query} from "../actions";
import {Stream} from '../model';
import {getStream, replaceStream} from "./applyStreamEvents";
import {WebData} from '../../api';

function onInsertEvents(state: State, action: Cmd.InsertEvents): State {

    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    let stream: Stream.Stream = getStream(streams, action.metadata.streamName);

    if(WebData.isError(action.webData)) {
        stream = stream.set('failedInsertEvents', action.metadata.events) as Stream.Stream;
        stream = stream.set('inserting', false) as Stream.Stream;
    }

    if(WebData.isLoading(action.webData)) {
        stream = stream.set('failedInsertEvents', fromJS([])) as Stream.Stream;
        stream = stream.set('inserting', true) as Stream.Stream;
    }

    if(WebData.isSuccess(action.webData)) {
        stream = stream.set('failedInsertEvents', fromJS([])) as Stream.Stream;
        stream = stream.set('inserting', false) as Stream.Stream;
    }

    return state.set('streams', replaceStream(streams, stream));
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Cmd.INSERT_EVENTS:
            return onInsertEvents(state, <Cmd.InsertEvents>action);
        default:
            return state;
    }
}