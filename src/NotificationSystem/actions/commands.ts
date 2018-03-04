import {Action} from "redux";
import {NotificationModel} from "../model";
import * as uuid from 'uuid';

export const CMD_NOTIFY = "NotificationSystem.Notify";

function setUidIfNotSet(message: NotificationModel.Message): NotificationModel.Message {
    if(message.uid() === 'unknown') {
        return message.set("uid", uuid.v4()) as NotificationModel.Message;
    }

    return message;
}

export interface Notify extends Action {
    message: NotificationModel.Message
}

export function notify(message: NotificationModel.Message): Notify {
    message = setUidIfNotSet(message);
    return {
        message,
        type: CMD_NOTIFY
    }
}

export function info(title: string, message: string, autoDismiss?: number): Notify {
    if(typeof autoDismiss === "undefined") {
        autoDismiss = 5;
    }

    return {
        message: new NotificationModel.Message({
            title: title,
            message: message,
            level: "info",
            autoDismiss: autoDismiss,
            uid: uuid.v4(),
        }),
        type: CMD_NOTIFY
    }
}

export function error(title: string, message: string): Notify {
    return {
        message: new NotificationModel.Message({
            title: title,
            message: message,
            level: "error",
            autoDismiss: 0,
            uid: uuid.v4(),
        }),
        type: CMD_NOTIFY
    }
}
