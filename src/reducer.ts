import {fromJS, Map} from 'immutable';
import {combineReducers} from 'redux-immutable';
import { Action } from 'redux';
import messageFlowReducer, {PATH_MESSAGE_FLOW, iNITIAL_STATE as INITIAL_MESSAGE_FLOW_STATE} from "./MessageFlow/reducers";
import notificationsReducer, {PATH_NOTIFICATIONS, iNITIAL_STATE as INITIAL_NOTIFICATIONS_STATE} from "./NotificationSystem/reducers";
import {Reducer as EventStoreReducer, STATE_PATH as PATH_EVENT_STORE } from "./EventStore/index";
import { Command as MessageFlowCommand } from "./MessageFlow/actions";
import { Command as NotificationsCommand } from "./NotificationSystem/actions";

export interface State extends Map<string, {}> {}

let initialState = {};

initialState[PATH_MESSAGE_FLOW] = INITIAL_MESSAGE_FLOW_STATE;
initialState[PATH_NOTIFICATIONS] = INITIAL_NOTIFICATIONS_STATE;
export const INITIAL_STATE = fromJS(initialState);

let reducers = {};

reducers[PATH_MESSAGE_FLOW] = messageFlowReducer;

reducers[PATH_NOTIFICATIONS] = (state = INITIAL_NOTIFICATIONS_STATE, action: Action) => {
    switch (action.type) {
        case NotificationsCommand.CMD_NOTIFY:
            return notificationsReducer(state, action);
        default:
            return state;
    }
};

reducers[PATH_EVENT_STORE] = EventStoreReducer;

export default combineReducers(reducers);
