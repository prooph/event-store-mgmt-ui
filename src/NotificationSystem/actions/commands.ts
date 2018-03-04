import {Action} from "redux";
import {NotificationModel} from "../model";

export const CMD_NOTIFY = "NotificationSystem.Notify";

export interface Notify extends Action {
    message: NotificationModel.Message
}

export function notify(message: NotificationModel.Message): Notify {
    return {
        message,
        type: CMD_NOTIFY
    }
}

export function info(title: string, message: string, autoDismiss?: boolean): Notify {
    if(typeof autoDismiss === "undefined") {
        autoDismiss = true;
    }

    return {
        message: new NotificationModel.Message({
            title: title,
            message: message,
            level: "info",
            autoDismiss: autoDismiss? 1 : 0,
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
        }),
        type: CMD_NOTIFY
    }
}
