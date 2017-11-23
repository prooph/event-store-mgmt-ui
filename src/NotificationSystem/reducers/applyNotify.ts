import {State} from "../../reducer";
import {Command} from "../actions";
import {List, fromJS} from "immutable";
import {NotificationModel} from "../model";

export function applyNotify(state: State, action: Command.Notify): State {
    const messages: List<NotificationModel.Message> = fromJS([]).push(action.message).filter(msg => !msg.handled());
    messages.forEach(msg => console.log(msg));
    //const messages: List<NotificationModel.Message> = state.get("messages", fromJS([])) as List<NotificationModel.Message>;
    return state.set("messages", messages);
}