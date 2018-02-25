import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Stream} from "../model";
import {getStream, replaceStream} from "./applyStreamEvents";

function onShowFilterBox(state: State, action: Cmd.ShowFilterBox): State {
    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    const stream: Stream.Stream = getStream(streams, action.streamName);

    return state.set(
        'streams',
        replaceStream(streams, stream.set("showFilterBox", action.show) as Stream.Stream
        )
    )
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Cmd.SHOW_FILTER_BOX:
            return onShowFilterBox(state, <Cmd.ShowFilterBox>action);
        default:
            return state;
    }
}