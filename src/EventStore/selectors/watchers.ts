import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {WATCHERS_PATH} from '../reducers';
import {Map, List} from "immutable";
import {Watcher} from "../model";
import {makeGetStreams} from "./streams";
import {Stream} from "../model";

export const watchersSelector = (state: State, props?: any) => state.getIn(WATCHERS_PATH, Map({}))

export const makeGetWatchers = (): (state: State, props: any) => Map<string, Watcher.Watcher> => {
    return createSelector(
        [watchersSelector] as any,
        (watchers: Map<string, Watcher.Watcher>): Map<string, Watcher.Watcher> => watchers
    );
}

export const makeMapStateToPropsWatchersLayout = () => {
    const getWatchers = makeGetWatchers();
    const getAvailableStreams = makeGetStreams();

    return (state: State, props: any) => {
        return {
            watchers: getWatchers(state, props),
            availableStreams: getAvailableStreams(state, props).map(stream => stream.name()) as List<Stream.StreamName>,
        }
    }
}