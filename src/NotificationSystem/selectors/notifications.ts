import {State} from "../../reducer";
import { createSelector } from 'reselect';
import {PATH_NOTIFICATIONS} from "../reducers";
import {NotificationModel} from "../model";
import {fromJS, List} from "immutable";

export const notificationsSelector = (state: State, props: any) => state.getIn([PATH_NOTIFICATIONS, "messages"], fromJS([]));

export const makeGetNotifications = (): (state: State, props: any) => List<NotificationModel.Message> => {
    return createSelector(
        [notificationsSelector] as any,
        (messages: List<NotificationModel.Message>): List<NotificationModel.Message> => messages
    )
}

export const makeMapStateTopPropsNotifications = () => {
    const getNotifications = makeGetNotifications();

    return (state: State, props: any) => {
        return {
            messages: getNotifications(state, props),
        }
    }
}