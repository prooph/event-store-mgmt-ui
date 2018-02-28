import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {STATE_PATH, Model} from '../../EventStore/index';

export const selectedStream = (state: State, props: any) => state.getIn([STATE_PATH, "selectedStream"], null)
export const selectedWatcher = (state: State, props: any) => state.getIn([STATE_PATH, "selectedWatcher"], null)

export const makeGetSelectedStream = (): (state: State, props: any) => Model.Stream.StreamName => {
    return createSelector(
        [selectedStream] as any,
        (selectedStream: Model.Stream.StreamName): Model.Stream.StreamName => selectedStream
    );
}

export const makeGetSelectedWatcher = (): (state: State, props: any) => Model.Watcher.Id => {
    return createSelector(
        [selectedWatcher] as any,
        (selectedWatcher: Model.Watcher.Id): Model.Watcher.Id => selectedWatcher
    );
}

export const makeMapStateToPropsTopMenu = () => {
    const getSelectedStream = makeGetSelectedStream();
    const getSelectedWatcher = makeGetSelectedWatcher();

    return (state: State, props: any) => {
        return {
            selectedStream: getSelectedStream(state, props),
            selectedWatcher: getSelectedWatcher(state, props),
        }
    }
}