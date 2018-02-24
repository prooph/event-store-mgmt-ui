import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {STATE_PATH, Model} from '../../EventStore/index';

export const selectedStream = (state: State, props: any) => state.getIn([STATE_PATH, "selectedStream"], null)

export const makeGetSelectedStream = (): (state: State, props: any) => Model.Stream.StreamName => {
    return createSelector(
        [selectedStream] as any,
        (selectedStream: Model.Stream.StreamName): Model.Stream.StreamName => selectedStream
    );
}

export const makeMapStateToPropsTopMenu = () => {
    const getSelectedStream = makeGetSelectedStream();

    return (state: State, props: any) => {
        return {
            selectedStream: getSelectedStream(state, props),
        }
    }
}