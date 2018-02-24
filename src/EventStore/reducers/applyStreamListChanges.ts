import {List} from "immutable";
import {Action} from "redux";
import {State} from "../../reducer";
import {Query} from "../actions";
import {Stream} from "../model";

const mapStreamListData = (streamListData: Stream.StreamName[]): List<Stream.Stream> => {
    return List.of(...streamListData).map(streamName => new Stream.Stream({streamName})) as List<Stream.Stream>;
}

function onGetInitialStreamList(state: State, action: Query.GetInitialStreamList): State {
    if(action.webData.type === "loading") {
        return state.set('isLoading', true);
    }

    if(action.webData.type === "success") {
        state = state.set('isLoading', false);
        return state.set('streams', mapStreamListData(action.webData.data as Stream.StreamName[]))
    }

    if(action.webData.type === "error") {
        state = state.set('isLoading', false);
        return state.set("err", true);
    }
}

export default (state: State, action: Action) => {
    switch (action.type) {
        case Query.GET_INITIAL_STREAM_LIST:
            return onGetInitialStreamList(state, <Query.GetInitialStreamList>action);
        default:
            return state;
    }
}