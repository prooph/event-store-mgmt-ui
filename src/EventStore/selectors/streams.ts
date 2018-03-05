import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {PATH as PATH_EVENT_STORE} from '../reducers';
import {List, fromJS} from "immutable";
import {Stream} from "../model";
import {makeGetWatchers} from "./watchers";

export const streamsSelector = (state: State, props: any) => state.getIn([PATH_EVENT_STORE, "streamList", "streams"], fromJS([]))

export const makeGetStreams = (): (state: State, props: any) => List<Stream.Stream> => {
    return createSelector(
        [streamsSelector] as any,
        (streams: List<Stream.Stream>): List<Stream.Stream> => streams
    );
}

export const makeMapStateToPropsStreamsLayout = () => {
    const getStreams = makeGetStreams();
    const getWatchers = makeGetWatchers();

    return (state: State, props: any) => {
        return {
            streams: getStreams(state, props),
            existingWatchers: getWatchers(state, props).toList(),
        }
    }
}
