import {fromJS, Map} from 'immutable';
import {combineReducers} from 'redux-immutable';
import { Action } from 'redux';
import messageFlowReducer, {PATH_MESSAGE_FLOW, iNITIAL_STATE as INITIAL_MESSAGE_FLOW_STATE} from "./MessageFlow/reducers";
import { Command as MessageFlowCommand } from "./MessageFlow/actions";

export interface State extends Map<string, {}> {}

let initialState = {};

initialState[PATH_MESSAGE_FLOW] = INITIAL_MESSAGE_FLOW_STATE;

export const INITIAL_STATE = fromJS(initialState);

let reducers = {};

reducers[PATH_MESSAGE_FLOW] = (state = INITIAL_MESSAGE_FLOW_STATE, action: Action) => {
    switch (action.type) {
        case MessageFlowCommand.CMD_SAVE_MESSAGE_FLOW:
            return messageFlowReducer(state, action);
        default:
            return state;
    }
};

export default combineReducers(reducers);
