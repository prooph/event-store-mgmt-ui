import * as React from 'react';
import {List} from "immutable";
import {NotificationModel} from "../model";
const NotificationSystemComponent = require("react-notification-system");

export interface NotificationsProps {
    messages: List<NotificationModel.Message>,
    onMessageShown: (message: NotificationModel.Message) => void
}

interface NotificationSystem {
    addNotification: (message: object) => void;
}

export default class Notifications extends React.Component<NotificationsProps, undefined> {
    system: NotificationSystem

    componentWillReceiveProps(nextProps: NotificationsProps) {
        nextProps.messages.filter(msg => !msg.handled())
            .forEach((msg) => {
                this.system.addNotification(msg.toJS());
                this.props.onMessageShown(msg.markAsHandled())
            });
    }

    render() {
        return <NotificationSystemComponent ref={(sys) => this.system = sys} />
    }
}
