import * as React from 'react';
import {List} from "immutable";
import {NotificationModel} from "../model";
const NotificationSystemComponent = require("react-notification-system");

export interface NotificationsProps {
    messages: List<NotificationModel.Message>,
    onMessageShown: (message: NotificationModel.Message) => void,
    maxMessages?: number,
}

interface NotificationSystem {
    addNotification: (message: object) => void;
}

export default class Notifications extends React.Component<NotificationsProps, undefined> {
    system: NotificationSystem

    prepareMsg = (msg: NotificationModel.Message, count: number) => {
        if (this.props.maxMessages && count >= this.props.maxMessages) {
            return;
        }

        let notification = msg.toJS();
        notification.onRemove = () => {
            this.props.onMessageShown(msg.markAsHandled())
        }

        this.system.addNotification(notification);
    }

    componentDidMount() {
        let count = 0;
        this.props.messages.filter(msg => !msg.handled())
            .forEach((msg) => {
                this.prepareMsg(msg, count);
                count++;
            });
    }

    componentWillReceiveProps(nextProps: NotificationsProps) {
        let count = 0;
        nextProps.messages.filter(msg => !msg.handled())
            .forEach((msg) => {
                this.prepareMsg(msg, count);
                count++;
            });
    }

    render() {
        return <NotificationSystemComponent ref={(sys) => this.system = sys} />
    }
}
