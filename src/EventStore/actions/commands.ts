import {Action} from "redux";
import {Stream} from "../model";

export const SET_SELECTED_STREAM = 'SET_SELECTED_STREAM';
export const SHOW_FILTER_BOX = 'SHOW_FILTER_BOX';

export interface SetSelectedStream extends Action {
    selectedStream: Stream.StreamName
}

export function setSelectedStream(streamName: Stream.StreamName): SetSelectedStream {
    return {
        selectedStream: streamName,
        type: SET_SELECTED_STREAM
    }
}

export interface ShowFilterBox extends Action {
    show: boolean,
    streamName: Stream.StreamName,
}

export function showFilterBox(streamName: Stream.StreamName, show: boolean): ShowFilterBox {
    return {
        type: SHOW_FILTER_BOX,
        show,
        streamName,
    }
}
