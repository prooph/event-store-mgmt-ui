import {fromJS, Map} from 'immutable';
import {combineReducers} from 'redux-immutable';
import { Action } from 'redux';

export interface State extends Map<string, {}> {}

export const INITIAL_STATE = fromJS({});

export default combineReducers(
    {
        // put your reducers here
        test: (state = INITIAL_STATE, action: Action) => {
            switch (action.type) {
                default:
                    return state;
            }
        }
    }
);
