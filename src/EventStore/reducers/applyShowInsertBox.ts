import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Cmd} from "../actions";
import {Stream} from "../model";
import {getStream, replaceStream} from "./applyStreamEvents";

function onShowInsertBox(state: State, action: Cmd.ShowInsertBox): State {
    const streams: List<Stream.Stream> = state.get("streams") as List<Stream.Stream>;
    const stream: Stream.Stream = getStream(streams, action.streamName);

    return state.set(
        'streams',
        replaceStream(streams, stream.set("showInsertBox", action.show) as Stream.Stream
        )
    )
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Cmd.SHOW_INSERT_BOX:
            return onShowInsertBox(state, <Cmd.ShowInsertBox>action);
        default:
            return state;
    }
}