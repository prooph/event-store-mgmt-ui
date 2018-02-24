import {Action} from "redux";
import {Stream} from "../model";

export const SET_SELECTED_STREAM = 'SET_SELECTED_STREAM';

export interface SetSelectedStream extends Action {
    selectedStream: Stream.StreamName
}

export function setSelectedStream(streamName: Stream.StreamName): SetSelectedStream {
    return {
        selectedStream: streamName,
        type: SET_SELECTED_STREAM
    }
}
