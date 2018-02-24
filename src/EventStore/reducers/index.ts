import {fromJS} from "immutable";
import {Action} from "redux";
import {Query, Cmd} from "../actions";
import applyStreamListChanges from "./applyStreamListChanges";
import applyStreamEvents from "./applyStreamEvents";
import {Stream} from "../model";

const initialState = fromJS({
    streamList: {
        isLoading: true,
        streams: fromJS([]),
        isFiltering: false,
        filter: "",
        err: false
    },
    selectedStream: null,
});

function getSelectedStream(action: Cmd.SetSelectedStream): Stream.StreamName {
    return action.selectedStream
}

export const PATH = 'event-store';

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Query.GET_INITIAL_STREAM_LIST:
            return state.set("streamList", applyStreamListChanges(state.get("streamList", initialState.get("streamList")), action));
        case Query.GET_LATEST_STREAM_EVENTS:
        case Query.GET_OLDER_STREAM_EVENTS:
            return state.set("streamList", applyStreamEvents(state.get("streamList", initialState.get("streamList")), action));
        case Cmd.SET_SELECTED_STREAM:
            return state.set("selectedStream", getSelectedStream(<Cmd.SetSelectedStream>action));
        default:
            return state;
    }
}