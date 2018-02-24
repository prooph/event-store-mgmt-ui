import {fromJS} from "immutable";
import {Action} from "redux";
import {Query} from "../actions";
import applyStreamListChanges from "./applyStreamListChanges";
import applyStreamEvents from "./applyStreamEvents";

const initialState = fromJS({ streamList: {isLoading: true, streams: fromJS([]), isFiltering: false, filter: "", err: false}});

export const PATH = 'event-store';

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Query.GET_INITIAL_STREAM_LIST:
            return state.set("streamList", applyStreamListChanges(state.get("streamList", initialState.get("streamList")), action));
        case Query.GET_LATEST_STREAM_EVENTS:
        case Query.GET_OLDER_STREAM_EVENTS:
            return state.set("streamList", applyStreamEvents(state.get("streamList", initialState.get("streamList")), action));
        default:
            return state;
    }
}