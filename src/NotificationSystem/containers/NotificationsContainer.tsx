import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {translate, InjectedTranslateProps} from "react-i18next";
import {NotificationModel} from "../model";
import { Dispatch } from '../../types/types';
import {Command} from '../actions';
import Notifications from "../components/Notifications";
import {NotificationsSelector} from "../selectors";
import {List} from "immutable";

interface StateProps extends InjectedTranslateProps {
    messages: List<NotificationModel.Message>
}

interface PropsToDispatch {
    onMessageShown: (message: NotificationModel.Message) => void,
}

interface OwnProps {
    maxMessages?: number,
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        onMessageShown: Command.notify,
    } as any, dispatch);
};

const NotificationsContainer = connect<StateProps, PropsToDispatch, OwnProps>(NotificationsSelector.makeMapStateTopPropsNotifications(), mapDispatchToProps, undefined, {pure: false})(Notifications as any);

export default translate()(NotificationsContainer);